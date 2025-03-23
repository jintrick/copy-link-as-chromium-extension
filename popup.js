import { crm } from "./chrome.js";

var title; // title to copy
var url; // URL object to copy
var buttons; // Array of button[data-format]

const STORAGE_KEY = 'LastUsedFormat';
const NAME = '[CopyLinkAs]';
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

HTMLButtonElement.prototype.jintrick_showFeedback = async function(status) {
    const isSuccess = status === FEEDBACK_SUCCESS;
    const statusName = isSuccess? "button-success" : "button-error";
    const originalText = this.dataset.caption;
    this.innerHTML = isSuccess? "Copied!" : "Failed!";
    this.classList.add(statusName);

    await new Promise(resolve => setTimeout(resolve, FEEDBACK_DURATION));

    this.innerText = originalText;
    this.classList.remove(statusName);
};

// Initialize buttons
document.addEventListener('DOMContentLoaded', async () => {
    try {
  
        //set globals
        const tab = await crm.getActiveTab();
        title = tab.title;
        url = tab.url;
        buttons = document.querySelectorAll('button[data-format');

        // event listener for each button
        buttons.forEach(button => {
            button.innerText = button.dataset.caption;
            button.addEventListener('click', e => {

                const format = button.dataset.format;

                //make link text
                const text = MakeLinkAs[format]();

                //copy link text
                navigator.clipboard.writeText(text)
                    .then(() => {
                        button.jintrick_showFeedback(FEEDBACK_SUCCESS);
                    }).catch(err => {
                        button.jintrick_showFeedback(FEEDBACK_FAILED);
                        throw new Error(`${NAME} Failed to copy to clipboard`, err)
                    });

                //save last used fomat.
                chrome.storage.sync.set({[STORAGE_KEY]: format})
                    .then(result => {
                        console.log(`${NAME} format: ${format} is set`)
                    });
            });
        });

    } catch (error) {
        console.error("Error initializing popup:", error);
    }

    // move focus to the last used button
    document.querySelector("button").focus();
    chrome.storage.sync.get([STORAGE_KEY])
        .then(result => {
            const format = result[STORAGE_KEY];
            if (format) {
                document.querySelector(`button[data-format="${format}"]`)?.focus();
            }
        }).catch(err => {
            console.error(`${NAME} Failed to retrieve user preference: ${format}`, err);
        });
    
});


// Enhance key navigation
document.addEventListener('keydown', (e) => {
    const UP = -1;
    const DOWN = 1;
    switch(e.key) {
        case 'ArrowUp':
            moveTo_(UP);
            break;
        case 'ArrowDown':
            moveTo_(DOWN);
            break;
    }

    function moveTo_(direction) {
        const currentIndex = Array.from(buttons).findIndex(btn => document.activeElement === btn);
        let index;
        if (currentIndex !== -1) {
            index = currentIndex+direction;
        } else if(direction === UP) {
            index = 0;
        } else if(direction === DOWN) {
            index = buttons.length -1;
        }
        buttons[index]?.focus();
    }

  });