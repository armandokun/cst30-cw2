import Cortex from './classes/Cortex';

// Reads keys from .env file
const dotenv = require('dotenv');
dotenv.config();


// console.log ENVIRONMENT VARIABLES for APIs
console.log('*** EMOTIV\'S API CONFIG DETAILS *** ' +
    '\n\tAPP_NAME: ' + process.env.APP_NAME + '\n\tAPP_ID: ' + process.env.APP_ID +
    '\n*** THE END ***');

// Credentials
let socketUrl = 'wss://localhost:6868';
let user = {
    "license": "BASIC API",
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "debit": 1
};

let c: Cortex = new Cortex(user, socketUrl);
let headsetId: string;
let authToken: string;
let sessionId: string;
// Executes this piece of code when websockets server has been opened
c.socket.on('open', async function () {
    await init().then(r => console.log(r));
});

async function init() {

    // get Authtoken
    await c.authorize()
        .then(response => authToken = response.toString());

    // get UserInfo, only access with authtoken
    await c.getUserInformation(authToken)
        .then(r => {
            console.log(r);
            console.log('** CURRENT USER INFORMATION END **');
        });

    // get headset ID
    await c.queryHeadsetId()
        .then(response => headsetId = response.toString()
        );

    await c.createSession(authToken, headsetId)
        .then(r => sessionId = r.toString()
        );
}
