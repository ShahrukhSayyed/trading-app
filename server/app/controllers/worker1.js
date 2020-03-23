const { MessageChannel, parentPort,  } = require('worker_threads');
const JSONStream = require("JSONStream");
const es = require("event-stream");
const fs = require('fs')
const logger = require('./../../app/libs/loggerLib');

const { port1, port2 } = new MessageChannel();

let worker2Port;

parentPort.postMessage({
  port: port2,
}, [port2]);


parentPort.on('message', value => {
  if (value.port) {
    worker2Port = value.port;
  }
});

logger.info('Worker 1 Started', 'Worker1', 10);


function readTradesData(inputValue){
    fileStream = fs.createReadStream('./assets/trades.json', { encoding: "utf8" });
    fileStream.pipe(JSONStream.parse("*")).pipe(
      es.through(function(data) {
        // console.log("printing one customer object read from file ::");
        // console.log(data);
        this.pause();
        processOneTrade(inputValue,data, this);
        return data;
      }),
      function end() {
        logger.info('stream reading ended', 'readTradesData', 10);
        this.emit("end");
      }
    );    
}


function processOneTrade(inputValue,data, es) {
  // console.log(data)
  es.resume();
  if(inputValue.symbol == data.sym){
    worker2Port.postMessage(data); // send packet to worker2
  }
}

port1.on('message', (value) => {
    // console.log(value);
    readTradesData(value)
});
