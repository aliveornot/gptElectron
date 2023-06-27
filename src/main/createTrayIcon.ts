import { Menu, Tray } from 'electron';
import icon from '../../public/images/icon.png?asset';

export default function createTrayIcon(app: Electron.App) {
  const tray = new Tray(icon);
  tray.setToolTip('Fast GPT');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show GPT',
      click: () => {
        /* handle open */
        /* now does nothing */
      }
    },
    {
      label: 'Settings',
      click: () => {
        /* handle settings */
        /* now does nothing */
      }
    },
    {
      label: 'Close',
      click: () => {
        tray.destroy();
        app.exit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);

  return tray;
}
