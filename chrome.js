

export class Tab{
    constructor(tab_){
        this._tab = tab_
        this._url = null;
        this.title = tab_.title
    }
    get url() {
        return this._url || (this._url = new URL(this._tab.url));
    }
}

class Crm {
    constructor() {
    }

    async getActiveTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab_] = await chrome.tabs.query(queryOptions);
        return new Tab(tab_);
    }

}

const crm = new Crm();
export { crm };