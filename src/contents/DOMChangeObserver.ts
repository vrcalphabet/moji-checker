export type EventType = 'add' | 'remove' | 'change';
export type Callback = (type: EventType, target: HTMLElement) => void;
export interface Param {
  selector: string;
  target: HTMLElement | null;
  value: string | null;
  callback: Callback;
}

/** 特定の要素の追加・変更・削除を監視 */
export class DOMChangeObserver {
  private selectors: Param[];
  private observer: MutationObserver;

  constructor() {
    this.selectors = [];
    // DOMの変更を監視
    this.observer = new MutationObserver(() => this.callback());
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['value'],
    });
  }

  /** 全ての監視を削除する */
  reset() {
    this.selectors = [];
  }

  /** 監視対象を追加する */
  add(selector: string, callback: Callback) {
    const target = document.querySelector<HTMLElement>(selector);
    
    if (target) {
      const value = this.getValue(target);
      this.selectors.push({
        selector,
        target,
        value,
        callback,
      });
      
      callback('add', target);
    } else {
      this.selectors.push({
        selector,
        target: null,
        value: null,
        callback,
      });
    }
  }

  /** DOMが変更された場合 */
  private callback() {
    this.selectors.forEach((s) => {
      const newTarget = document.querySelector<HTMLElement>(s.selector);
      const newValue = this.getValue(newTarget);

      if (!s.target && newTarget) {
        // 要素が追加された場合
        s.callback('add', newTarget);
        s.target = newTarget;
      } else if (s.target && !newTarget) {
        // 要素が削除された場合
        s.callback('remove', s.target);
        s.target = null;
      } else if (s.target && s.value !== newValue) {
        // 要素の値が変更された場合
        s.callback('change', s.target);
        s.value = newValue;
      }
    });
  }
  
  /** 監視対象の値を取得する */
  private getValue(target: HTMLElement | null): string | null {
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return target.value;
    } else {
      return null;
    }
  }
}
