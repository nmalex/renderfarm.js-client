(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Session_1 = require("./Session");
var Client = /** @class */ (function () {
    function Client() {
        this.constructed = true;
    }
    Client.prototype.Connect = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(true);
            }, 1000);
        }.bind(this));
    };
    Client.prototype.Open = function () {
        return new Promise(function (resolve, reject) {
            this.session = new Session_1.Session();
            this.session.Open()
                .then(function (value) {
                console.log("Session opened");
                resolve(true);
            }.bind(this))
                .catch(function (err) {
                console.error("Failed to open session");
                reject();
            }.bind(this));
        }.bind(this));
    };
    return Client;
}());
exports.Client = Client;

},{"./Session":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Session = /** @class */ (function () {
    function Session() {
    }
    Session.prototype.Open = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(true);
            }, 1000);
        }.bind(this));
    };
    return Session;
}());
exports.Session = Session;

},{}],3:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("./Client");
global["RFJS"] = {
    Client: Client_1.Client
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Client":1}]},{},[3]);
