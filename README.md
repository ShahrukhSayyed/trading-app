# Trading App - Live Trading application using NodeJs ( Worker threads and Socket communication)
 
There are two parts of the task .

1. Server
2. Client

Server Application

Application starts with the main application file(app.js)
It is having functions to spawn the worker threads and establish the communication in between them and run the http Server.

Functions in app.js
1. createWorkerThreadsServer()
    This function will spawn the threads and establishes the communication between threads
2. createServer() 
    This function will start the http server .


There are 3 threads in the server application
i. Worker_1: Reads the Trades data input (line by line from JSON), and
sends the filtered packet which was subscribe by user to the FSM (Finite-State-Machine) thread.

Functions in Worker_1 :
1.readTradesData()
    This Function is used to read the data from JSON file. After reading it passes the data to another function named processOneTrade() line by line .
2.processOneTrade()
    This function filters the data based on user subscription and send the filtered packet to Worker_2(FSM).

ii.Worker_2: (FSM) computes OHLC packets based on 15 seconds
(interval) and constructs 'BAR' chart data, based on timestamp TS2.

Functions in Worker_2 :
1.processFilteredData()
    This function is used to calculate the OHLC Packets based on subscription and interval.
    
iii. Worker_3: (WebsocketThread) Client subscriptions come here. It Maintains
the client list, and publishes the BAR OHLC data as computed in real time.

Functions in Worker_3 :
1.setServer()
    This method uses the socket-io communication to establish the communication between clients . It is having two methods one to subscribe (listen) the user subscription data from client and another is used to emit(transfer) the output to user(client).

user-subscription is an event to listen the client subscription request.
listen-subscription is an event to emit the response to client.


  

2. Client

Socket-io library is used to establish the communication .

user-subscription is an event to emit the client subscription request to server.(after running the application it takes 2 seconds to emit the request as setTimeout method is used)

listen-subscription is an event to listen the response at client end.



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Note : You can skip this steps if you have Node and npm  installed on your system.
 
1) To start with this, install node and npm

* [NodeJs](https://nodejs.org/en/) - How to install node?

2) Install git 


* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - How to install Git?

 
### Installing/ Running locally


1) Create a folder named as trading-app at any local drive

2) change directory to trading-app

```
>cd trading-app
```

3) Fetch the source code from my github library
 
```
>git init
```

```
>git remote add origin https://github.com/ShahrukhSayyed/trading-app.git
```

```
>git pull origin master
```

4) Install all the modules required to run the given application with following command(do the following step in client and server folder)

```
>npm install
```

5) Run the Server application by using following command(should be in server folder)

```
>node --experimental-worker app.js
```

5) Run the client application by using following command(should be client folder)

```
>node client.js
```

## Architecture of Application

### Data flow
![alt architecture](https://github.com/ShahrukhSayyed/trading-app/blob/master/Architecture%20Flow.png)

## Built With

* [NPM](https://www.npmjs.com/) - Most of the modules are used
* [Node](https://nodejs.org) - Node JS
* [SocketIO](https://socket.io) - Library for Socket communication
* [worker_threads] - Library for Workers in NodeJS
* [JSONStream] - Library for reading JSON data in NodeJS



## Authors

* **Shahrukh Sayyed** - *Initial work* - [ShahrukhSayyed](https://github.com/ShahrukhSayyed)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for detailsg

## Acknowledgments

* A big thanks for Bloggers and NodeJS community.
