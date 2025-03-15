const myCheckbox = document.getElementById('myCheckbox');

// 設定の読み込み
chrome.storage.sync.get('myCheckboxValue', (data) => {
  myCheckbox.checked = data.myCheckboxValue || false;
});

// 設定の保存
myCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ myCheckboxValue: event.target.checked });
});