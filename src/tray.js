const appDir = require('path').dirname(require.main.filename);
const { app, Tray, Menu } = require('electron');

const getIconPath = (status) => `${appDir}/assets/icon/tray-${status}.png`;

let tray = undefined;
const enableTray = () => {
  tray = new Tray(getIconPath('good'));
  const menu = Menu.buildFromTemplate([
    {label: 'Wi-Fi chaos'},
    {label: 'good', click: () => setIconGood(tray)},
    {label: 'panic', click: () => setIconPanic(tray)},
    {label: 'Stop service', click: () => {
      app.isQuitting = true;
      app.quit();
    }},
  ]);

  tray.setToolTip('Wi-Fi chaos');
  tray.setContextMenu(menu);

  return tray;
};

const setIconGood = () => {
  tray.setImage(getIconPath('good'));
}

const setIconPanic = () => {
  tray.setImage(getIconPath('panic'));
}


module.exports = { enableTray, setIconGood, setIconPanic };

console.log(appDir);
