const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  const displays = screen.getAllDisplays();
  const miniScreen = displays.find(d => d.size.width === 960 && d.size.height === 640);
  const targetDisplay = miniScreen || screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    x: targetDisplay.bounds.x,
    y: targetDisplay.bounds.y,
    width: 960,
    height: 640,
    fullscreen: true, // Set to true if you want true fullscreen
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
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
