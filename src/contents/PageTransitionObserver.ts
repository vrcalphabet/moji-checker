export type PageTransitionObserverCallback = (path: string) => void;

export class PageTransitionObserver {
  private callback: PageTransitionObserverCallback;

  constructor(callback: PageTransitionObserverCallback) {
    this.callback = callback;
    // 初期ページのコールバックを実行
    this.callback(location.pathname);
  }

  /** ページ遷移を監視する（React Routerが使用しているwindow.history APIのトラップ） */
  observe() {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // ページ推移したときの処理
    window.history.pushState = (...args) => {
      originalPushState.apply(window.history, args);
      this.callback(location.pathname);
    };

    // ページ置換したときの処理
    window.history.replaceState = (...args) => {
      originalReplaceState.apply(window.history, args);
      this.callback(location.pathname);
    };

    // 戻るボタンを押したときの処理
    window.addEventListener('popstate', () => this.callback(location.pathname));
  }
}
