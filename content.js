console.log('[YT Adjusted Time] Content script loaded');

let lastUpdate = 0;
function throttledUpdateAdjustedTime() {
    const now = Date.now();
    if (now - lastUpdate > 500) {
        lastUpdate = now;
        updateAdjustedTime();
    }
}

function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatEndTime(secondsFromNow, use24Hour) {
    const end = new Date(Date.now() + secondsFromNow * 1000);
    let hours = end.getHours();
    const minutes = end.getMinutes().toString().padStart(2, '0');
    if (use24Hour) {
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        let h12 = hours % 12;
        if (h12 === 0) h12 = 12;
        return `${h12}:${minutes} ${ampm}`;
    }
}

// --- SETTINGS STATE CACHE ---
let settings = {
    boxColor: 'orange',
    boxColorEnabled: true,
    textColor: '#fff',
    showEndTime: true,
    theme: 'Classic',
    use24Hour: false,
    boxOpacity: 100,
    globalSaved: 0,
    collapsed: false,
    timeFormat: 'hms',
    displayPosition: 'default'
};

async function initSettings() {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
        const result = await browser.storage.sync.get(null);
        updateSettingsFromStorage(result);
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        const result = await new Promise(resolve => chrome.storage.sync.get(null, resolve));
        updateSettingsFromStorage(result);
    } else {
        // LocalStorage fallback
        settings.boxColor = localStorage.getItem('ytAdjustedTimeBoxColor') || 'orange';
        settings.boxColorEnabled = localStorage.getItem('ytAdjustedTimeBoxColorEnabled') !== 'false';
        settings.textColor = localStorage.getItem('ytAdjustedTimeTextColor') || '#fff';
        settings.showEndTime = localStorage.getItem('ytAdjustedTimeShowEndTime') !== 'false';
        settings.theme = localStorage.getItem('ytAdjustedTimeTheme') || 'Classic';
        settings.use24Hour = localStorage.getItem('ytAdjustedTime24Hour') === 'true';
        settings.boxOpacity = parseInt(localStorage.getItem('ytAdjustedTimeBoxOpacity') || '100', 10);
        settings.globalSaved = parseFloat(localStorage.getItem('ytAdjustedTimeGlobalSaved') || '0');
        settings.collapsed = localStorage.getItem('ytAdjustedTimeCollapsed') === 'true';
        settings.timeFormat = localStorage.getItem('ytAdjustedTimeFormat') || 'hms';
        settings.displayPosition = localStorage.getItem('ytAdjustedTimePosition') || 'default';
    }
}

function updateSettingsFromStorage(data) {
    if (data.ytAdjustedTimeBoxColor !== undefined) settings.boxColor = data.ytAdjustedTimeBoxColor;
    if (data.ytAdjustedTimeBoxColorEnabled !== undefined) settings.boxColorEnabled = data.ytAdjustedTimeBoxColorEnabled;
    if (data.ytAdjustedTimeTextColor !== undefined) settings.textColor = data.ytAdjustedTimeTextColor;
    if (data.ytAdjustedTimeShowEndTime !== undefined) settings.showEndTime = data.ytAdjustedTimeShowEndTime;
    if (data.ytAdjustedTimeTheme !== undefined) settings.theme = data.ytAdjustedTimeTheme;
    if (data.ytAdjustedTime24Hour !== undefined) settings.use24Hour = data.ytAdjustedTime24Hour;
    if (data.ytAdjustedTimeBoxOpacity !== undefined) settings.boxOpacity = data.ytAdjustedTimeBoxOpacity;
    if (data.ytAdjustedTimeGlobalSaved !== undefined) settings.globalSaved = data.ytAdjustedTimeGlobalSaved;
    if (data.ytAdjustedTimeCollapsed !== undefined) settings.collapsed = data.ytAdjustedTimeCollapsed;
    if (data.ytAdjustedTimeFormat !== undefined) settings.timeFormat = data.ytAdjustedTimeFormat;
    if (data.ytAdjustedTimePosition !== undefined) settings.displayPosition = data.ytAdjustedTimePosition;
}

// Listen for changes
if (typeof browser !== 'undefined' && browser.storage && browser.storage.onChanged) {
    browser.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
            const data = {};
            for (let key in changes) data[key] = changes[key].newValue;
            updateSettingsFromStorage(data);
            updateAdjustedTime();
        }
    });
} else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
            const data = {};
            for (let key in changes) data[key] = changes[key].newValue;
            updateSettingsFromStorage(data);
            updateAdjustedTime();
        }
    });
}

function getCollapsedState() { return settings.collapsed; }
function setCollapsedState(val) {
    settings.collapsed = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeCollapsed: val });
    } else {
        localStorage.setItem('ytAdjustedTimeCollapsed', val ? 'true' : 'false');
    }
}

function getBoxColorEnabled() { return settings.boxColorEnabled; }
async function setBoxColorEnabled(val) {
    settings.boxColorEnabled = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeBoxColorEnabled: val });
    } else {
        localStorage.setItem('ytAdjustedTimeBoxColorEnabled', val ? 'true' : 'false');
    }
}

