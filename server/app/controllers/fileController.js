/* Import All The Required Modules */

const fs = require('fs')

const tradesData = require('./../../assets/trades.json');

/* Read A File Synchronously */
let readFileSynchronously = () => {
    /* Function  : readFileSync(file[, options])
     *
      *Return Type : Buffer (If Encoders are Not Passed)
      * */
    let variableContainsFileData = fs.readFileSync('./assets/trades.json')
    console.log('This Is File Buffer')
    console.log(variableContainsFileData)

    let variableContainsEncodedFileData = fs.readFileSync('./assets/trades.json','utf8')
    console.log('This Is Encoded File Data')
    // console.log(variableContainsEncodedFileData)
}

let readFileInChunks = () => {  
  tradesData.forEach(element => {
    console.log(element) 
  });
}


let readFileAsynchronously = () => {
    /* Handling The Asynchronous Behaviour */
    // noinspection JSAnnotator
    fs.readFile('./assets/trades.json','utf8',(err,fileData)=>{
       if(err) {
           console.log('Some Error Occurred While Reading The File')
           console.log(err)
       } else {
           console.log('File Data Is Read Successfully')
           
           console.log(fileData)
           console.log("=========")
       }
    })
}

module.exports = {
    readFileSynchronously: readFileSynchronously,
    readFileAsynchronously: readFileAsynchronously,
    readFileInChunks:readFileInChunks
}