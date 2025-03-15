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
                    listener(title, url);
                });
            }
        }
    } catch (error) {
        console.error("Error initializing popup:", error);
    }
    document.querySelector("button").focus();
});

function makeLink_html(title, url) {
    const expression = `<a href="${url}">${title}</a>`;
    copyToClipboard(expression);
}

function makeLink_md(title, url) {
    const expression = `[${title}](${url})`;
    copyToClipboard(expression);
}

function makeLink_json(title, url) {            
    const expression = JSON.stringify({ title, url });
    copyToClipboard(expression);
}

function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text);
        alert("コピーしました！");
    } catch (err) {
        console.error("クリップボードへのコピーに失敗しました:", err);
        alert("コピーに失敗しました。テキスト: " + text);
    }
}