function getBoxColor() {
    return settings.boxColorEnabled ? settings.boxColor : 'transparent';
}
async function setBoxColor(val) {
    settings.boxColor = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeBoxColor: val });
    } else {
        localStorage.setItem('ytAdjustedTimeBoxColor', val);
    }
}

function getTextColor() { return settings.textColor; }
async function setTextColor(val) {
    settings.textColor = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeTextColor: val });
    } else {
        localStorage.setItem('ytAdjustedTimeTextColor', val);
    }
}

function getShowEndTime() { return settings.showEndTime; }
async function setShowEndTime(val) {
    settings.showEndTime = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeShowEndTime: val });
    } else {
        localStorage.setItem('ytAdjustedTimeShowEndTime', val ? 'true' : 'false');
    }
}

function getGlobalTimeSaved() { return settings.globalSaved; }

function getTheme() { return settings.theme; }
async function setTheme(val) {
    settings.theme = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeTheme: val });
    } else {
        localStorage.setItem('ytAdjustedTimeTheme', val);
    }
}

function get24HourTime() { return settings.use24Hour; }
async function set24HourTime(val) {
    settings.use24Hour = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTime24Hour: val });
    } else {
        localStorage.setItem('ytAdjustedTime24Hour', val ? 'true' : 'false');
    }
}

function getBoxOpacity() { return settings.boxOpacity; }
async function setBoxOpacity(val) {
    settings.boxOpacity = val;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ ytAdjustedTimeBoxOpacity: val });
    } else {
        localStorage.setItem('ytAdjustedTimeBoxOpacity', val.toString());
    }
}


// Add this utility to format seconds as years, months, days, hours, and minutes
function formatLongDuration(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;
    let out = [];
    const years = Math.floor(seconds / YEAR);
    if (years > 0) out.push(years + 'y');
    seconds -= years * YEAR;
    const months = Math.floor(seconds / MONTH);
    if (months > 0) out.push(months + 'mo');
    seconds -= months * MONTH;
    const days = Math.floor(seconds / DAY);
    if (days > 0) out.push(days + 'd');
    seconds -= days * DAY;
    const hours = Math.floor(seconds / HOUR);
    if (hours > 0) out.push(hours + 'h');
    seconds -= hours * HOUR;
    const minutes = Math.floor(seconds / MINUTE);
    if (minutes > 0 || out.length === 0) out.push(minutes + 'm');
    return out.join(' ');
}

