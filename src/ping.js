const cmd = require('node-cmd');

const ping = (callback) => {
  const result = cmd.get('ping -c 1 -t 1 8.8.8.8',
    (err, data, stderr) => {
      const outputs = data.split('\n');
      const regex = /(\d+) packets transmitted, (\d+) packets received, (\d+\.)?(\d)+\% packet loss/gi;
      const result = outputs.filter(line => regex.test(line))
      .map(r => {
        return {
          transmitted: r.replace(regex, '$1'),
          received: r.replace(regex, '$2'),
          lossRate: r.replace(regex, '$3$4'),
        };
      }).reduce((pv, cr) => cr, {});
      if(!result) {
        console.error(`command failed.`);
        return;
      }
      
      const {transmitted, received, lossRate} = result;
      // console.log(`result: ${transmitted}, ${received}, ${lossRate}`);
      callback(transmitted, received, lossRate);
    });

  
    if(result.exitCode !== null) {
      console.error(`ping command failed.`);
    }
};

module.exports = {ping: ping};