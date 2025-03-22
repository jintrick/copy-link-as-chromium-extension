import { crm } from "./chrome.js";

var title;
var url;

const FEEDBACK_DURATION = 1500;
const FEEDBACK_FAILED = 0;
const FEEDBACK_SUCCESS = 1;

const MakeLinkAs = {
    "html": () => `<a href="${url.serializeAsHTML()}">${title}</a>`,
    "md": () => `[${title}](${url.serializeAsHTML()})`,
    "json": () => JSON.stringify({ title, url: url.href }),
};

URL.prototype.serializeAsHTML = function(){
  return new XMLSerializer()
    .serializeToString(
        document.createTextNode(this.href)
    );
};

HTMLButtonElement.prototype.feedback = function(status) {
    const isSuccess = status === FEEDBACK_SUCCESS;
    const statusName = isSuccess? "button-success" : "button-error";

    button.title = this.innerText;
    this.innerHTML = isSuccess? "Copied!" : "Failed!";
    this.classList.add(statusName);
    setTimeout(() => {
        this.innerText = this.title;
        this.classList.remove(statusName);
    }, FEEDBACK_DURATION);
};

document.addEventListener('DOMContentLoaded', async function() {
    try {
  
        //set title and url
        const tab = await crm.getActiveTab();
        title = tab.title;
        url = new URL(tab.url);
        
        // event listener for each button
        document.querySelectorAll('button[data-format]').forEach(button => {
            button.addEventListener('click', e => {
                const text = MakeLinkAs[button.dataset.format]();
                navigator.clipboard.writeText(text).then(() => {
                    button.feedback(FEEDBACK_SUCCESS);
                }).catch(err => {
                    button.feedback(FEEDBACK_FAILED);
                    throw new Error('クリップボードへのコピーが失敗しました：', err)
                });
            });
        });

    } catch (error) {
        console.error("Error initializing popup:", error);
    }

    // move focus to the first button
    document.querySelector("button").focus();
});