function createSettingsPopup(parent, boxColor, textColor, showEndTime, sessionSaved, globalSaved) {
    let popup = document.createElement('div');
    popup.id = 'yt-adjusted-time-popup';
    popup.style.position = 'absolute';
    popup.style.zIndex = '99999';
    popup.style.background = '#222';
    popup.style.color = '#fff';
    popup.style.border = '1px solid #444';
    popup.style.borderRadius = '6px';
    popup.style.padding = '12px 16px 12px 16px';
    popup.style.boxShadow = '0 2px 8px #000a';
    popup.style.top = '32px';
    popup.style.right = '0';
    popup.style.fontSize = '15px';
    popup.style.minWidth = '220px';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');

    // Opacity slider UI
    const opacityDiv = document.createElement('div');
    opacityDiv.style.marginBottom = '1em';
    opacityDiv.style.display = 'flex';
    opacityDiv.style.alignItems = 'center';
    const opacityLabel = document.createElement('label');
    opacityLabel.setAttribute('for', 'yt-adjusted-time-popup-opacity');
    opacityLabel.textContent = 'Opacity:';
    opacityLabel.style.marginRight = '0.5em';
    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.id = 'yt-adjusted-time-popup-opacity';
    opacityInput.min = '0';
    opacityInput.max = '100';
    opacityInput.value = '100';
    opacityInput.style.verticalAlign = 'middle';
    opacityInput.style.marginRight = '0.5em';
    const opacityValue = document.createElement('span');
    opacityValue.id = 'yt-adjusted-time-popup-opacity-value';
    opacityValue.textContent = '100%';
    opacityDiv.appendChild(opacityLabel);
    opacityDiv.appendChild(opacityInput);
    opacityDiv.appendChild(opacityValue);
    popup.appendChild(opacityDiv);

    // Set opacity from storage and update slider
    getBoxOpacity().then(opacity => {
        popup.style.opacity = (parseInt(opacity, 10) / 100).toString();
        opacityInput.value = opacity;
        opacityValue.textContent = opacity + '%';
    });
    // Update opacity live and save
    opacityInput.addEventListener('input', function () {
        popup.style.opacity = (parseInt(this.value, 10) / 100).toString();
        opacityValue.textContent = this.value + '%';
    });
    opacityInput.addEventListener('change', function () {
        const val = this.value;
        if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
            browser.storage.sync.set({ ytAdjustedTimeBoxOpacity: val });
        } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.set({ ytAdjustedTimeBoxOpacity: val });
        } else {
            localStorage.setItem('ytAdjustedTimeBoxOpacity', val.toString());
        }
    });

    // --- DRAGGABLE LOGIC ---
    // Remove drag handle, attach drag events to the popup itself
    let offsetX = 0, offsetY = 0, isDragging = false, startX = 0, startY = 0;
    const DRAG_KEY = 'ytAdjustedTimePopupPosition';

    // Restore position if available
    (async function restorePosition() {
        let pos = null;
        if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
            const result = await browser.storage.sync.get(DRAG_KEY);
            pos = result[DRAG_KEY];
        } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            pos = await new Promise(resolve => {
                chrome.storage.sync.get(DRAG_KEY, result => resolve(result[DRAG_KEY]));
            });
        } else {
            const raw = localStorage.getItem(DRAG_KEY);
            if (raw) pos = JSON.parse(raw);
        }
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            popup.style.left = pos.x + 'px';
            popup.style.top = pos.y + 'px';
            popup.style.right = '';
        }
    })();

    function savePosition(x, y) {
        const pos = { x, y };
        if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
            browser.storage.sync.set({ [DRAG_KEY]: pos });
        } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.set({ [DRAG_KEY]: pos });
        } else {
            localStorage.setItem(DRAG_KEY, JSON.stringify(pos));
        }
    }

    function isInteractiveElement(target) {
        return target.closest('input, button, select, textarea, label, option, [contenteditable]');
    }

    function onDragStart(e) {
        // Only start drag if not on an interactive element
        if (isInteractiveElement(e.target)) return;
        isDragging = true;
        const rect = popup.getBoundingClientRect();
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        startY = (e.touches ? e.touches[0].clientY : e.clientY);
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
        e.preventDefault();
    }
    function onDragMove(e) {
        if (!isDragging) return;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let x = clientX - offsetX;
        let y = clientY - offsetY;
        // Clamp to viewport
        x = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, y));
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        popup.style.right = '';
        popup.style.bottom = '';
        e.preventDefault();
    }
    function onDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', onDragEnd);
        // Save position
        const rect = popup.getBoundingClientRect();
        savePosition(rect.left, rect.top);
    }
    popup.addEventListener('mousedown', onDragStart);
    popup.addEventListener('touchstart', onDragStart, { passive: false });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close settings popup');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '6px';
    closeBtn.style.right = '8px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.padding = '0';
    closeBtn.tabIndex = 0;
    closeBtn.onclick = function (e) {
        popup.remove();
        document.removeEventListener('mousedown', closePopup, { capture: true });
        e.stopPropagation();
    };
    closeBtn.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            popup.remove();
            document.removeEventListener('mousedown', closePopup, { capture: true });
            e.preventDefault();
        }
    };
    popup.appendChild(closeBtn);
    // Color controls
    const colorDiv = document.createElement('div');
    colorDiv.style.marginBottom = '1em';
    // BG color
    const label = document.createElement('label');
    label.setAttribute('for', 'yt-adjusted-time-popup-color');
    label.textContent = 'Box Color:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'yt-adjusted-time-popup-color';
    colorInput.value = boxColor;
    colorInput.setAttribute('aria-label', 'Box background color');
    colorDiv.appendChild(label);
    colorDiv.appendChild(colorInput);
    // Text color
    const textLabel = document.createElement('label');
    textLabel.setAttribute('for', 'yt-adjusted-time-popup-text-color');
    textLabel.textContent = ' Text Color:';
    textLabel.style.marginLeft = '1em';
    const textInput = document.createElement('input');
    textInput.type = 'color';
    textInput.id = 'yt-adjusted-time-popup-text-color';
    textInput.value = textColor;
    textInput.setAttribute('aria-label', 'Box text color');
    colorDiv.appendChild(textLabel);
    colorDiv.appendChild(textInput);
    // Enable/disable BG color
    const enabledLabel = document.createElement('label');
    enabledLabel.style.marginLeft = '1em';
    const enabledInput = document.createElement('input');
    enabledInput.type = 'checkbox';
    enabledInput.id = 'yt-adjusted-time-popup-color-enabled';
    enabledLabel.appendChild(enabledInput);
    enabledLabel.appendChild(document.createTextNode(' Colored background'));
    colorDiv.appendChild(enabledLabel);
    popup.appendChild(colorDiv);
    // Show/hide end time
    const endTimeDiv = document.createElement('div');
    endTimeDiv.style.marginBottom = '1em';
    const endTimeLabel = document.createElement('label');
    endTimeLabel.setAttribute('for', 'yt-adjusted-time-popup-show-endtime');
    endTimeLabel.textContent = 'Show End Time:';
    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'checkbox';
    endTimeInput.id = 'yt-adjusted-time-popup-show-endtime';
    endTimeInput.checked = showEndTime;
    endTimeInput.setAttribute('aria-label', 'Show projected end time');
    endTimeDiv.appendChild(endTimeLabel);
    endTimeDiv.appendChild(endTimeInput);
    popup.appendChild(endTimeDiv);
    // Time saved stats
    const statsDiv = document.createElement('div');
    statsDiv.style.marginBottom = '1em';
    statsDiv.style.fontSize = '14px';
    const statsTitle = document.createElement('b');
    statsTitle.textContent = 'Time Saved:';
    statsDiv.appendChild(statsTitle);
    statsDiv.appendChild(document.createElement('br'));
    const sessionLabel = document.createElement('span');
    sessionLabel.textContent = 'Session: ';
    const sessionSpan = document.createElement('span');
    sessionSpan.id = 'yt-adjusted-time-session-saved';
    sessionSpan.textContent = formatTime(sessionSaved);
    statsDiv.appendChild(sessionLabel);
    statsDiv.appendChild(sessionSpan);
    statsDiv.appendChild(document.createElement('br'));
    const globalLabel = document.createElement('span');
    globalLabel.textContent = 'All-Time: ';
    const globalSpan = document.createElement('span');
    globalSpan.id = 'yt-adjusted-time-global-saved';
    globalSpan.textContent = formatLongDuration(globalSaved);
    statsDiv.appendChild(globalLabel);
    statsDiv.appendChild(globalSpan);
    popup.appendChild(statsDiv);
    const optionsBtn = document.createElement('button');
    optionsBtn.id = 'yt-adjusted-time-popup-options';
    optionsBtn.style.marginBottom = '1em';
    optionsBtn.style.width = '100%';
    optionsBtn.style.cursor = 'pointer';
    optionsBtn.textContent = 'Full Options Page';
    popup.appendChild(optionsBtn);
    const infoDiv = document.createElement('div');
    infoDiv.style.fontSize = '13px';
    infoDiv.style.color = '#aaa';
    infoDiv.textContent = 'Click outside to close';
    popup.appendChild(infoDiv);
    // Options page button
    optionsBtn.onclick = function (e) {
        e.stopPropagation();
        console.log('[YT Adjusted Time] Popup options button clicked');
        try {
            if ((typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendMessage) ||
                (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage)) {
                (browser?.runtime?.sendMessage || chrome?.runtime?.sendMessage)({ action: 'openOptions' });
            } else {
                const url = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
                    ? chrome.runtime.getURL('options.html')
                    : 'options.html';
                window.open(url, '_blank');
            }
        } catch (err) {
            console.error('[YT Adjusted Time] Exception in popup options button onclick:', err);
        }
    };
    // Close popup on outside click
    setTimeout(() => {
        document.addEventListener('mousedown', closePopup, { capture: true });
    }, 0);
    function closePopup(e) {
        if (!popup.contains(e.target) && e.target.id !== 'yt-adjusted-time-settings-btn') {
            popup.remove();
            document.removeEventListener('mousedown', closePopup, { capture: true });
        }
    }
    // Sync checkbox with storage
    getBoxColorEnabled().then(enabled => {
        enabledInput.checked = enabled;
        colorInput.disabled = !enabled;
    });
    enabledInput.addEventListener('change', async function () {
        await setBoxColorEnabled(this.checked);
        colorInput.disabled = !this.checked;
        updateAdjustedTime();
    });
    colorInput.addEventListener('input', async function (e) {
        await setBoxColor(this.value);
        updateAdjustedTime();
    });
    textInput.addEventListener('input', async function (e) {
        await setTextColor(this.value);
        updateAdjustedTime();
    });
    endTimeInput.addEventListener('change', async function (e) {
        await setShowEndTime(this.checked);
        updateAdjustedTime();
    });
    // Theme selector
    const themeDiv = document.createElement('div');
    themeDiv.style.marginBottom = '1em';
    const themeLabel = document.createElement('label');
    themeLabel.setAttribute('for', 'yt-adjusted-time-popup-theme');
    themeLabel.textContent = 'Theme:';
    const themeSelect = document.createElement('select');
    themeSelect.id = 'yt-adjusted-time-popup-theme';
    themeSelect.setAttribute('aria-label', 'Theme preset');
    for (const theme of YT_ADJUSTED_TIME_THEMES) {
        const opt = document.createElement('option');
        opt.value = theme.name;
        opt.textContent = theme.name;
        themeSelect.appendChild(opt);
    }
    themeDiv.appendChild(themeLabel);
    themeDiv.appendChild(themeSelect);
    popup.appendChild(themeDiv);
    // Set theme selector to current theme
    getTheme().then(currentTheme => {
        themeSelect.value = currentTheme;
        // If not custom, update color pickers and disable them
        if (currentTheme !== 'Custom') {
            const preset = YT_ADJUSTED_TIME_THEMES.find(t => t.name === currentTheme);
            if (preset) {
                colorInput.value = preset.bg;
                textInput.value = preset.text;
                colorInput.disabled = true;
                textInput.disabled = true;
            }
        } else {
            colorInput.disabled = false;
            textInput.disabled = false;
        }
    });
    themeSelect.addEventListener('change', async function () {
        await setTheme(this.value);
        if (this.value !== 'Custom') {
            const preset = YT_ADJUSTED_TIME_THEMES.find(t => t.name === this.value);
            if (preset) {
                await setBoxColor(preset.bg);
                await setTextColor(preset.text);
                colorInput.value = preset.bg;
                textInput.value = preset.text;
                colorInput.disabled = true;
                textInput.disabled = true;
            }
        } else {
            colorInput.disabled = false;
            textInput.disabled = false;
        }
        updateAdjustedTime();
    });
    // 24-hour time toggle
    const hourDiv = document.createElement('div');
    hourDiv.style.marginBottom = '1em';
    const hourLabel = document.createElement('label');
    hourLabel.setAttribute('for', 'yt-adjusted-time-popup-24hour');
    hourLabel.textContent = '24-hour time:';
    const hourInput = document.createElement('input');
    hourInput.type = 'checkbox';
    hourInput.id = 'yt-adjusted-time-popup-24hour';
    hourInput.setAttribute('aria-label', 'Use 24-hour time');
    hourDiv.appendChild(hourLabel);
    hourDiv.appendChild(hourInput);
    popup.appendChild(hourDiv);
    get24HourTime().then(val => { hourInput.checked = val; });
    hourInput.addEventListener('change', async function () {
        await set24HourTime(this.checked);
        updateAdjustedTime();
    });
    parent.appendChild(popup);
}

