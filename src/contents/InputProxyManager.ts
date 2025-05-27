import { DOMChangeObserver } from './DOMChangeObserver';
import { TextModifier } from './TextModifier';
import { WindowResizeObserver } from './WindowResizeObserver';

export interface InputProxy {
  selector: string;
  intersectionObserver: IntersectionObserver | null;
  resizeObserver: ResizeObserver | null;
  layer: HTMLElement | null;
  target: HTMLInputElement | HTMLTextAreaElement | null;
  windowResizeObserver: (() => void) | null;
}

export class InputManager {
  private proxies: InputProxy[];
  private domChangeObserver: DOMChangeObserver;
  private windowResizeObserver: WindowResizeObserver;

  constructor() {
    this.proxies = [];
    this.domChangeObserver = new DOMChangeObserver();
    this.windowResizeObserver = new WindowResizeObserver();
  }

  /** 全てのプロキシを削除 */
  deleteAll() {
    this.domChangeObserver.reset();
    this.proxies.forEach((proxy) => {
      if (proxy.resizeObserver && proxy.target) {
        proxy.resizeObserver.unobserve(proxy.target);
      }
      if (proxy.layer) {
        proxy.layer.remove();
      }
      if (proxy.windowResizeObserver) {
        this.windowResizeObserver.unobserve(proxy.windowResizeObserver);
      }
    });
    this.proxies.length = 0;
  }

  /** 指定したセレクタに対してプロキシの基盤を作成 */
  createProxy(selector: string) {
    if (!selector) return;

    const refProxy = {
      selector,
      intersectionObserver: null,
      resizeObserver: null,
      layer: null,
      target: null,
      windowResizeObserver: null,
    };
    this.proxies.push(refProxy);

    this.findTarget(refProxy);
  }

  /** セレクタが存在するかを確認 */
  private findTarget(refProxy: InputProxy) {
    // 要素が追加されるまで監視を開始
    this.domChangeObserver.add(refProxy.selector, (action, target) => {
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
        return;
      }

      if (action === 'add') {
        // 要素が追加された、または元から存在している場合
        refProxy.target = target;
        this.waitUntilVisible(refProxy);
      } else if (action === 'remove') {
        // 要素が削除された場合は、再度監視を開始
        if (refProxy.resizeObserver) {
          refProxy.resizeObserver.unobserve(refProxy.target!);
        }
        if (refProxy.intersectionObserver) {
          refProxy.intersectionObserver.disconnect();
        }
        if (refProxy.layer) {
          refProxy.layer.remove();
          refProxy.layer = null;
        }
        refProxy.target = null;
      } else if (action === 'change' && refProxy.layer) {
        // テキストエリアのテキスト変更を監視
        TextModifier.highlight(refProxy.layer, refProxy.target!.value);
      }
    });
  }

  /** 要素が画面内に表示されるまで待機（画面外の場合は正確な大きさが取得できないため） */
  private waitUntilVisible(refProxy: InputProxy) {
    // 要素が表示されるまで待機
    const options = {
      rootMargin: '0px',
      threshold: 0,
    };
    const callback: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        this.create(refProxy);
        observer.unobserve(refProxy.target!);
        refProxy.intersectionObserver = null;
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(refProxy.target!);

    refProxy.intersectionObserver = observer;
  }

  /** レイヤーを作成 */
  private create(refProxy: InputProxy) {
    if (!refProxy.target) return;

    // ターゲットがすでにレイヤーを持っているか確認
    const nextSibling = refProxy.target.nextElementSibling;
    if (!(nextSibling && nextSibling.classList.contains('__MC__highlight-layer'))) {
      // ターゲットレイヤーにクラス割り当て
      refProxy.target.classList.add('__MC__target-layer');

      // バックグラウンドレイヤを作成
      const backgroundLayer = document.createElement('div');
      backgroundLayer.className = '__MC__highlight-layer';
      refProxy.target.after(backgroundLayer);
      refProxy.layer = backgroundLayer;
    } else {
      refProxy.layer = nextSibling as HTMLElement;
    }

    // 画面リサイズを監視
    refProxy.windowResizeObserver = () => {
      this.setStyle(refProxy);
    };
    this.windowResizeObserver.observe(refProxy.windowResizeObserver);

    // スタイルを設定
    this.setStyle(refProxy);

    // テキストエリアの高さ変更を監視
    const observer = new ResizeObserver(() => {
      if (!refProxy.target) return;

      // テキストエリアの高さを取得
      const height = refProxy.target.clientHeight;

      // バックグラウンドレイヤの高さを更新
      refProxy.layer!.style.height = `${height}px`;
    });
    observer.observe(refProxy.target);
    refProxy.resizeObserver = observer;

    // テキストエリアのスクロールを監視
    refProxy.target.addEventListener('scroll', () => {
      if (!refProxy.target) return;

      // バックグラウンドレイヤのスクロール位置を更新
      refProxy.layer!.scrollTop = refProxy.target.scrollTop;
    });

    // 初期値をバックグラウンドレイヤに設定
    TextModifier.highlight(refProxy.layer, refProxy.target.value);
  }

  private setStyle(refProxy: InputProxy) {
    if (!refProxy.target || !refProxy.layer) return;

    // テキストエリアの色を戻す
    refProxy.target.style.color = '';
    // 色のイージングを無くす
    refProxy.target.style.transition = 'none';

    // テキストエリアの位置とサイズ等を取得
    const top = refProxy.target.offsetTop;
    const right =
      refProxy.target.parentElement!.clientWidth -
      refProxy.target.offsetLeft -
      refProxy.target.clientWidth;
    const width = refProxy.target.clientWidth;
    const height = refProxy.target.clientHeight;
    const style = getComputedStyle(refProxy.target);

    // テキストエリアの位置とサイズ等をバックグラウンドレイヤに設定
    refProxy.layer.style.top = `${top}px`;
    refProxy.layer.style.right = `${right}px`;
    refProxy.layer.style.width = `${width}px`;
    refProxy.layer.style.height = `${height}px`;
    refProxy.layer.style.padding = style.padding;
    refProxy.layer.style.color = style.color;
    refProxy.layer.style.lineHeight = style.lineHeight;
    refProxy.layer.style.fontSize = style.fontSize;

    // テキストエリアの色を変更
    refProxy.target.style.color = 'transparent';
    refProxy.target.style.transition = '';
  }
}
