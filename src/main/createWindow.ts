import { shell, BrowserWindow } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import icon from '../../public/images/icon.png?asset';

export default function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then(() => {});
  } else {
    mainWindow.loadURL('http://chat.openai.com/chat');
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          const inputElement = document.querySelector('#prompt-textarea');
          if (inputElement && document.activeElement !== inputElement) {
            inputElement.focus();
            inputElement.select();
          }
        }
      });
    `);
  });

  //prevent app from closing when window is closed
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  return mainWindow;
}