// Utility: Check if a color is light (for adaptive contrast)
function isColorLight(color) {
    // Accepts hex (#rrggbb), rgb(r,g,b), or named colors
    let r, g, b;
    if (!color) return false;
    if (color === 'transparent') return false;
    if (color[0] === '#') {
        if (color.length === 4) {
            r = parseInt(color[1] + color[1], 16);
            g = parseInt(color[2] + color[2], 16);
            b = parseInt(color[3] + color[3], 16);
        } else if (color.length === 7) {
            r = parseInt(color.substr(1, 2), 16);
            g = parseInt(color.substr(3, 2), 16);
            b = parseInt(color.substr(5, 2), 16);
        }
    } else if (color.startsWith('rgb')) {
        const nums = color.match(/\d+/g);
        if (nums && nums.length >= 3) {
            r = parseInt(nums[0]);
            g = parseInt(nums[1]);
            b = parseInt(nums[2]);
        }
    } else if (color === 'white') {
        r = g = b = 255;
    } else if (color === 'orange') {
        r = 255; g = 165; b = 0;
    } else {
        // fallback: treat as dark
        return false;
    }
    if (r === undefined || g === undefined || b === undefined) return false;
    // Perceived luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.7;
}

function getVideoElement() { return document.querySelector('video'); }
function getTimeDisplayElement() {
    return document.querySelector('.ytp-time-display') ||
           document.querySelector('ytmusic-player-bar .time-info') ||
           document.querySelector('ytd-shorts-player-controls') ||
           document.querySelector('ytd-reel-player-overlay-renderer');
}

