const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const contentJsPath = path.join(__dirname, '../content.js');
const contentJsCode = fs.readFileSync(contentJsPath, 'utf8');

const timeouts = new Set();
const intervals = new Set();

const context = {
    console: { log: () => {} },
    Math: Math,
    Date: Date,
    URL: URL,
    browser: { storage: { sync: { get: () => Promise.resolve({}) } } },
    chrome: { storage: { local: { get: () => {} } } },
    document: {
        querySelector: () => null,
        createElement: () => ({ style: {}, addEventListener: () => {} }),
    },
    window: {
        location: { href: 'https://youtube.com' },
        addEventListener: () => {}
    },
    location: { href: 'https://youtube.com' },
    MutationObserver: class { constructor() {} observe() {} disconnect() {} },
    setTimeout: (cb, ms) => {
        const id = setTimeout(cb, ms);
        timeouts.add(id);
        return id;
    },
    clearTimeout: (id) => {
        clearTimeout(id);
        timeouts.delete(id);
    },
    setInterval: (cb, ms) => {
        const id = setInterval(cb, ms);
        intervals.add(id);
        return id;
    },
    clearInterval: (id) => {
        clearInterval(id);
        intervals.delete(id);
    }
};

vm.createContext(context);
vm.runInContext(contentJsCode, context);

function runTests() {
    console.log('Running Time Formatter Tests...');

    const { formatTime, calculateAdjustedTimeLeft, formatLongDuration } = context;

    // formatTime tests
    assert.strictEqual(formatTime(0), '0:00');
    assert.strictEqual(formatTime(30), '0:30');
    assert.strictEqual(formatTime(60), '1:00');
    assert.strictEqual(formatTime(65), '1:05');
    assert.strictEqual(formatTime(3600), '1:00:00');
    assert.strictEqual(formatTime(3665), '1:01:05');

    // Negative time handling
    assert.strictEqual(formatTime(-10), '0:00');
    assert.strictEqual(formatTime(-3600), '0:00');

    // Over 24 hours
    assert.strictEqual(formatTime(86400), '24:00:00');
    assert.strictEqual(formatTime(90000), '25:00:00');

    // calculateAdjustedTimeLeft tests
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 0.25 }).totalAdjusted, 400);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 0.5 }).totalAdjusted, 200);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 0.75 }).totalAdjusted, 133.33333333333334);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 1 }).totalAdjusted, 100);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 1.25 }).totalAdjusted, 80);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 1.5 }).totalAdjusted, 66.66666666666667);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 1.75 }).totalAdjusted, 57.142857142857146);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 2 }).totalAdjusted, 50);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 2.5 }).totalAdjusted, 40);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 3 }).totalAdjusted, 33.333333333333336);
    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 0, playbackRate: 4 }).totalAdjusted, 25);

    assert.strictEqual(calculateAdjustedTimeLeft({ duration: 100, currentTime: 20, playbackRate: 2 }).totalAdjusted, 40);
    assert.strictEqual(calculateAdjustedTimeLeft(null).totalAdjusted, 0);

    // formatLongDuration tests
    assert.strictEqual(formatLongDuration(0), '0m');
    assert.strictEqual(formatLongDuration(30), '0m');
    assert.strictEqual(formatLongDuration(60), '1m');
    assert.strictEqual(formatLongDuration(3600), '1h');
    assert.strictEqual(formatLongDuration(3660), '1h 1m');
    assert.strictEqual(formatLongDuration(86400), '1d');
    assert.strictEqual(formatLongDuration(90000), '1d 1h');

    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    assert.strictEqual(formatLongDuration(YEAR), '1y');
    assert.strictEqual(formatLongDuration(YEAR + MONTH + DAY + HOUR + MINUTE), '1y 1mo 1d 1h 1m');

    console.log('All tests passed!');

    // Cleanup
    for (const id of timeouts) clearTimeout(id);
    for (const id of intervals) clearInterval(id);
}

runTests();
