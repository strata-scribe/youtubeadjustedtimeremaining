// background.js

// Listen for messages from content scripts
if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.action === 'openOptions') {
            browser.runtime.openOptionsPage();
        }
    });
} else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.action === 'openOptions') {
            chrome.runtime.openOptionsPage();
        }
    });
} 