function getPlayerElement() {
    return document.querySelector('#movie_player') ||
           document.querySelector('ytmusic-player') ||
           document.querySelector('ytd-shorts');
}

function calculateAdjustedTimeLeft(video) {
    if (!video) return 0;
    const remaining = video.duration - video.currentTime;
    return remaining / video.playbackRate;
}

function injectAdjustedTimeDOM(timeDisplay, adjustedTime, isCollapsed) {
    // Remove old expanded adjusted time if present (for collapse logic)
    let adjustedSpan = document.getElementById('yt-adjusted-time');
    if (isCollapsed && adjustedSpan) adjustedSpan.remove();

    // Apply position function
    function applyPosition(el) {
        if (settings.displayPosition === 'top-left' || settings.displayPosition === 'top-right') {
            const player = getPlayerElement();
            if (player) {
                el.style.position = 'absolute';
                el.style.top = '10px';
                el.style.zIndex = '9999';
                if (settings.displayPosition === 'top-left') {
                    el.style.left = '10px';
                    el.style.right = 'auto';
                } else {
                    el.style.right = '10px';
                    el.style.left = 'auto';
                }
                player.appendChild(el);
            }
        } else {
            // default
            el.style.position = 'static';
            el.style.top = 'auto';
            el.style.left = 'auto';
            el.style.right = 'auto';
            el.style.zIndex = 'auto';
            if (timeDisplay) timeDisplay.appendChild(el);
        }
    }

    // Collapsed state: show clock icon
    if (isCollapsed) {
        let collapsedBtn = document.getElementById('yt-adjusted-time-collapsed');
        if (!collapsedBtn) {
            collapsedBtn = document.createElement('span');
            collapsedBtn.id = 'yt-adjusted-time-collapsed';
            collapsedBtn.style.marginLeft = '8px';
            collapsedBtn.style.cursor = 'pointer';
            collapsedBtn.style.fontSize = '16px';
            collapsedBtn.style.verticalAlign = 'middle';
            collapsedBtn.textContent = '🕒';
            collapsedBtn.title = 'Show adjusted time left at current speed (Double-click to expand)';
            collapsedBtn.setAttribute('tabindex', '0');
            collapsedBtn.setAttribute('role', 'button');
            collapsedBtn.setAttribute('aria-label', 'Show adjusted time left at current speed');
            collapsedBtn.ondblclick = function (e) {
                setCollapsedState(false);
                let btn = document.getElementById('yt-adjusted-time-collapsed');
                if (btn) btn.remove();
                updateAdjustedTime();
                e.stopPropagation();
            };
            collapsedBtn.onkeydown = function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    setCollapsedState(false);
                    let btn = document.getElementById('yt-adjusted-time-collapsed');
                    if (btn) btn.remove();
                    updateAdjustedTime();
                    e.preventDefault();
                }
            };
            applyPosition(collapsedBtn);
        } else {
            applyPosition(collapsedBtn);
        }
        return;
    }

    // Expanded state: show adjusted time
    adjustedSpan = document.getElementById('yt-adjusted-time');
    let timeTextSpan, settingsBtn;

    function formatTimeSaved(seconds) {
    if (settings.timeFormat === 'decimal') {
        return (seconds / 3600).toFixed(2) + 'h';
    }
        seconds = Math.max(0, Math.floor(seconds));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
        return `+${m}:${s.toString().padStart(2, '0')} saved`;
    }
    const boxColor = getBoxColor();
    const textColor = getTextColor();
    const showEndTime = getShowEndTime();
    const use24Hour = get24HourTime();
    const opacity = getBoxOpacity();
    const endTime = formatEndTime(adjustedTime, use24Hour);
    const newText = showEndTime ? `${formatTime(adjustedTime)} | ${endTime}` : `${formatTime(adjustedTime)}`;
    const globalSaved = getGlobalTimeSaved();
    // Tooltip: show session and all-time saved
    const tooltip = `Session saved: ${formatTime(sessionTimeSaved)}\nAll-time saved: ${formatLongDuration(globalSaved)}`;
    // YouTube time style
    const ytFont = "'YouTube Sans', 'Roboto', 'Arial', 'sans-serif'";
    const ytFontSize = '13px';
    const ytFontWeight = '400';
    const ytBorderRadius = '2px';
    const ytPadding = '0 4px';
    const ytBorder = boxColor !== 'transparent' ? '1px solid rgba(0,0,0,0.15)' : 'none';
    const ytVerticalAlign = 'middle';

    if (adjustedSpan) {
        timeTextSpan = adjustedSpan.querySelector('.yt-adjusted-time-text');
        if (timeTextSpan) {
            timeTextSpan.textContent = newText;
        }
        adjustedSpan.style.background = boxColor;
        adjustedSpan.style.color = textColor;
        adjustedSpan.style.opacity = (opacity / 100).toString();
        adjustedSpan.title = tooltip;
        adjustedSpan.setAttribute('aria-label', `Adjusted time left: ${formatTime(adjustedTime)}${showEndTime ? ', ends at ' + endTime : ''}. ${tooltip}`);
        adjustedSpan.style.fontFamily = ytFont;
        adjustedSpan.style.fontSize = ytFontSize;
        adjustedSpan.style.fontWeight = ytFontWeight;
        adjustedSpan.style.borderRadius = ytBorderRadius;
        adjustedSpan.style.padding = ytPadding;
        adjustedSpan.style.border = ytBorder;
        adjustedSpan.style.verticalAlign = ytVerticalAlign;
        applyPosition(adjustedSpan);
    } else {
        // Remove old adjusted time if present (shouldn't be needed, but for safety)
        const oldSettingsBtn = document.getElementById('yt-adjusted-time-settings-btn');
        if (oldSettingsBtn) oldSettingsBtn.remove();

        // Create new adjusted time span
        adjustedSpan = document.createElement('span');
        adjustedSpan.id = 'yt-adjusted-time';
        adjustedSpan.style.marginLeft = '8px';
        adjustedSpan.style.color = textColor;
        adjustedSpan.style.background = boxColor;
        adjustedSpan.style.opacity = (opacity / 100).toString();
        adjustedSpan.style.fontFamily = ytFont;
        adjustedSpan.style.fontSize = ytFontSize;
        adjustedSpan.style.fontWeight = ytFontWeight;
        adjustedSpan.style.borderRadius = ytBorderRadius;
        adjustedSpan.style.padding = ytPadding;
        adjustedSpan.style.border = ytBorder;
        adjustedSpan.style.textShadow = 'none';
        adjustedSpan.style.boxShadow = 'none';
        adjustedSpan.style.verticalAlign = ytVerticalAlign;
        adjustedSpan.style.whiteSpace = 'nowrap';
        adjustedSpan.style.display = 'inline-flex';
        adjustedSpan.style.alignItems = 'center';

        // Add time text span
        timeTextSpan = document.createElement('span');
        timeTextSpan.className = 'yt-adjusted-time-text';
        timeTextSpan.textContent = newText;
        adjustedSpan.appendChild(timeTextSpan);

        // Add settings button
        settingsBtn = document.createElement('button');
        settingsBtn.id = 'yt-adjusted-time-settings-btn';
        settingsBtn.textContent = '⚙️';
        settingsBtn.title = 'Settings';
        settingsBtn.style.marginLeft = '4px';
        settingsBtn.style.background = 'transparent';
        settingsBtn.style.border = 'none';
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.style.display = 'inline-flex';
        settingsBtn.style.alignItems = 'center';
        settingsBtn.style.padding = '0';
        settingsBtn.style.fontSize = '12px';
        settingsBtn.setAttribute('aria-label', 'Open adjusted time settings');
        settingsBtn.onclick = function (e) {
            e.stopPropagation();
            const sessionSaved = typeof sessionTimeSaved !== 'undefined' ? sessionTimeSaved : 0;
            createSettingsPopup(document.body, getBoxColor(), getTextColor(), getShowEndTime(), sessionSaved, getGlobalTimeSaved());
        };
        adjustedSpan.appendChild(settingsBtn);

        // Collapse/expand event listeners (use double click to avoid accidental triggers)
        adjustedSpan.ondblclick = function (e) {
            setCollapsedState(true);
            updateAdjustedTime();
            e.stopPropagation();
        };

        applyPosition(adjustedSpan);
    }
}

