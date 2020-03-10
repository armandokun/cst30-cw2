import Cortex from './classes/Cortex';

// Reads keys from .env file
const dotenv = require('dotenv');
dotenv.config();


// console.log ENVIRONMENT VARIABLES for APIs
console.log('*** EMOTIV\'S API CONFIG DETAILS *** ' +
    '\n\tAPP_NAME: ' + process.env.APP_NAME + '\n\tAPP_ID: ' + process.env.APP_ID +
    '\n\tCLIENT_ID: ' + process.env.CLIENT_ID + '\n*** THE END ***');

// Credentials
let socketUrl = 'wss://localhost:6868';
let user = {
    "license": "BASIC API",
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "debit": 1
};

let c: Cortex = new Cortex(user, socketUrl);

// Executes this piece of code when websockets has been opened
c.socket.on('open', function () {
    console.log('WebSocket Client: STATUS - OPEN');
    c.getUserInformation().then(r => {
        console.log(r);
        console.log('** CURRENT USER INFORMATION END **');
    });
});

// ---------- sub data stream
// have six kind of stream data ['fac', 'pow', 'eeg', 'mot', 'met', 'com']
// user could sub one or many stream at once
// let streams = ['met'];

// Streams subscribed: EEG and Performance Metrics
// c.sub(streams);
