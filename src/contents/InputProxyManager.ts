import { DOMChangeObserver } from './DOMChangeObserver';
import { TextModifier } from './TextModifier';

export interface InputProxy {
  selector: string;
  intersectionObserver: IntersectionObserver | null;
  resizeObserver: ResizeObserver | null;
  layer: HTMLElement | null;
  target: HTMLInputElement | HTMLTextAreaElement | null;
}

export class InputManager {
  private proxies: InputProxy[];
  private domChangeObserver: DOMChangeObserver;

  constructor() {
    this.proxies = [];
    this.domChangeObserver = new DOMChangeObserver();
  }

  /** 全てのプロキシを削除 */
  deleteAll() {
    this.domChangeObserver.reset();
    this.proxies.forEach((proxy) => {
      if (proxy.intersectionObserver) {
        proxy.intersectionObserver.disconnect();
      }
    });
    this.proxies = [];
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
    };
    this.proxies.push(refProxy);

    this.findTarget(refProxy);
  }

  /** セレクタが存在するかを確認 */
  findTarget(refProxy: InputProxy) {
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
  waitUntilVisible(refProxy: InputProxy) {
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
  create(refProxy: InputProxy) {
    if (!refProxy.target) return;
    
    // ターゲットレイヤーにクラス割り当て
    refProxy.target.classList.add('__MC__target-layer');

    // バックグラウンドレイヤを作成
    const backgroundLayer = document.createElement('div');
    backgroundLayer.className = '__MC__highlight-layer';
    refProxy.target.after(backgroundLayer);
    refProxy.layer = backgroundLayer;

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
    backgroundLayer.style.top = `${top}px`;
    backgroundLayer.style.right = `${right}px`;
    backgroundLayer.style.width = `${width}px`;
    backgroundLayer.style.height = `${height}px`;
    backgroundLayer.style.padding = style.padding;
    backgroundLayer.style.color = style.color;

    // テキストエリアの色を変更
    refProxy.target.style.color = 'transparent';

    // テキストエリアの高さ変更を監視
    const observer = new ResizeObserver(() => {
      if (!refProxy.target) return;
      
      // テキストエリアの高さを取得
      const height = refProxy.target.clientHeight;

      // バックグラウンドレイヤの高さを更新
      backgroundLayer.style.height = `${height}px`;
    });
    observer.observe(refProxy.target);
    refProxy.resizeObserver = observer;
    // console.log('ResizeObserver created:', refProxy);

    // テキストエリアのスクロールを監視
    refProxy.target.addEventListener('scroll', () => {
      if (!refProxy.target) return;
      
      // バックグラウンドレイヤのスクロール位置を更新
      backgroundLayer.scrollTop = refProxy.target.scrollTop;
    });

    // 初期値をバックグラウンドレイヤに設定
    TextModifier.highlight(backgroundLayer, refProxy.target.value);
  }
}
