const logger = require('./../../app/libs/loggerLib');
const { MessageChannel, parentPort,  } = require('worker_threads');
const { port1, port2 } = new MessageChannel();


let worker3Port;

let previousObject;
let startTime ;
let interval = 15 //interval in 15 seconds
let barchartObject = {
    "key":"",
    "barChartData":[]
}
let barChartDataArray = []


parentPort.postMessage({
    port: port2,
}, [port2]);

parentPort.on('message', value => {
        if (value.port) {
        worker3Port = value.port;
    }
});

logger.info('Worker 2 Started', 'Worker1', 10);


function processFilteredData(value){

    let _flagFound = false;
    let bar_value = 1
    // console.log("Getting value from worker 1");
    // console.log(value);
    let barObject = {
        "key":value.sym,
        "barChartData":[],
        "startTime":0,
        "bar_value":1,
        "closingValue":0

    }

    barChartDataArray.forEach(element => {
        if(element.key == barObject.key){
            _flagFound = true;
        }
    });
    
    if(!_flagFound){
        barChartDataArray.push(barObject)
    }


    barChartDataArray.forEach(element => {
        if(element.key == barObject.key){
                if(element.barChartData.length == 0 ){
                    // console.log("first Element")

                    let ohlcPacket = {
                        "event":"ohlc_notify",
                        "symbol":value.sym,
                        "bar_num":element.bar_value,
                        "o":value.P,
                        "h": value.P,
                        "l":value.P,
                        "c":0,
                        "volume":value.Q + element.closingValue,
                    }
                    element.startTime = value.TS2;
                    element.barChartData.push(ohlcPacket)
                    // console.log(ohlcPacket)
                }
                else{
                    // console.log(((value.TS2 - element.startTime ) / 1e+9))
                    if(((value.TS2 - element.startTime ) / 1e+9) <= interval){ // converting nanosecond to seconds
                        // console.log("In Interval")

                        let ohlcPacket = {
                            "event":"ohlc_notify",
                            "symbol":value.sym,
                            "bar_num":element.bar_value,
                            "o":element.barChartData[0].o,
                            "h": value.P > element.barChartData[element.barChartData.length - 1].h ? value.P : element.barChartData[element.barChartData.length - 1].h,
                            "l":value.P < element.barChartData[element.barChartData.length - 1].l ? value.P : element.barChartData[element.barChartData.length - 1].l,
                            "c":0,
                            "volume":value.Q + element.barChartData[element.barChartData.length - 1].volume,
                        }
                        element.barChartData.push(ohlcPacket)
                        // console.log(ohlcPacket)
                    }
                    else{
                        // console.log("Interval timeout")
                        let ohlcPacket = {
                            "event":"ohlc_notify",
                            "symbol":value.sym,
                            "bar_num":element.bar_value,
                            "o":element.barChartData[0].o,
                            "h": value.P > element.barChartData[element.barChartData.length - 1].h ? value.P : element.barChartData[element.barChartData.length - 1].h,
                            "l":value.P < element.barChartData[element.barChartData.length - 1].l ? value.P : element.barChartData[element.barChartData.length - 1].l,
                            "c":value.P,
                            "volume":value.Q + element.barChartData[element.barChartData.length - 1].volume,
                        }
                        element.barChartData.push(ohlcPacket)
                        // console.log(ohlcPacket)
                        element.closingValue = ohlcPacket.volume
                        worker3Port.postMessage(element);// send msg to worker3

                        element.barChartData = []
                        element.bar_value ++;
                    }    
                }
        }
    });
    
}

port1.on('message', (value) => {

    processFilteredData(value);

});

