const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const appConfig = require('./config/appConfig');
const logger = require('./app/libs/loggerLib');
const cluster = require('cluster');
const noOfCPU = require('os').cpus().length;

const { Worker } = require('worker_threads');

app.use(express.static(path.join(__dirname, 'client')));

/**
 * Create HTTP server.
*/

const server = http.createServer(app);
// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

// end server listening code


// socket io connection handler 
// const socketLib = require("./app/libs/socketLib");
// const socketServer = socketLib.setServer(server);
// end socketio connection handler

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
    throw error;
  }


  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    default:
      logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  ('Listening on ' + bind);
  logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
  // fileController.readFileAsynchronously()
  createWorkerThreadsServer()

}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

let createWorkerThreadsServer = () => {

  const w1 = new Worker(path.join(__dirname,'./app/controllers/worker1.js'));
  const w2 = new Worker(path.join(__dirname,'./app/controllers/worker2.js'));
  const w3 = new Worker(path.join(__dirname,'./app/controllers/worker3.js'));

  w1.once('message', value => {
    // console.log("w1once message")
    // console.log(value)

    w3.postMessage({
        port: value.port
    }, [value.port]);
  });
  
  w2.once('message', value => {
    // console.log("w2once message")
    // console.log(value)

    w1.postMessage({
        port: value.port
    }, [value.port]);
  });
  
  w3.once('message', value => {
    // console.log("w3once message")
    // console.log(value)
    w2.postMessage({
        port: value.port
    }, [value.port]);
  });
  
}

module.exports = app;
