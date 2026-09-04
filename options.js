// options.js
// Load and save color using storage.sync
const colorInput = document.getElementById('color');
const preview = document.getElementById('preview');
const colorEnabledInput = document.getElementById('color-enabled');

// --- THEME PRESETS ---
const YT_ADJUSTED_TIME_THEMES = [
  { name: 'Classic', bg: '#ffa500', text: '#ffffff' },
  { name: 'Dark', bg: '#222222', text: '#ffffff' },
  { name: 'Light', bg: '#ffffff', text: '#222222' },
  { name: 'YouTube Red', bg: '#ff0000', text: '#ffffff' },
  { name: 'Ocean', bg: '#0077be', text: '#ffffff' },
  { name: 'High Contrast', bg: '#000000', text: '#ffff00' },
  { name: 'Transparent', bg: 'transparent', text: '#ffa500' },
  { name: 'Solarized Dark', bg: '#073642', text: '#eee8d5' },
  { name: 'Solarized Light', bg: '#fdf6e3', text: '#657b83' },
  { name: 'Custom', bg: null, text: null }
];

async function getBoxColor() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeBoxColor');
    const color = result.ytAdjustedTimeBoxColor || '#ffa500';
    console.log('[YT Options] getBoxColor returns:', color);
    return color;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeBoxColor', result => {
        const color = result.ytAdjustedTimeBoxColor || '#ffa500';
        console.log('[YT Options] getBoxColor returns:', color);
        resolve(color);
      });
    });
  } else {
    const color = localStorage.getItem('ytAdjustedTimeBoxColor') || '#ffa500';
    console.log('[YT Options] getBoxColor returns:', color);
    return color;
  }
}
async function setBoxColor(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeBoxColor: val });
    console.log('[YT Options] setBoxColor (browser):', val);
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeBoxColor: val });
    console.log('[YT Options] setBoxColor (chrome):', val);
  } else {
    localStorage.setItem('ytAdjustedTimeBoxColor', val);
    console.log('[YT Options] setBoxColor (localStorage):', val);
  }
}

async function getBoxColorEnabled() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeBoxColorEnabled');
    return result.ytAdjustedTimeBoxColorEnabled !== undefined ? result.ytAdjustedTimeBoxColorEnabled : true;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeBoxColorEnabled', result => {
        resolve(result.ytAdjustedTimeBoxColorEnabled !== undefined ? result.ytAdjustedTimeBoxColorEnabled : true);
      });
    });
  } else {
    const val = localStorage.getItem('ytAdjustedTimeBoxColorEnabled');
    return val === null ? true : val === 'true';
  }
}
async function setBoxColorEnabled(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeBoxColorEnabled: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeBoxColorEnabled: val });
  } else {
    localStorage.setItem('ytAdjustedTimeBoxColorEnabled', val ? 'true' : 'false');
  }
}

