const { spawn } = require('child_process');

const controlWiFi = async (status) => {
  const process = spawn('networksetup', ['-setairportpower', 'en0', status]);
  
  let result = undefined;
  for await(const data of process.stdout) {
    result = data;
  }
  // console.log(`=> ${result}`);
  return true;
};

const getWiFiStatus = async () => {
  const process = spawn('networksetup', ['-getairportnetwork', 'en0']);

  let result = undefined;
  for await(const data of process.stdout) {
    result = data;
  }

  return parseWiFiStatus(result);
};

const parseWiFiStatus = (output) => {
  const offMessage = 'Wi-Fi power is currently off.';
  const onMessage = /Current Wi-Fi Network: (.*)/;
  
  if (String.prototype.includes.call(output, offMessage)) {
    return {running: false, network: undefined};
  }
  const networkStatus = String.prototype.split.call(output, '\n').filter(line => onMessage.test(line))
  .map(outputLine => {
    const network = outputLine.replace(onMessage, '$1');
    return {running: true, network};
  }).reduce((prev, current) => current, {});
  
  return networkStatus;
}


module.exports = { controlWiFi, getWiFiStatus };

if(false) {
  (async () => {
    console.log('test');
    console.log(await getWiFiStatus());
    // console.log(':: ' + await controlWiFi('off'));
  })();
}