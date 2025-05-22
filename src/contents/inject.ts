/*
  別コンテキストで実行するとHistory APIを上書きできないため
  別でスクリプトを埋め込む
*/
chrome.storage.local.get(['active'], (result) => {
  if (result.active === undefined || result.active) {
    // 拡張機能が有効な場合のみスクリプトを埋め込む
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('src/contents/index.js');
    script.dataset.extensionId = chrome.runtime.id;
    document.head.append(script);
  }
});

console.log('[もじちぇっかー👀]: スクリプトを埋め込んでいます...');