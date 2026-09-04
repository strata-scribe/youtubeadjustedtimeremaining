// popup.js

async function getTimeFormat() {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
        const result = await browser.storage.sync.get('ytAdjustedTimeFormat');
        return result.ytAdjustedTimeFormat || 'hms';
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        return new Promise(resolve => {
            chrome.storage.sync.get('ytAdjustedTimeFormat', result => {
                resolve(result.ytAdjustedTimeFormat || 'hms');
            });
        });
    } else {
        return localStorage.getItem('ytAdjustedTimeFormat') || 'hms';
    }
}

async function setTimeFormat(val) {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
        await browser.storage.sync.set({ ytAdjustedTimeFormat: val });
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeFormat: val });
    } else {
        localStorage.setItem('ytAdjustedTimeFormat', val);
    }
}

async function getDisplayPosition() {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
        const result = await browser.storage.sync.get('ytAdjustedTimePosition');
        return result.ytAdjustedTimePosition || 'default';
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        return new Promise(resolve => {
            chrome.storage.sync.get('ytAdjustedTimePosition', result => {
                resolve(result.ytAdjustedTimePosition || 'default');
            });
        });
    } else {
        return localStorage.getItem('ytAdjustedTimePosition') || 'default';
    }
}

async function setDisplayPosition(val) {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
        await browser.storage.sync.set({ ytAdjustedTimePosition: val });
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimePosition: val });
    } else {
        localStorage.setItem('ytAdjustedTimePosition', val);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const timeFormatSelect = document.getElementById('time-format');
    const displayPositionSelect = document.getElementById('display-position');

    const format = await getTimeFormat();
    const position = await getDisplayPosition();

    timeFormatSelect.value = format;
    displayPositionSelect.value = position;

    timeFormatSelect.addEventListener('change', async (e) => {
        await setTimeFormat(e.target.value);
    });

    displayPositionSelect.addEventListener('change', async (e) => {
        await setDisplayPosition(e.target.value);
    });

    document.getElementById('open-options').addEventListener('click', () => {
        if ((typeof browser !== 'undefined' && browser.runtime && browser.runtime.openOptionsPage)) {
            browser.runtime.openOptionsPage();
        } else if ((typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage)) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open('options.html', '_blank');
        }
    });
});
