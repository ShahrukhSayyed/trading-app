/**
 * modules dependencies.
 */

const socketio = require('socket.io');

// worker thread 1 imported 
// const workerThread = require("./../../app/controllers/worker1.js");

let setServer = (server) => {

    let io = socketio.listen(server);
    let myIo = io.of('/')
    
    myIo.on('connection', (socket) => {

        console.log("Client Connected");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user', (userDetails) => {
            console.log("set-user called")
            console.log(userDetails)


        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");

            if (socket.userId) {
                console.log("disconnect")
            }

        }) // end of on disconnect

        socket.on('user-subscription', (data) => {
            console.log("socket user-subscription called")
            console.log(data);
            if(data.event.toLowerCase() == "subscribe"){
                //call to worker thread
                workerThread.readTradesData();
                // socket.broadcast.emit(data.userId, data);
            }
        });
    });
}

module.exports = {
    setServer: setServer
}
