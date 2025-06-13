# CRT Dashboard

A retro-styled, full-screen clock dashboard designed for a 960x640 IPS mini display, built using **React**, **Electron**, and **Vite**. Features authentic CRT effects like screen flicker, scanlines, and degaussing animations.

![Screenshot Placeholder](assets/screenshot.png) <!-- Replace with real screenshot path -->

---

## 🕹 Features

- ⚡ Real-time digital clock display
- 🟢 CRT scanlines, glow, and flicker effects
- 💥 Degauss animation triggered by clicking the display
- 🖥 Designed for mini displays (960x640)
- 💾 Auto-start on system boot (via installer)
- 📦 Packaged as a standalone Electron app for Windows 64-bit

---

## 🛠 Installation

### Development

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/crt-dashboard.git
   cd crt-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

---

### Production Build

To create a distributable `.exe` installer:

```bash
npm run package
```

Installer will be located in the `release/` folder.

---

## 📁 Project Structure

```
electron/           # Electron main process code
src/                # React component for the CRT dashboard
dist/               # Production output (after `vite build`)
assets/             # Icons, screenshots, resources
```

---

## 💻 Auto-Launch at Startup

This app uses [`auto-launch`](https://www.npmjs.com/package/auto-launch) to register itself with system startup during installation. No additional steps needed after install.

---

## 🔧 Configuration

To target a specific display (like your mini 960x640 screen), the Electron app will automatically search for a monitor with that resolution and launch the window there in fullscreen mode.

If not found, it defaults to your primary display.

---

## 🧪 Dev Scripts

| Script         | Purpose                         |
|----------------|---------------------------------|
| `npm run dev`  | Start Vite + Electron dev mode  |
| `npm run build`| Build static assets (Vite)      |
| `npm run build:electron` | Build Electron app     |
| `npm run package` | Build production installer   |

---

## 📝 Version

**v0.0.1** – First packaged release.

---

## 📄 License

MIT © Jamie Myland (@raegar)
