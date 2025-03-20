import { crm } from "./chrome.js";

const FEEDBACK_STATUS = {
    FAILED: 0,
    SUCCESS: 1
}

const EVENT_HANDLERS = {
    "html": makeLink_html,
    "md": makeLink_md,
    "json": makeLink_json,
};

var title;
var url;

URL.prototype.serializeAsHTML = function(){
  const ser = new XMLSerializer();
  const txt = document.createTextNode(this.href);
  return ser.serializeToString(txt);
};

HTMLButtonElement.prototype.feedback = function(status) {
    const isSuccess = status === FEEDBACK_STATUS.SUCCESS;
    const originalText = this.innerText;
    const message = isSuccess? "Copied!" : "Failed!";
    const statusName = isSuccess? "button-success" : "button-error";
    this.innerHTML = message;
    this.classList.add(statusName);
    setTimeout(() => {
        this.innerText = originalText;
        this.classList.remove(statusName);
    }, 2000);
};

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Toggle Event
        document.querySelectorAll(".shortcut-toggle").forEach((element) => {
            element.addEventListener('change', function() {
                const shortcutInput = this.closest('li').querySelector('.shortcut-input');
                shortcutInput.disabled = !this.checked;
            });
        });

        const toggleSwitch = document.getElementById('shortcut-toggle');
        const shortcutInput = document.getElementById('shortcut-input');
        
        // Toggle shortcut input state based on checkbox
        toggleSwitch.addEventListener('change', function() {
          shortcutInput.disabled = !this.checked;
        });
        
        // Initialize with default value
        shortcutInput.disabled = !toggleSwitch.checked;


        //Tabの取得
        const tab = await crm.getActiveTab();
        title = tab.title;
        url = new URL(tab.url);
        
        // event listener for each button
        for (const [format, listener] of Object.entries(EVENT_HANDLERS)) {
            const element = document.getElementById(format);
            element.addEventListener('click', function() { 
                listener(title, url, this);
            });
        }
    } catch (error) {
        console.error("Error initializing popup:", error);
    }

    // move focus to the first button
    document.querySelector("button").focus();

});

function makeLink_html(title, url, buttonElement) {
    url = url.serializeAsHTML();
    const expression = `<a href="${url}">${title}</a>`;
    copyToClipboard(expression, buttonElement);
}

function makeLink_md(title, url, buttonElement) {
    url = url.serializeAsHTML();
    const expression = `[${title}](${url})`;
    copyToClipboard(expression, buttonElement);
}

function makeLink_json(title, url, buttonElement) {
    url = url.href
    const expression = JSON.stringify({ title, url });
    copyToClipboard(expression, buttonElement);
}

function copyToClipboard(text, buttonElement) {
    try {
        navigator.clipboard.writeText(text).then(() => {
            buttonElement.feedback(SUCCESS);
        }).catch(err => {
            buttonElement.feedback(FAILED);
        });
    } catch (err) {
        buttonElement.feedback(FAILED);
    }
}

