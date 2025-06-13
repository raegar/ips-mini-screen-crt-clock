const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const AutoLaunch = require('auto-launch');

const appLauncher = new AutoLaunch({
  name: 'CRT Dashboard',
});

appLauncher.isEnabled().then((enabled) => {
  if (!enabled) appLauncher.enable();
});

function createWindow() {
  const displays = screen.getAllDisplays();
  const miniScreen = displays.find(d => d.size.width === 960 && d.size.height === 640);
  const targetDisplay = miniScreen || screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    x: targetDisplay.bounds.x,
    y: targetDisplay.bounds.y,
    width: 960,
    height: 640,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // Dev mode: load from Vite server
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Production: load from built Vite output
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
