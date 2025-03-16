import { crm } from "./chrome.js";

const EVENT_HANDLERS = {
    "html": makeLink_html,
    "md": makeLink_md,
    "json": makeLink_json
};

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const tab = await crm.getActiveTab();
        const title = tab.title;
        const url = tab.url;
        
        for (const [format, listener] of Object.entries(EVENT_HANDLERS)) {
            const element = document.getElementById(format);
            if (element) {
                element.addEventListener('click', function() { 
                    listener(title, url, this);
                });
            }
        }
    } catch (error) {
        console.error("Error initializing popup:", error);
    }
});

function makeLink_html(title, url, buttonElement) {
    const expression = `<a href="${encodeURIComponent(url)}">${title}</a>`;
    copyToClipboard(expression, buttonElement);
}

function makeLink_md(title, url, buttonElement) {
    const expression = `[${title}](${encodeURIComponent(url)})`;
    copyToClipboard(expression, buttonElement);
}

function makeLink_json(title, url, buttonElement) {            
    const expression = JSON.stringify({ title, url });
    copyToClipboard(expression, buttonElement);
}

function copyToClipboard(text, buttonElement) {
    // ボタンの元のテキストを保存
    const originalText = buttonElement.innerHTML;
    
    try {
        navigator.clipboard.writeText(text).then(() => {
            // コピー成功時のフィードバック
            buttonElement.innerHTML = "Copied!";
            buttonElement.classList.add("button-success");
            
            // 2秒後に元に戻す
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove("button-success");
            }, 2000);
        }).catch(err => {
            // エラー時のフィードバック
            buttonElement.innerHTML = "Failed!";
            buttonElement.classList.add("button-error");
            console.error("クリップボードへのコピーに失敗しました:", err);
            
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove("button-error");
            }, 2000);
        });
    } catch (err) {
        // 非同期処理以外のエラー時
        buttonElement.innerHTML = "Failed!";
        buttonElement.classList.add("button-error");
        console.error("クリップボードへのコピーに失敗しました:", err);
        
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.remove("button-error");
        }, 2000);
    }
}