async function getTheme() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeTheme');
    return result.ytAdjustedTimeTheme || 'Classic';
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeTheme', result => {
        resolve(result.ytAdjustedTimeTheme || 'Classic');
      });
    });
  } else {
    return localStorage.getItem('ytAdjustedTimeTheme') || 'Classic';
  }
}
async function setTheme(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeTheme: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeTheme: val });
  } else {
    localStorage.setItem('ytAdjustedTimeTheme', val);
  }
}
async function getTextColor() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeTextColor');
    return result.ytAdjustedTimeTextColor || '#fff';
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeTextColor', result => {
        resolve(result.ytAdjustedTimeTextColor || '#fff');
      });
    });
  } else {
    return localStorage.getItem('ytAdjustedTimeTextColor') || '#fff';
  }
}
async function setTextColor(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeTextColor: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeTextColor: val });
  } else {
    localStorage.setItem('ytAdjustedTimeTextColor', val);
  }
}
async function getShowEndTime() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeShowEndTime');
    return result.ytAdjustedTimeShowEndTime !== undefined ? result.ytAdjustedTimeShowEndTime : true;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeShowEndTime', result => {
        resolve(result.ytAdjustedTimeShowEndTime !== undefined ? result.ytAdjustedTimeShowEndTime : true);
      });
    });
  } else {
    const val = localStorage.getItem('ytAdjustedTimeShowEndTime');
    return val === null ? true : val === 'true';
  }
}
async function setShowEndTime(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeShowEndTime: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeShowEndTime: val });
  } else {
    localStorage.setItem('ytAdjustedTimeShowEndTime', val ? 'true' : 'false');
  }
}
async function get24HourTime() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTime24Hour');
    return result.ytAdjustedTime24Hour !== undefined ? result.ytAdjustedTime24Hour : false;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTime24Hour', result => {
        resolve(result.ytAdjustedTime24Hour !== undefined ? result.ytAdjustedTime24Hour : false);
      });
    });
  } else {
    const stored = localStorage.getItem('ytAdjustedTime24Hour');
    return stored === null ? false : stored === 'true';
  }
}
async function set24HourTime(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTime24Hour: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTime24Hour: val });
  } else {
    localStorage.setItem('ytAdjustedTime24Hour', val ? 'true' : 'false');
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
function updatePreview() {
  const theme = document.getElementById('theme').value;
  const color = document.getElementById('color').value;
  const colorEnabled = document.getElementById('color-enabled').checked;
  const textColor = document.getElementById('text-color').value;
  const showEndTime = document.getElementById('show-endtime').checked;
  const use24Hour = document.getElementById('24hour').checked;
  const boxOpacity = document.getElementById('box-opacity').value;
  let bg = colorEnabled ? color : 'transparent';
  let fg = textColor;
  if (theme !== 'Custom') {
    const preset = YT_ADJUSTED_TIME_THEMES.find(t => t.name === theme);
    if (preset) {
      bg = colorEnabled ? preset.bg : 'transparent';
      fg = preset.text;
    }
  }
  const preview = document.getElementById('preview');
  preview.style.background = bg;
  preview.style.color = fg;
  preview.style.border = bg !== 'transparent' ? '1px solid rgba(0,0,0,0.15)' : 'none';
  preview.style.fontFamily = "'YouTube Sans', 'Roboto', 'Arial', 'sans-serif'";
  preview.style.fontSize = '13px';
  preview.style.fontWeight = '400';
  preview.style.borderRadius = '2px';
  preview.style.padding = '0 4px';
  preview.style.verticalAlign = 'middle';
  preview.style.textShadow = 'none';
  preview.style.boxShadow = 'none';
  preview.style.opacity = (parseInt(boxOpacity, 10) / 100).toString();
  const adjusted = 542; // example seconds
  const endTime = formatEndTime(adjusted, use24Hour);
  preview.textContent = showEndTime ? `${formatTime(adjusted)} | ${endTime}` : `${formatTime(adjusted)}`;
  document.getElementById('box-opacity-value').textContent = boxOpacity + '%';
}
// Initialize
(async () => {
  // Populate theme selector
  const themeSelect = document.getElementById('theme');
  for (const theme of YT_ADJUSTED_TIME_THEMES) {
    const opt = document.createElement('option');
    opt.value = theme.name;
    opt.textContent = theme.name;
    themeSelect.appendChild(opt);
  }
  // Load settings
  const [theme, color, colorEnabled, textColor, showEndTime, use24Hour, boxOpacity] = await Promise.all([
    getTheme(), getBoxColor(), getBoxColorEnabled(), getTextColor(), getShowEndTime(), get24HourTime(), getBoxOpacity()
  ]);
  themeSelect.value = theme;
  document.getElementById('color').value = color;
  document.getElementById('color-enabled').checked = colorEnabled;
  document.getElementById('text-color').value = textColor;
  document.getElementById('show-endtime').checked = showEndTime;
  document.getElementById('24hour').checked = use24Hour;
  document.getElementById('box-opacity').value = boxOpacity;
  document.getElementById('box-opacity-value').textContent = boxOpacity + '%';
  // Disable color pickers if not custom
  if (theme !== 'Custom') {
    const preset = YT_ADJUSTED_TIME_THEMES.find(t => t.name === theme);
    if (preset) {
      document.getElementById('color').value = preset.bg;
      document.getElementById('text-color').value = preset.text;
      document.getElementById('color').disabled = true;
      document.getElementById('text-color').disabled = true;
    }
  }
  updatePreview();
})();
document.getElementById('theme').addEventListener('change', function() {
  if (this.value !== 'Custom') {
    const preset = YT_ADJUSTED_TIME_THEMES.find(t => t.name === this.value);
    if (preset) {
      document.getElementById('color').value = preset.bg;
      document.getElementById('text-color').value = preset.text;
      document.getElementById('color').disabled = true;
      document.getElementById('text-color').disabled = true;
    }
  } else {
    document.getElementById('color').disabled = false;
    document.getElementById('text-color').disabled = false;
  }
  updatePreview();
});
document.getElementById('color').addEventListener('input', updatePreview);
document.getElementById('color-enabled').addEventListener('change', updatePreview);
document.getElementById('text-color').addEventListener('input', updatePreview);
document.getElementById('show-endtime').addEventListener('change', updatePreview);
document.getElementById('24hour').addEventListener('change', updatePreview);
document.getElementById('box-opacity').addEventListener('input', updatePreview);
document.getElementById('box-opacity').addEventListener('change', async function() {
  await setBoxOpacity(this.value);
  updatePreview();
});
document.getElementById('apply-btn').addEventListener('click', async function(e) {
  e.preventDefault();
  const theme = document.getElementById('theme').value;
  const color = document.getElementById('color').value;
  const colorEnabled = document.getElementById('color-enabled').checked;
  const textColor = document.getElementById('text-color').value;
  const showEndTime = document.getElementById('show-endtime').checked;
  const use24Hour = document.getElementById('24hour').checked;
  const boxOpacity = document.getElementById('box-opacity').value;
  await setTheme(theme);
  await setBoxColor(color);
  await setBoxColorEnabled(colorEnabled);
  await setTextColor(textColor);
  await setShowEndTime(showEndTime);
  await set24HourTime(use24Hour);
  await setBoxOpacity(boxOpacity);
  document.getElementById('applied-msg').style.display = 'inline';
  setTimeout(() => {
    document.getElementById('applied-msg').style.display = 'none';
  }, 1200);
});

async function getGlobalTimeSaved() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeGlobalSaved');
    return result.ytAdjustedTimeGlobalSaved || 0;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeGlobalSaved', result => {
        resolve(result.ytAdjustedTimeGlobalSaved || 0);
      });
    });
  } else {
    return parseFloat(localStorage.getItem('ytAdjustedTimeGlobalSaved') || '0');
  }
}
async function setGlobalTimeSaved(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeGlobalSaved: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeGlobalSaved: val });
  } else {
    localStorage.setItem('ytAdjustedTimeGlobalSaved', val.toString());
  }
}
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
function formatGlobalTimeSaved(seconds) {
  return formatLongDuration(seconds);
}
// Add display to options page
document.addEventListener('DOMContentLoaded', async function() {
  let statDiv = document.createElement('div');
  statDiv.className = 'section';
  // Instead of innerHTML, use DOM methods
  const strong = document.createElement('strong');
  strong.textContent = 'Total time saved:';
  const span = document.createElement('span');
  span.id = 'yt-global-time-saved';
  span.textContent = '...';
  const button = document.createElement('button');
  button.id = 'yt-reset-global-time-saved';
  button.style.marginLeft = '1em';
  button.textContent = 'Reset';
  statDiv.appendChild(strong);
  statDiv.appendChild(document.createTextNode(' '));
  statDiv.appendChild(span);
  statDiv.appendChild(button);
  document.body.insertBefore(statDiv, document.body.firstChild.nextSibling);
  async function updateStat() {
    const total = await getGlobalTimeSaved();
    document.getElementById('yt-global-time-saved').textContent = formatGlobalTimeSaved(total);
  }
  updateStat();
  document.getElementById('yt-reset-global-time-saved').onclick = async function() {
    await setGlobalTimeSaved(0);
    updateStat();
  };
});

