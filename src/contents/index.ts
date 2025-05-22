import { InputManager } from './InputProxyManager';
import { PageTransitionObserver } from './PageTransitionObserver';

import type { PageTransitionObserverCallback } from './PageTransitionObserver';

function main() {
  const inputManager = new InputManager();
  const handlePageChange: PageTransitionObserverCallback = (path) => {
    inputManager.deleteAll();

    if (path.match(/^\/home\/user\//)) {
      // console.log('User profile page detected');
      inputManager.createProxy("#User\\'s\\ Note"); // メモ
      inputManager.createProxy('#input-status-message'); // ステータスメッセージ
      inputManager.createProxy('#textarea-bio'); // 自己紹介
      inputManager.createProxy('#input-pronouns-text'); // 性別
    } else if (path.match(/^\/home\/group\/.+\/posts/)) {
      // console.log('Group posts page detected');
      inputManager.createProxy('.home-content .e1buxcrw1'); // 投稿タイトル
      inputManager.createProxy('.home-content .e1azh1061[name=post]'); // 投稿本文
    } else if (path.match(/^\/home\/group\/.+\/galleries/)) {
      // console.log('Group gallery page detected');
      inputManager.createProxy('.home-content .e1buxcrw1[name=name]'); // ギャラリータイトル
      inputManager.createProxy('.home-content .e1buxcrw1[name=description]'); // ギャラリー本文
    }
  };
  // ページ遷移を監視
  new PageTransitionObserver(handlePageChange).observe();
}

// DOMが完全に読み込まれたらmain関数を実行
if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}

console.log('[もじちぇっかー👀]: スクリプトを埋め込みました！');
