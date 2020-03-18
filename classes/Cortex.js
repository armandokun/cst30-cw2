"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require('ws');
var aws = require('aws-sdk');
aws.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});
var documentClient = new aws.DynamoDB.DocumentClient();
// Reads keys from .env file
var dotenv = require('dotenv');
dotenv.config();
/**
 * This class handle:
 *  - create websocket connection
 *  - handle request for : headset , request access, control headset ...
 *  - handle 2 main flows : sub and train flow
 *  - use async/await and Promise for request need to be run on sync
 */
var Cortex = /** @class */ (function () {
    function Cortex(user, socketUrl) {
        // create socket
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        this.socket = new WebSocket(socketUrl);
        // read user information
        this.user = user;
    }
    /** Authentication
     * - this section is for authorising and retrieving info about the user
     */
    Cortex.prototype.requestAccess = function () {
        var socket = this.socket;
        var user = this.user;
        return new Promise(function (resolve, reject) {
            var REQUEST_ACCESS_ID = 1;
            var requestAccessRequest = {
                "jsonrpc": "2.0",
                "method": "requestAccess",
                "params": {
                    "clientId": user.clientId,
                    "clientSecret": user.clientSecret
                },
                "id": REQUEST_ACCESS_ID
            };
            // console.log('start send request: ',requestAccessRequest)
            socket.send(JSON.stringify(requestAccessRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] === REQUEST_ACCESS_ID) {
                        resolve(data);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    Cortex.prototype.authorize = function () {
        var socket = this.socket;
        var user = this.user;
        var authToken = this.authToken;
        return new Promise(function (resolve, reject) {
            var AUTHORIZE_ID = 4;
            var authorizeRequest = {
                "jsonrpc": "2.0", "method": "authorize",
                "params": {
                    "clientId": user.clientId,
                    "clientSecret": user.clientSecret
                },
                "id": AUTHORIZE_ID
            };
            socket.send(JSON.stringify(authorizeRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] === AUTHORIZE_ID) {
                        authToken = JSON.parse(data)['result']['cortexToken'];
                        resolve(authToken);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    // Check if user is logged in through Emotiv App
    Cortex.prototype.getUserInformation = function (authToken) {
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Ask the user to approve this application
                    return [4 /*yield*/, this.requestAccess().then(function (r) { return console.log(r); })];
                    case 1:
                        // Ask the user to approve this application
                        _a.sent();
                        socket = this.socket;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var REQUEST_ACCESS_ID = 1;
                                var requestAccessRequest = {
                                    "id": REQUEST_ACCESS_ID,
                                    "jsonrpc": "2.0",
                                    "method": "getUserInformation",
                                    "params": {
                                        "cortexToken": authToken
                                    }
                                };
                                socket.send(JSON.stringify(requestAccessRequest));
                                socket.on('message', function (data) {
                                    try {
                                        var socketData = JSON.parse(data);
                                        if (socketData['id'] === REQUEST_ACCESS_ID) {
                                            console.log('** CURRENT USER INFORMATION ** ');
                                            resolve(socketData['result']);
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                        reject();
                                    }
                                });
                            })];
                }
            });
        });
    };
    /** Headsets
     * - this section is for headset control
     */
    Cortex.prototype.queryHeadsetId = function () {
        var QUERY_HEADSET_ID = 2;
        var socket = this.socket;
        var queryHeadsetRequest = {
            "jsonrpc": "2.0",
            "id": QUERY_HEADSET_ID,
            "method": "queryHeadsets"
        };
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(queryHeadsetRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] === QUERY_HEADSET_ID) {
                        // console.log(JSON.parse(data)['result'].length);
                        if (JSON.parse(data)['result'].length > 0) {
                            var headset = JSON.parse(data)['result'][0];
                            resolve(headset['id']);
                        }
                        else {
                            console.error('No have any headset, please connect headset with your pc.');
                        }
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    };
    // toggles the device to reconnect in case of an error
    Cortex.prototype.controlDevice = function (headsetId) {
        var socket = this.socket;
        var CONTROL_DEVICE_ID = 3;
        var controlDeviceRequest = {
            "jsonrpc": "2.0",
            "id": CONTROL_DEVICE_ID,
            "method": "controlDevice",
            "params": {
                "command": "connect",
                "headset": headsetId
            }
        };
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(controlDeviceRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] == CONTROL_DEVICE_ID) {
                        resolve(data);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    /** Sessions
     * - this section is for creating/stopping/marking sessions
     */
    Cortex.prototype.createSession = function (authToken, headsetId) {
        var socket = this.socket;
        var CREATE_SESSION_ID = 5;
        var createSessionRequestOpen = {
            "jsonrpc": "2.0",
            "id": CREATE_SESSION_ID,
            "method": "createSession",
            "params": {
                "cortexToken": authToken,
                "headset": headsetId,
                "status": "open"
            }
        };
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(createSessionRequestOpen));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] === CREATE_SESSION_ID) {
                        var sessionId = JSON.parse(data)['result']['id'];
                        resolve(sessionId);
                    }
                }
                catch (error) {
                    console.log(data);
                    reject('Error in calling createSession in Cortex Class');
                }
            });
        });
    };
    Cortex.prototype.startRecord = function (authToken, sessionId, recordName) {
        var socket = this.socket;
        var CREATE_RECORD_REQUEST_ID = 11;
        var createRecordRequest = {
            "jsonrpc": "2.0",
            "method": "updateSession",
            "params": {
                "cortexToken": authToken,
                "session": sessionId,
                "status": "startRecord",
                "title": recordName,
                "description": "test_marker",
                "groupName": "QA"
            },
            "id": CREATE_RECORD_REQUEST_ID
        };
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(createRecordRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] == CREATE_RECORD_REQUEST_ID) {
                        console.log('CREATE RECORD RESULT --------------------------------');
                        console.log(data);
                        resolve(data);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    Cortex.prototype.injectMarkerRequest = function (authToken, sessionId, label, value, port, time) {
        var socket = this.socket;
        var INJECT_MARKER_REQUEST_ID = 13;
        var injectMarkerRequest = {
            "jsonrpc": "2.0",
            "id": INJECT_MARKER_REQUEST_ID,
            "method": "injectMarker",
            "params": {
                "cortexToken": authToken,
                "session": sessionId,
                "label": label,
                "value": value,
                "port": port,
                "time": time
            }
        };
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(injectMarkerRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] == INJECT_MARKER_REQUEST_ID) {
                        console.log('INJECT MARKER RESULT --------------------------------');
                        console.log(data);
                        resolve(data);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    Cortex.prototype.stopRecord = function (authToken, sessionId, recordName) {
        var socket = this.socket;
        var STOP_RECORD_REQUEST_ID = 12;
        var stopRecordRequest = {
            "jsonrpc": "2.0",
            "method": "updateSession",
            "params": {
                "cortexToken": authToken,
                "session": sessionId,
                "status": "stopRecord",
                "title": recordName,
                "description": "test_marker",
                "groupName": "QA"
            },
            "id": STOP_RECORD_REQUEST_ID
        };
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(stopRecordRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] == STOP_RECORD_REQUEST_ID) {
                        console.log('STOP RECORD RESULT --------------------------------');
                        console.log(data);
                        resolve(data);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    Cortex.prototype.addMarker = function () {
        var _this = this;
        this.socket.on('open', function () { return __awaiter(_this, void 0, void 0, function () {
            var recordName, thisInjectMarker, numberOfMarker, _loop_1, numMarker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkGrantAccessAndQuerySessionInfo()];
                    case 1:
                        _a.sent();
                        recordName = 'test_marker';
                        return [4 /*yield*/, this.startRecord(this.authToken, this.sessionId, recordName)];
                    case 2:
                        _a.sent();
                        thisInjectMarker = this;
                        numberOfMarker = 10;
                        _loop_1 = function (numMarker) {
                            setTimeout(function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var markerLabel, markerTime, marker;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                markerLabel = "marker_number_" + numMarker;
                                                markerTime = Date.now();
                                                marker = {
                                                    label: markerLabel,
                                                    value: "test",
                                                    port: "test",
                                                    time: markerTime
                                                };
                                                return [4 /*yield*/, thisInjectMarker.injectMarkerRequest(thisInjectMarker.authToken, thisInjectMarker.sessionId, marker.label, marker.value, marker.port, marker.time)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }, 3000);
                        };
                        for (numMarker = 0; numMarker < numberOfMarker; numMarker++) {
                            _loop_1(numMarker);
                        }
                        return [4 /*yield*/, this.stopRecord(this.authToken, this.sessionId, recordName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Cortex.prototype.subRequest = function (stream, authToken, sessionId) {
        var socket = this.socket;
        var SUB_REQUEST_ID = 6;
        var subRequest = {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "cortexToken": authToken,
                "session": sessionId,
                "streams": stream
            },
            "id": SUB_REQUEST_ID
        };
        socket.send(JSON.stringify(subRequest));
        socket.on('message', function (data) {
            // console.log(JSON.parse(data));
            try {
                if (JSON.parse(data)['id'] === SUB_REQUEST_ID) {
                    console.log('SUB REQUEST RESULT --------------------------------');
                    console.log('\n');
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    };
    Cortex.prototype.mentalCommandActiveActionRequest = function (authToken, sessionId, profile, action) {
        var socket = this.socket;
        var MENTAL_COMMAND_ACTIVE_ACTION_ID = 10;
        var mentalCommandActiveActionRequest = {
            "jsonrpc": "2.0",
            "method": "mentalCommandActiveAction",
            "params": {
                "cortexToken": authToken,
                "status": "set",
                "session": sessionId,
                "profile": profile,
                "actions": action
            },
            "id": MENTAL_COMMAND_ACTIVE_ACTION_ID
        };
        // console.log(mentalCommandActiveActionRequest)
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(mentalCommandActiveActionRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] == MENTAL_COMMAND_ACTIVE_ACTION_ID) {
                        console.log('MENTAL COMMAND ACTIVE ACTION RESULT --------------------');
                        console.log(data);
                        console.log('\r\n');
                        resolve(data);
                    }
                }
                catch (error) {
                }
            });
        });
    };
    /**
     * - query headset info
     * - connect to headset with control device request
     * - authentication and get back auth token
     * - create session and get back session id
     */
    Cortex.prototype.querySessionInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headsetId, ctResult, authToken, sessionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryHeadsetId()
                            .then(function (headset) {
                            headsetId = headset;
                        })];
                    case 1:
                        _a.sent();
                        this.headsetId = headsetId;
                        return [4 /*yield*/, this.controlDevice(headsetId).then(function (result) {
                                ctResult = result;
                            })];
                    case 2:
                        _a.sent();
                        this.ctResult = ctResult;
                        return [4 /*yield*/, this.authorize().then(function (auth) {
                                authToken = auth;
                            })];
                    case 3:
                        _a.sent();
                        this.authToken = authToken;
                        return [4 /*yield*/, this.createSession(authToken, headsetId).then(function (result) {
                                sessionId = result;
                            })];
                    case 4:
                        _a.sent();
                        this.sessionId = sessionId;
                        console.log('HEADSET ID -----------------------------------');
                        console.log(this.headsetId);
                        console.log('\r\n');
                        console.log('CONNECT STATUS -------------------------------');
                        console.log(this.ctResult);
                        console.log('\r\n');
                        console.log('AUTH TOKEN -----------------------------------');
                        console.log(this.authToken);
                        console.log('\r\n');
                        console.log('SESSION ID -----------------------------------');
                        console.log(this.sessionId);
                        console.log('\r\n');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * - check if user have logged in
     * - check if app is granted for access
     * - query session info to prepare for sub and train
     */
    Cortex.prototype.checkGrantAccessAndQuerySessionInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestAccessResult, accessGranted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestAccess().then(function (result) {
                            requestAccessResult = result;
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, JSON.parse(requestAccessResult)];
                    case 2:
                        accessGranted = _a.sent();
                        if (!("error" in accessGranted)) return [3 /*break*/, 3];
                        console.log('You must login on CortexUI before request for grant access then rerun');
                        throw new Error('You must login on CortexUI before request for grant access');
                    case 3:
                        console.log(accessGranted['result']['message']);
                        if (!accessGranted['result']['accessGranted']) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.querySessionInfo()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.log('You must accept access request from this app on CortexUI then rerun');
                        throw new Error('You must accept access request from this app on CortexUI');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * - check login and grant access
     * - subscribe for stream
     * - logout data stream to console or file
     */
    Cortex.prototype.sub = function (streams) {
        var _this = this;
        this.socket.on('open', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkGrantAccessAndQuerySessionInfo()];
                    case 1:
                        _a.sent();
                        this.subRequest(streams, this.authToken, this.sessionId);
                        this.socket.on('message', function (data) {
                            // the data is divided into metrics and first socket result
                            if (JSON.parse(data).id !== 6) {
                                var allParams = [];
                                data = JSON.parse(data);
                                var params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'engagement',
                                        SessionID: data.sid,
                                        Value: data.met[1]
                                    }
                                };
                                allParams.push(params);
                                params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'excitement',
                                        SessionID: data.sid,
                                        Value: data.met[3]
                                    }
                                };
                                allParams.push(params);
                                params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'long-term excitement',
                                        SessionID: data.sid,
                                        Value: data.met[4]
                                    }
                                };
                                allParams.push(params);
                                params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'stress',
                                        SessionID: data.sid,
                                        Value: data.met[6]
                                    }
                                };
                                allParams.push(params);
                                params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'relaxation',
                                        SessionID: data.sid,
                                        Value: data.met[8]
                                    }
                                };
                                allParams.push(params);
                                params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'interest',
                                        SessionID: data.sid,
                                        Value: data.met[10]
                                    }
                                };
                                allParams.push(params);
                                params = {
                                    TableName: "Headset_Metrics",
                                    Item: {
                                        PointTimeStamp: data.time,
                                        Metric: 'focus',
                                        SessionID: data.sid,
                                        Value: data.met[12]
                                    }
                                };
                                allParams.forEach(function (item) {
                                    documentClient.put(item, function (err, data) {
                                        if (err) {
                                            console.error('Unable to add item: ', item);
                                            console.error('Error JSON: ', JSON.stringify(err));
                                        }
                                        else {
                                            // @ts-ignore
                                            console.log("Data added to table: ", item.Item);
                                        }
                                    });
                                });
                            }
                            else {
                                console.log(data);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Cortex.prototype.setupProfile = function (authToken, headsetId, profileName, status) {
        var SETUP_PROFILE_ID = 7;
        var setupProfileRequest = {
            "jsonrpc": "2.0",
            "method": "setupProfile",
            "params": {
                "cortexToken": authToken,
                "headset": headsetId,
                "profile": profileName,
                "status": status
            },
            "id": SETUP_PROFILE_ID
        };
        // console.log(setupProfileRequest)
        var socket = this.socket;
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(setupProfileRequest));
            socket.on('message', function (data) {
                if (status === 'create') {
                    resolve(data);
                }
                try {
                    // console.log('inside setup profile', data)
                    if (JSON.parse(data)['id'] === SETUP_PROFILE_ID) {
                        if (JSON.parse(data)['result']['action'] === status) {
                            console.log('SETUP PROFILE -------------------------------------');
                            console.log(data);
                            console.log('\r\n');
                            resolve(data);
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    Cortex.prototype.queryProfileRequest = function (authToken) {
        var QUERY_PROFILE_ID = 9;
        var queryProfileRequest = {
            "jsonrpc": "2.0",
            "method": "queryProfile",
            "params": {
                "cortexToken": authToken
            },
            "id": QUERY_PROFILE_ID
        };
        var socket = this.socket;
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(queryProfileRequest));
            socket.on('message', function (data) {
                try {
                    if (JSON.parse(data)['id'] === QUERY_PROFILE_ID) {
                        // console.log(data)
                        resolve(data);
                    }
                }
                catch (error) {
                    console.log(error);
                    reject();
                }
            });
        });
    };
    /**
     *  - handle send training request
     *  - handle resolve for two difference status : start and accept
     */
    Cortex.prototype.trainRequest = function (authToken, sessionId, action, status) {
        var TRAINING_ID = 8;
        var SUB_REQUEST_ID = 6;
        var trainingRequest = {
            "jsonrpc": "2.0",
            "method": "training",
            "params": {
                "cortexToken": authToken,
                "detection": "mentalCommand",
                "session": sessionId,
                "action": action,
                "status": status
            },
            "id": TRAINING_ID
        };
        // console.log(trainingRequest)
        // each train take 8 seconds for complete
        console.log('YOU HAVE 8 SECONDS FOR THIS TRAIN');
        console.log('\r\n');
        var socket = this.socket;
        return new Promise(function (resolve, reject) {
            socket.send(JSON.stringify(trainingRequest));
            socket.on('message', function (data) {
                // console.log('inside training ', data)
                try {
                    // @ts-ignore
                    if (JSON.parse(data)[id] == TRAINING_ID) {
                        console.log(data);
                    }
                }
                catch (error) {
                }
                // in case status is start training, only resolve until see "MC_Succeeded"
                if (status == 'start') {
                    try {
                        if (JSON.parse(data)['sys'][1] == 'MC_Succeeded') {
                            console.log('START TRAINING RESULT --------------------------------------');
                            console.log(data);
                            console.log('\r\n');
                            resolve(data);
                        }
                    }
                    catch (error) {
                    }
                }
                // in case status is accept training, only resolve until see "MC_Completed"
                if (status == 'accept') {
                    try {
                        if (JSON.parse(data)['sys'][1] == 'MC_Completed') {
                            console.log('ACCEPT TRAINING RESULT --------------------------------------');
                            console.log(data);
                            console.log('\r\n');
                            resolve(data);
                        }
                    }
                    catch (error) {
                    }
                }
            });
        });
    };
    /**
     * - check login and grant access
     * - create profile if not yet exist
     * - load profile
     * - sub stream 'sys' for training
     * - train for actions, each action in number of time
     *
     */
    Cortex.prototype.train = function (profileName, trainingActions, numberOfTrain) {
        var _this = this;
        this.socket.on('open', function () { return __awaiter(_this, void 0, void 0, function () {
            var status, createProfileResult, loadProfileResult, self, _loop_2, _i, trainingActions_1, trainingAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("start training flow");
                        // check login and grant access
                        return [4 /*yield*/, this.checkGrantAccessAndQuerySessionInfo()];
                    case 1:
                        // check login and grant access
                        _a.sent();
                        // to training need subscribe 'sys' stream
                        this.subRequest(['sys'], this.authToken, this.sessionId);
                        status = "create";
                        return [4 /*yield*/, this.setupProfile(this.authToken, this.headsetId, profileName, status).then(function (result) {
                                createProfileResult = result;
                            })];
                    case 2:
                        _a.sent();
                        // load profile
                        status = "load";
                        return [4 /*yield*/, this.setupProfile(this.authToken, this.headsetId, profileName, status).then(function (result) {
                                loadProfileResult = result;
                            })];
                    case 3:
                        _a.sent();
                        self = this;
                        _loop_2 = function (trainingAction) {
                            var numTrain, status_1, saveProfileResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        numTrain = 0;
                                        _a.label = 1;
                                    case 1:
                                        if (!(numTrain < numberOfTrain)) return [3 /*break*/, 5];
                                        // start training for 'neutral' action
                                        console.log("START TRAINING \"" + trainingAction + "\" TIME " + (numTrain + 1) + " ---------------");
                                        console.log('\r\n');
                                        return [4 /*yield*/, self.trainRequest(self.authToken, self.sessionId, trainingAction, 'start')];
                                    case 2:
                                        _a.sent();
                                        //
                                        // FROM HERE USER HAVE 8 SECONDS TO TRAIN SPECIFIC ACTION
                                        //
                                        // accept 'neutral' result
                                        console.log("ACCEPT \"" + trainingAction + "\" TIME " + (numTrain + 1) + " --------------------");
                                        console.log('\r\n');
                                        return [4 /*yield*/, self.trainRequest(self.authToken, self.sessionId, trainingAction, 'accept')];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        numTrain++;
                                        return [3 /*break*/, 1];
                                    case 5:
                                        status_1 = "save";
                                        // save profile after train
                                        return [4 /*yield*/, self.setupProfile(self.authToken, self.headsetId, profileName, status_1)
                                                .then(function (result) {
                                                saveProfileResult = result;
                                                console.log("COMPLETED SAVE " + trainingAction + " FOR " + profileName);
                                            })];
                                    case 6:
                                        // save profile after train
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, trainingActions_1 = trainingActions;
                        _a.label = 4;
                    case 4:
                        if (!(_i < trainingActions_1.length)) return [3 /*break*/, 7];
                        trainingAction = trainingActions_1[_i];
                        return [5 /*yield**/, _loop_2(trainingAction)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     *
     * - load profile which trained before
     * - sub 'com' stream (mental command)
     * - user think specific thing which used while training, for example 'push' action
     * - 'push' command should show up on mental command stream
     */
    Cortex.prototype.live = function (profileName) {
        var _this = this;
        this.socket.on('open', function () { return __awaiter(_this, void 0, void 0, function () {
            var loadProfileResult, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkGrantAccessAndQuerySessionInfo()];
                    case 1:
                        _a.sent();
                        status = "load";
                        return [4 /*yield*/, this.setupProfile(this.authToken, this.headsetId, profileName, status).then(function (result) {
                                loadProfileResult = result;
                            })];
                    case 2:
                        _a.sent();
                        console.log(loadProfileResult);
                        // // sub 'com' stream and view live mode
                        this.subRequest(['com'], this.authToken, this.sessionId);
                        this.socket.on('message', function (data) {
                            console.log(data);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Cortex;
}());
exports.default = Cortex;
//# sourceMappingURL=Cortex.js.map