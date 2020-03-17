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
var Cortex_1 = require("./classes/Cortex");
// Reads keys from .env file
var dotenv = require('dotenv');
dotenv.config();
// console.log ENVIRONMENT VARIABLES for APIs
console.log('*** EMOTIV\'S API CONFIG DETAILS *** ' +
    '\n\tAPP_NAME: ' + process.env.APP_NAME + '\n\tAPP_ID: ' + process.env.APP_ID +
    '\n*** THE END ***');
// Credentials
var socketUrl = 'wss://localhost:6868';
var user = {
    "license": "BASIC API",
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "debit": 1
};
var c = new Cortex_1.default(user, socketUrl);
var headsetId;
var authToken;
var sessionId;
// Executes this piece of code when websockets server has been opened
c.socket.on('open', function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, init().then(function (r) { return console.log(r); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // get Authtoken
                return [4 /*yield*/, c.authorize()
                        .then(function (response) { return authToken = response.toString(); })];
                case 1:
                    // get Authtoken
                    _a.sent();
                    // get UserInfo, only access with authtoken
                    return [4 /*yield*/, c.getUserInformation(authToken)
                            .then(function (r) {
                            console.log(r);
                            console.log('** CURRENT USER INFORMATION END **');
                        })];
                case 2:
                    // get UserInfo, only access with authtoken
                    _a.sent();
                    // get headset ID
                    return [4 /*yield*/, c.queryHeadsetId()
                            .then(function (response) { return headsetId = response.toString(); })];
                case 3:
                    // get headset ID
                    _a.sent();
                    return [4 /*yield*/, c.createSession(authToken, headsetId)
                            .then(function (r) { return sessionId = r.toString(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=main.js.map