const { app, BrowserWindow, Tray, Menu } = require('electron');
const {ping} = require('./src/ping');
const {restartWifi} = require('./src/wifi');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadFile('index.html');
  return win;
}

let win = undefined;

function showWindow() {
  if(!win) {
    win = createWindow();
  }
  win.show();
  
  win.on('close', (event) => {
    if(!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
    return false;
  });
}

function trayOn() {
  const tray = new Tray("./assets/icons/png/icon_green_16.png");
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Wifi 살려주세요.', click: () => showWindow()},
    {label: 'Exit', click: () => {
      app.isQuitting = true;
      app.quit();
     }}
  ]);
  tray.setToolTip('Wi-Fi Hell...');
  tray.setContextMenu(contextMenu);
  doPing(tray);
}

function onIconRed(tray) {
    tray.setImage(`./assets/icons/png/icon_red_16.png`);
}

function onIconGreen(tray) {
    tray.setImage(`./assets/icons/png/icon_green_16.png`);
}

function doPing(tray) {
  setInterval(() => {
    ping((total, success, rate) => {
      if(success == 1) {
        // console.log('ping success');
        onIconGreen(tray);
      } else {
        // console.log('ping fail');
        console.error(`Ping timeout at ${new Date()}`);
        onIconRed(tray);
        restartWifi(() => console.log(`restarted wifi at ${new Date()}`));
      }
    });
  }, 1000);
}

// console.log(app);
app.on('ready', trayOn);
app.dock.hide();
console.log('electron is running...');