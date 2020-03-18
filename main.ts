import Cortex from './classes/Cortex';

// Reads keys from .env file
const dotenv = require('dotenv');
dotenv.config();


// console.log ENVIRONMENT VARIABLES for APIs
console.log('*** EMOTIV\'S API CONFIG DETAILS *** ' +
    '\n\tAPP_NAME: ' + process.env.APP_NAME + '\n\tAPP_ID: ' + process.env.APP_ID +
    '\n*** THE END ***');

// Credentials
let socketUrl: string = 'wss://localhost:6868';
let user: object = {
    "license": "BASIC API",
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "debit": 1
};

let c: Cortex = new Cortex(user, socketUrl);

let streams: string[];
// Executes this piece of code when websockets server has been opened
init().then(r => console.log(r));

async function init() {
    streams = ['met'];
    await c.sub(streams);
}
