// chrome.js
class Crm {
  constructor() {
    this._activeTab = null;
  }

  async getActiveTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    this._activeTab = tab;
    return this._activeTab;
  }

  // 必要に応じて同期的なゲッターを追加
  get activeTab() {
    return this._activeTab;
  }
}

const crm = new Crm();
export { crm };