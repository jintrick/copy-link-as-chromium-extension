// デフォルトテンプレート
const DEFAULT_TEMPLATES = {
  html: '<a href="${url}" target="_blank">${title}</a>',
  md: '[${title}](${url})',
  json: '{"title": "${title}", "url": "${url}"}'
};

// 要素の取得
const htmlTemplate = document.getElementById('htmlTemplate');
const mdTemplate = document.getElementById('mdTemplate');
const jsonTemplate = document.getElementById('jsonTemplate');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

// リセットボタン
document.getElementById('resetHtml').addEventListener('click', () => {
  htmlTemplate.value = DEFAULT_TEMPLATES.html;
});

document.getElementById('resetMd').addEventListener('click', () => {
  mdTemplate.value = DEFAULT_TEMPLATES.md;
});

document.getElementById('resetJson').addEventListener('click', () => {
  jsonTemplate.value = DEFAULT_TEMPLATES.json;
});

// 設定の読み込み
function loadOptions() {
  chrome.storage.sync.get({
    htmlTemplate: DEFAULT_TEMPLATES.html,
    mdTemplate: DEFAULT_TEMPLATES.md,
    jsonTemplate: DEFAULT_TEMPLATES.json
  }, (items) => {
    htmlTemplate.value = items.htmlTemplate;
    mdTemplate.value = items.mdTemplate;
    jsonTemplate.value = items.jsonTemplate;
  });
}

// 設定の保存
function saveOptions() {
  chrome.storage.sync.set({
    htmlTemplate: htmlTemplate.value,
    mdTemplate: mdTemplate.value,
    jsonTemplate: jsonTemplate.value
  }, () => {
    // 保存成功メッセージ
    statusDiv.textContent = '設定を保存しました。';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2000);
  });
}

// イベントリスナー
document.addEventListener('DOMContentLoaded', loadOptions);
saveButton.addEventListener('click', saveOptions);