# YouTube Adjusted Time Remaining

Displays the time remaining at current playback speed on YouTube videos, and tracks how much time you save by watching at faster speeds.

## Features
- Shows adjusted time remaining based on current playback speed.
- Displays projected end time (12/24-hour format toggle).
- Tracks and displays time saved (session and all-time).
- All-time saved is shown as years, months, days, hours, and minutes.
- Customizable popup: theme, background/text color, opacity, and more.
- Options page for persistent settings and live preview.
- Keyboard accessible and accessible UI.

## Installation
1. Download or clone this repository.
2. In your browser, go to the extensions page:
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
3. Enable "Developer mode" (Chrome) or "Debug Add-ons" (Firefox).
4. Click "Load unpacked" (Chrome) or "Load Temporary Add-on" (Firefox) and select the `youtubetime` directory.

## Usage
- The adjusted time remaining will appear on YouTube video pages.
- Click the time display to open the settings popup.
- Access the full options page via the popup or browser extension menu.
- View your total time saved in the popup or options page.

## Development
- Main logic: `content.js`
- Options/settings: `options.js`, `options.html`
- Manifest: `manifest.json`
- Changelog: `CHANGELOG.txt`

## Contributing
Pull requests and suggestions are welcome! Please open an issue or PR for improvements or bug fixes.

## License
MIT License 