async function updateAdjustedTime() {
    const video = getVideoElement();
    const timeDisplay = getTimeDisplayElement();
    if (!timeDisplay) return;

    const isCollapsed = getCollapsedState();
    const adjustedTime = calculateAdjustedTimeLeft(video);

    injectAdjustedTimeDOM(timeDisplay, adjustedTime, isCollapsed);
}

function rgbToHex(rgb) {
    // Accepts 'orange' or 'rgb(r,g,b)' or '#xxxxxx'
    if (!rgb) return '#ffa500';
    if (rgb[0] === '#') return rgb;
    if (rgb === 'orange') return '#ffa500';
    const result = rgb.match(/\d+/g);
    if (!result) return '#ffa500';
    return (
        '#' +
        ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2]))
            .toString(16)
            .slice(1)
    );
}

async function setup() {
    const video = getVideoElement();
    if (!video) return;

    // Load settings from storage
    await initSettings();

    // Prevent duplicate listeners
    video.removeEventListener('ratechange', throttledUpdateAdjustedTime);
    video.removeEventListener('timeupdate', throttledUpdateAdjustedTime);
    video.addEventListener('ratechange', throttledUpdateAdjustedTime);
    video.addEventListener('timeupdate', throttledUpdateAdjustedTime);

    // Global time saved hooks
    setupGlobalTimeSavedHooks();

    // Initial update
    throttledUpdateAdjustedTime();
}