document.getElementById('back-to-youtube').addEventListener('click', function() {
  window.close();
});

// Add get/set for opacity
async function getBoxOpacity() {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    const result = await browser.storage.sync.get('ytAdjustedTimeBoxOpacity');
    return result.ytAdjustedTimeBoxOpacity !== undefined ? result.ytAdjustedTimeBoxOpacity : 100;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise(resolve => {
      chrome.storage.sync.get('ytAdjustedTimeBoxOpacity', result => {
        resolve(result.ytAdjustedTimeBoxOpacity !== undefined ? result.ytAdjustedTimeBoxOpacity : 100);
      });
    });
  } else {
    const val = localStorage.getItem('ytAdjustedTimeBoxOpacity');
    return val === null ? 100 : parseInt(val, 10);
  }
}
async function setBoxOpacity(val) {
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
    await browser.storage.sync.set({ ytAdjustedTimeBoxOpacity: val });
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ ytAdjustedTimeBoxOpacity: val });
  } else {
    localStorage.setItem('ytAdjustedTimeBoxOpacity', val.toString());
  }
}

// --- BEGIN: YouTube Watch Statistics Section ---
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getDayKey(ts) {
  const d = new Date(ts);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getHour(ts) {
  return new Date(ts).getHours();
}

function aggregateStats(sessions) {
  const now = Date.now();
  const oneDay = 24 * 3600 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;
  let total = 0, totalDay = 0, totalWeek = 0, totalMonth = 0;
  let sessionLengths = [];
  let channelMap = {}, videoMap = {}, hourMap = {};
  const todayKey = getDayKey(now);
  sessions.forEach(s => {
    const dur = Math.floor((s.endTime - s.startTime) / 1000);
    if (dur < 5) return;
    total += dur;
    sessionLengths.push(dur);
    if (now - s.startTime < oneDay) totalDay += dur;
    if (now - s.startTime < oneWeek) totalWeek += dur;
    if (now - s.startTime < oneMonth) totalMonth += dur;
    // Channel
    if (s.channel) channelMap[s.channel] = (channelMap[s.channel] || 0) + dur;
    // Video
    if (s.title) videoMap[s.title] = (videoMap[s.title] || 0) + dur;
    // Hour
    const hour = getHour(s.startTime);
    hourMap[hour] = (hourMap[hour] || 0) + dur;
  });
  // Most-watched
  const topChannels = Object.entries(channelMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const topVideos = Object.entries(videoMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
  // Peak hour
  let peakHour = null, peakVal = 0;
  for (const [h, v] of Object.entries(hourMap)) {
    if (v > peakVal) { peakVal = v; peakHour = h; }
  }
  // Average session
  const avgSession = sessionLengths.length ? Math.round(sessionLengths.reduce((a,b)=>a+b,0)/sessionLengths.length) : 0;
  return {
    total, totalDay, totalWeek, totalMonth,
    topChannels, topVideos,
    avgSession, peakHour
  };
}

function renderStats(stats) {
  const c = document.getElementById('yt-stats-container');
  c.innerHTML = `
    <table style="width:100%;max-width:500px">
      <tr><td><b>Total Watch Time</b></td><td>${formatDuration(stats.total)}</td></tr>
      <tr><td>Today</td><td>${formatDuration(stats.totalDay)}</td></tr>
      <tr><td>This Week</td><td>${formatDuration(stats.totalWeek)}</td></tr>
      <tr><td>This Month</td><td>${formatDuration(stats.totalMonth)}</td></tr>
      <tr><td><b>Average Session</b></td><td>${formatDuration(stats.avgSession)}</td></tr>
      <tr><td><b>Peak Usage Hour</b></td><td>${stats.peakHour !== null ? stats.peakHour + ':00' : '-'}</td></tr>
      <tr><td><b>Top Channels</b></td><td>${stats.topChannels.map(([n,t])=>`${n} (${formatDuration(t)})`).join('<br>') || '-'}</td></tr>
      <tr><td><b>Top Videos</b></td><td>${stats.topVideos.map(([n,t])=>`${n} (${formatDuration(t)})`).join('<br>') || '-'}</td></tr>
    </table>
  `;
}

function loadStats() {
  chrome.storage.local.get({ ytWatchStats: [] }, function(data) {
    const stats = aggregateStats(data.ytWatchStats || []);
    renderStats(stats);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('yt-stats-container')) {
    loadStats();
    document.getElementById('reset-stats-btn').addEventListener('click', function() {
      if (confirm('Are you sure you want to reset all watch statistics?')) {
        chrome.storage.local.set({ ytWatchStats: [] }, loadStats);
      }
    });
  }
});
// --- END: YouTube Watch Statistics Section --- 