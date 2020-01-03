const cmd = require('node-cmd');
const wifiControl = 'networksetup -setairportpower en0 ';
const wifiStatus = 'networksetup -getairportnetwork en0';

const restartWifi = async (callback) => {
  cmd.get(wifiStatus, (err, data, stderr) => {
    const offMessage = 'Wi-Fi power is currently off.';
    
    if(data.includes(offMessage)) {
      return;
    }

    cmd.get(wifiControl + 'off', (err, data, stderr) => {
      if(err) {
        return;
      }
      console.log('Wi-Fi off.');
      cmd.get(wifiControl + 'on', async (err, data, stderr) => {
        if(err) {
          return;
        }
        await setTimeout(() => {
          console.log('Wi-Fi on.');
          if(callback)
            callback(data);
        }, 2000);
      });
    });
  });
};


module.exports = {restartWifi};