function setupObservers() {
    let timeDisplayObserver = null;
    function observeTimeDisplay() {
        const player = getPlayerElement();
        const timeDisplay = getTimeDisplayElement();

        if (timeDisplayObserver) timeDisplayObserver.disconnect();

        timeDisplayObserver = new MutationObserver(() => {
            throttledUpdateAdjustedTime();
        });

        if (timeDisplay) {
            timeDisplayObserver.observe(timeDisplay, { childList: true, subtree: true, characterData: true });
        } else if (player) {
            // Fallback to player if timeDisplay isn't ready yet
            timeDisplayObserver.observe(player, { childList: true, subtree: true });
        }
    }

    // Global observer for player appearing/disappearing
    const globalObserver = new MutationObserver((mutations) => {
        const video = getVideoElement();
        const timeDisplay = getTimeDisplayElement();
        if (video && timeDisplay) {
            setup();
            observeTimeDisplay();
        }
    });
    globalObserver.observe(document.body, { childList: true, subtree: true });

    // YouTube SPA navigation handling
    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(() => {
            setup();
            observeTimeDisplay();
        }, 1000);
    });

    // Initial run
    (async () => {
        await setup();
        observeTimeDisplay();
    })();

    window.addEventListener('resize', throttledUpdateAdjustedTime);
}
setupObservers();

// Listen for color changes in storage and update UI in real time
if (typeof browser !== 'undefined' && browser.storage && browser.storage.onChanged) {
    browser.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.ytAdjustedTimeBoxColor) {
            console.log('[YT Adjusted Time] Detected color change:', changes.ytAdjustedTimeBoxColor);
            updateAdjustedTime();
        }
    });
} else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.ytAdjustedTimeBoxColor) {
            console.log('[YT Adjusted Time] Detected color change:', changes.ytAdjustedTimeBoxColor);
            updateAdjustedTime();
        }
    });
}

console.log('[YT Adjusted Time] Script loaded - END');

// --- Global Time Saved Tracking ---
let lastVideoTime = null;
let lastPlaybackRate = null;
let lastSavedTimestamp = Date.now();
let sessionTimeSaved = 0;
let globalTimeSavedUpdateInterval = null;

function accumulateTimeSaved() {
    const video = getVideoElement();
    if (!video) return;
    if (lastVideoTime === null) {
        lastVideoTime = video.currentTime;
        lastPlaybackRate = video.playbackRate;
        return;
    }
    const dt = video.currentTime - lastVideoTime;
    if (dt > 0 && dt < 10) { // ignore large jumps (seeking)
        const realTime = dt;
        const adjustedTime = dt / lastPlaybackRate;
        const saved = realTime - adjustedTime;
        if (saved > 0) sessionTimeSaved += saved;
    }
    lastVideoTime = video.currentTime;
    lastPlaybackRate = video.playbackRate;
}

async function persistGlobalTimeSaved() {
    if (sessionTimeSaved <= 0) return;
    let total = 0;
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
        const result = await browser.storage.sync.get('ytAdjustedTimeGlobalSaved');
        total = result.ytAdjustedTimeGlobalSaved || 0;
        await browser.storage.sync.set({ ytAdjustedTimeGlobalSaved: total + sessionTimeSaved });
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        return new Promise(resolve => {
            chrome.storage.sync.get('ytAdjustedTimeGlobalSaved', result => {
                total = result.ytAdjustedTimeGlobalSaved || 0;
                chrome.storage.sync.set({ ytAdjustedTimeGlobalSaved: total + sessionTimeSaved }, resolve);
            });
        });
    } else {
        total = parseFloat(localStorage.getItem('ytAdjustedTimeGlobalSaved') || '0');
        localStorage.setItem('ytAdjustedTimeGlobalSaved', (total + sessionTimeSaved).toString());
    }
    sessionTimeSaved = 0;
}

