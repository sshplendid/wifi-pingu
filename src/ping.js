const { spawn } = require('child_process');

const ping = async () => {
  const process = spawn('ping', ['-c', '1', '-t', '1', '8.8.8.8']);
  
  let result = undefined;
  for await(const data of process.stdout) {
    result = data;
  }
  
  // console.log(`data: ${result}`);
  return parsePingResult(result);
};

const parsePingResult = (data) => {
  const outputs = String.prototype.split.call(data, '\n');
  const regex = /(\d+) packets transmitted, (\d+) packets received, (\d+\.)?(\d)+\% packet loss/gi;
  const result = outputs.filter(line => regex.test(line))
    .map(r => {
      return {
        transmitted: parseInt(r.replace(regex, '$1')),
        received: parseInt(r.replace(regex, '$2')),
        lossRate: parseFloat(r.replace(regex, '$3$4'))
      };
    }).reduce((prev, current) => current, {});
  return result;
};


module.exports = { ping };

if(false) {
  (async () => {
    console.log('test');
    console.log(await ping());
  })();
}