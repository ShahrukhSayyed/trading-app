/**
 * modules dependencies.
 */
const logger = require('./../../app/libs/loggerLib');
const socketio = require('socket.io')(8000);
const underscore = require('underscore');

const { MessageChannel, parentPort,  } = require('worker_threads');

const { port1, port2 } = new MessageChannel();


let woker1Port;
let userSubscriptions = []
let users = [];

parentPort.postMessage({
    port: port2,
}, [port2]);

parentPort.on('message', value => {
    if (value.port) {
        woker1Port = value.port;
    }
});

logger.info('Worker 3 Started', 'Worker1', 10);


let setServer = (server) => {

    // let io = socketio.listen("localhost:9000");
    // let myIo = io.of('/')

    let myIo = socketio
    
    myIo.on('connection', (socket) => {

        console.log("Client Connected");

        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel
            console.log("Client disconnected");
        }) // end of on disconnect

        socket.on('user-subscription', (inputData) => {
            let userFound = false;
            console.log("socket user-subscription called")
            // console.log(data);
            if(inputData.eventData.event.toLowerCase() == "subscribe"){
                //call to worker thread
                for(let user of userSubscriptions){
                    if(user.userData.userId == inputData.userData.userId && user.eventData.symbol == inputData.eventData.symbol){
                        userFound = true
                        break;
                    }
                }
                if(!userFound){
                    userSubscriptions.push(inputData)
                    console.log(inputData.eventData)
                    woker1Port.postMessage(inputData.eventData);// send msg to worker1
                }
            }
        });


        port1.on('message', (inputData) => {
            let flagUserFound = false;
            let foundUserDetails;
            // console.log("Getting inputData from worker 2");
            // console.log(inputData);
            for(let user of userSubscriptions){

                if(user.eventData.symbol == inputData.key){
                    flagUserFound = true
                    foundUserDetails = user.userData
                    break;
                }
            }
            if(flagUserFound){
                    socket.emit(foundUserDetails.userId, inputData);                    
                // socket.emit("listen-subscription", inputData.barChartData);
            }
        });
        
    });
}


setServer();






