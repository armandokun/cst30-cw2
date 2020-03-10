"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cortex_1 = require("./classes/Cortex");
// Reads keys from .env file
var dotenv = require('dotenv');
dotenv.config();
// console.log ENVIRONMENT VARIABLES for APIs
console.log('*** EMOTIV\'S API CONFIG DETAILS *** ' +
    '\n\tAPP_NAME: ' + process.env.APP_NAME + '\n\tAPP_ID: ' + process.env.APP_ID +
    '\n\tCLIENT_ID: ' + process.env.CLIENT_ID + '\n*** THE END ***');
// Credentials
var socketUrl = 'wss://localhost:6868';
var user = {
    "license": "BASIC API",
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "debit": 1
};
var c = new Cortex_1.default(user, socketUrl);
// Executes this piece of code when websockets has been opened
c.socket.on('open', function () {
    console.log('WebSocket Client: STATUS - OPEN');
    c.getUserInformation().then(function (r) {
        console.log(r);
        console.log('** CURRENT USER INFORMATION END **');
    });
    c.queryHeadsetId().then(function (r) {
        console.log(r);
        console.log('** DEVICE INFO END **');
    });
});
// ---------- sub data stream
// have six kind of stream data ['fac', 'pow', 'eeg', 'mot', 'met', 'com']
// user could sub one or many stream at once
// let streams = ['met'];
// Streams subscribed: EEG and Performance Metrics
// c.sub(streams);
//# sourceMappingURL=main.js.map