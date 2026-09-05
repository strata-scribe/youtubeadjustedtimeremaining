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

const Storage = {
  async get(key, defaultValue) {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
      const result = await browser.storage.sync.get(key);
      return result[key] !== undefined ? result[key] : defaultValue;
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      return new Promise(resolve => {
        chrome.storage.sync.get(key, result => {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
      });
    } else {
      const val = localStorage.getItem(key);
      if (val === null) return defaultValue;
      if (val === 'true') return true;
      if (val === 'false') return false;
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed.toString() === val) return parsed;
      return val;
    }
  },
  async set(key, value) {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.sync) {
      await browser.storage.sync.set({ [key]: value });
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ [key]: value });
    } else {
      localStorage.setItem(key, value.toString());
    }
  }
};



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
  const displayPosition = document.getElementById('display-position').value;
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

  // Position the preview
  if (displayPosition === 'top-right') {
    preview.style.position = 'absolute';
    preview.style.top = '10px';
    preview.style.right = '10px';
    preview.style.left = 'auto';
    preview.style.bottom = 'auto';
    document.querySelector('.mock-player').appendChild(preview);
  } else if (displayPosition === 'bottom-right') {
    preview.style.position = 'absolute';
    preview.style.bottom = '40px';
    preview.style.right = '10px';
    preview.style.left = 'auto';
    preview.style.top = 'auto';
    document.querySelector('.mock-player').appendChild(preview);
  } else {
    // video-bar-integrated
    preview.style.position = 'static';
    preview.style.top = 'auto';
    preview.style.left = 'auto';
    preview.style.right = 'auto';
    preview.style.bottom = 'auto';
    const integratedContainer = document.getElementById('preview-integrated-container');
    if (integratedContainer) {
      integratedContainer.appendChild(preview);
    }
  }

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

  // Settings Config: map DOM id -> { key, defaultValue }
  const config = {
    'theme': { key: 'ytAdjustedTimeTheme', defaultValue: 'Classic' },
    'color': { key: 'ytAdjustedTimeBoxColor', defaultValue: '#ffa500' },
    'color-enabled': { key: 'ytAdjustedTimeBoxColorEnabled', defaultValue: true },
    'text-color': { key: 'ytAdjustedTimeTextColor', defaultValue: '#ffffff' },
    'show-endtime': { key: 'ytAdjustedTimeShowEndTime', defaultValue: true },
    '24hour': { key: 'ytAdjustedTime24Hour', defaultValue: false },
    'box-opacity': { key: 'ytAdjustedTimeBoxOpacity', defaultValue: 100 },
    'display-position': { key: 'ytAdjustedTimePosition', defaultValue: 'video-bar-integrated' }
  };

  // Load settings dynamically
  const promises = Object.entries(config).map(([id, conf]) =>
    Storage.get(conf.key, conf.defaultValue).then(val => ({ id, val }))
  );

  const results = await Promise.all(promises);
  results.forEach(({ id, val }) => {
    const el = document.getElementById(id);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = val;
      } else {
        el.value = val;
      }
    }
  });

  const boxOpacity = document.getElementById('box-opacity').value;
  document.getElementById('box-opacity-value').textContent = boxOpacity + '%';

  const theme = document.getElementById('theme').value;
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

// Event Delegation for input / change / click
document.addEventListener('input', e => {
  if (e.target.matches('#color, #text-color, #box-opacity')) {
    updatePreview();
  }
});

document.addEventListener('change', async e => {
  if (e.target.matches('#display-position')) {
    updatePreview();
  }

  if (e.target.matches('#theme')) {
    if (e.target.value !== 'Custom') {
      const preset = YT_ADJUSTED_TIME_THEMES.find(t => t.name === e.target.value);
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
  }

  if (e.target.matches('#color-enabled, #show-endtime, #24hour')) {
    updatePreview();
  }

  if (e.target.matches('#box-opacity')) {
    await Storage.set('ytAdjustedTimeBoxOpacity', e.target.value);
    updatePreview();
  }
});

document.addEventListener('click', async e => {
  if (e.target.matches('#apply-btn')) {
    e.preventDefault();
    await Storage.set('ytAdjustedTimeTheme', document.getElementById('theme').value);
    await Storage.set('ytAdjustedTimeBoxColor', document.getElementById('color').value);
    await Storage.set('ytAdjustedTimeBoxColorEnabled', document.getElementById('color-enabled').checked);
    await Storage.set('ytAdjustedTimeTextColor', document.getElementById('text-color').value);
    await Storage.set('ytAdjustedTimeShowEndTime', document.getElementById('show-endtime').checked);
    await Storage.set('ytAdjustedTime24Hour', document.getElementById('24hour').checked);
    await Storage.set('ytAdjustedTimeBoxOpacity', document.getElementById('box-opacity').value);
    await Storage.set('ytAdjustedTimePosition', document.getElementById('display-position').value);

    document.getElementById('applied-msg').style.display = 'inline';
    setTimeout(() => {
      document.getElementById('applied-msg').style.display = 'none';
    }, 1200);
  }

  if (e.target.matches('#back-to-youtube')) {
    window.close();
  }
});

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
    const total = await Storage.get('ytAdjustedTimeGlobalSaved', 0);
    document.getElementById('yt-global-time-saved').textContent = formatGlobalTimeSaved(total);
  }
  updateStat();
  document.getElementById('yt-reset-global-time-saved').onclick = async function() {
    await Storage.set('ytAdjustedTimeGlobalSaved', 0);
    updateStat();
  };
});

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