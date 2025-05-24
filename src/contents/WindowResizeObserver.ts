export class WindowResizeObserver {
  private callbacks: Set<() => void>;
  
  constructor() {
    this.callbacks = new Set();
    window.addEventListener('resize', () => this.callback());
  }
  
  /** ウィンドウのリサイズを監視する */
  observe(callback: () => void) {
    this.callbacks.add(callback);
  }

  /** ウィンドウのリサイズ監視を解除する */
  unobserve(callback: () => void) {
    this.callbacks.delete(callback);
  }
  
  private callback() {
    this.callbacks.forEach((cb) => cb());
  }
}