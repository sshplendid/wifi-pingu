const appDir = require('path').dirname(require.main.filename);
const { app, BrowserWindow } = require('electron');
const { enableTray, setIconGood, setIconPanic } = require(appDir + '/src/tray');
const { ping } = require(appDir + '/src/ping');
const { controlWiFi, getWiFiStatus } = require(appDir + '/src/wifi');

function createWindow () {
  // 브라우저 창을 생성합니다.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile(appDir + '/index.html');
}

const watchNetwork = () => {
  setInterval(async () => {
    const output = await ping();
    if(output.received === 1) {
      setIconGood();
    } else {
      setIconPanic();
        const status = await getWiFiStatus();
        if(status.running) {
          await controlWiFi('off');
          await controlWiFi('on');
        }
    }
  }, 1000);
}

app.on('ready', enableTray);
app.dock.hide();
watchNetwork();