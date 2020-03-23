const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:8000");


let userDetails = { "userName" :"Shahrukh Sayyed","userId":"A12345678","authToken":"987ABC1234"}
let eventDetails = {"event": "subscribe", "symbol": "XXBTZUSD", "interval": 15,"userId":"A12345678"}

// ioClient.on("verifyUser", () => {
//     console.info("Client verifyUser")
//     ioClient.emit('set-user',userDetails)
// });

let userSubscription = {
    userData:userDetails,
    eventData:eventDetails
}

setTimeout(() => {
    console.log("User subscription to Trading")
    ioClient.emit('user-subscription',userSubscription)
}, 2000);


ioClient.on(userDetails.userId, (data) => {
    console.info("Client listen-subscription")
    console.log(data)
});
