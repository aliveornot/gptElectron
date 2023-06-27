import { app, globalShortcut } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import createWindow from './createWindow';
import createTrayIcon from './createTrayIcon';

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.setLoginItemSettings({
  openAtLogin: true
});

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  const mainWindow = createWindow();
  const tray = createTrayIcon(app);
  console.log('tray', tray);

  // Register F5 shortcut listener
  globalShortcut.register('F5', function () {
    console.log('f5 is pressed');
    mainWindow.reload();
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // app.on('activate', function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow();
  // });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  globalShortcut.register('CommandOrControl+Alt+K', () => {
    // if winodw is not visible, or not activated, show it. if it is visible and active, hide it.
    if (mainWindow.isVisible() && mainWindow.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