function startGlobalTimeSavedTracking() {
    lastVideoTime = null;
    lastPlaybackRate = null;
    sessionTimeSaved = 0;
    if (globalTimeSavedUpdateInterval) clearInterval(globalTimeSavedUpdateInterval);
    globalTimeSavedUpdateInterval = setInterval(() => {
        accumulateTimeSaved();
        persistGlobalTimeSaved();
    }, 5000);
}

function stopGlobalTimeSavedTracking() {
    accumulateTimeSaved();
    persistGlobalTimeSaved();
    if (globalTimeSavedUpdateInterval) clearInterval(globalTimeSavedUpdateInterval);
    globalTimeSavedUpdateInterval = null;
}

// Hook into video events
function setupGlobalTimeSavedHooks() {
    const video = getVideoElement();
    if (!video) return;
    video.removeEventListener('timeupdate', accumulateTimeSaved);
    video.removeEventListener('ratechange', accumulateTimeSaved);
    video.removeEventListener('play', startGlobalTimeSavedTracking);
    video.removeEventListener('pause', stopGlobalTimeSavedTracking);
    video.removeEventListener('ended', stopGlobalTimeSavedTracking);
    video.addEventListener('timeupdate', accumulateTimeSaved);
    video.addEventListener('ratechange', accumulateTimeSaved);
    video.addEventListener('play', startGlobalTimeSavedTracking);
    video.addEventListener('pause', stopGlobalTimeSavedTracking);
    video.addEventListener('ended', stopGlobalTimeSavedTracking);
}

// Call this in setup()
function setup() {
    const video = getVideoElement();
    if (!video) return;
    // Prevent duplicate listeners by removing any previous ones
    video.removeEventListener('ratechange', throttledUpdateAdjustedTime);
    video.removeEventListener('timeupdate', throttledUpdateAdjustedTime);
    video.addEventListener('ratechange', throttledUpdateAdjustedTime);
    video.addEventListener('timeupdate', throttledUpdateAdjustedTime);
    // Global time saved hooks
    setupGlobalTimeSavedHooks();
}

console.log('[YT Adjusted Time] Script loaded - END');

// --- BEGIN: YouTube Watch Session Tracking for Statistics ---
(function () {
    let currentSession = null;
    let lastVideoId = null;
    let videoElement = null;
    let sessionTimeout = null;

    function getVideoId() {
        const url = new URL(window.location.href);
        return url.searchParams.get('v');
    }

    function getVideoTitle() {
        const el = document.querySelector('h1.title, h1.ytd-watch-metadata');
        return el ? el.textContent.trim() : '';
    }

    function getChannelName() {
        const el = document.querySelector('ytd-channel-name a, ytd-channel-name yt-formatted-string');
        return el ? el.textContent.trim() : '';
    }

    function saveSession(session) {
        if (!session || !session.videoId || !session.startTime || !session.endTime) return;
        chrome.storage.local.get({ ytWatchStats: [] }, function (data) {
            const stats = data.ytWatchStats || [];
            stats.push(session);
            chrome.storage.local.set({ ytWatchStats: stats });
        });
    }

    function startSession() {
        const videoId = getVideoId();
        if (!videoId) return;
        if (currentSession && currentSession.videoId === videoId) return; // Already tracking
        endSession();
        currentSession = {
            videoId,
            title: getVideoTitle(),
            channel: getChannelName(),
            startTime: Date.now(),
            endTime: null
        };
        lastVideoId = videoId;
    }

    function endSession() {
        if (currentSession && !currentSession.endTime) {
            currentSession.endTime = Date.now();
            // Only save if session lasted at least 5 seconds
            if (currentSession.endTime - currentSession.startTime > 5000) {
                saveSession(currentSession);
            }
        }
        currentSession = null;
        lastVideoId = null;
    }

    function onVideoPlay() {
        startSession();
        if (sessionTimeout) clearTimeout(sessionTimeout);
    }

    function onVideoPause() {
        if (sessionTimeout) clearTimeout(sessionTimeout);
        // Wait a bit before ending session in case of short pauses
        sessionTimeout = setTimeout(endSession, 15000);
    }

    function setupVideoTracking() {
        if (videoElement) {
            videoElement.removeEventListener('play', onVideoPlay);
            videoElement.removeEventListener('pause', onVideoPause);
        }
        videoElement = getVideoElement();
        if (videoElement) {
            videoElement.addEventListener('play', onVideoPlay);
            videoElement.addEventListener('pause', onVideoPause);
            if (!videoElement.paused) {
                onVideoPlay();
            }
        }
    }

    // Detect navigation (YouTube uses SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            endSession();
            setTimeout(setupVideoTracking, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial setup
    window.addEventListener('yt-navigate-finish', () => {
        endSession();
        setTimeout(setupVideoTracking, 1000);
    });
    setTimeout(setupVideoTracking, 2000);
    window.addEventListener('beforeunload', endSession);
})();
// --- END: YouTube Watch Session Tracking for Statistics --- 