"use strict";

const settings = require("../settings");
const axios = require("axios");

export interface ISession {
    SessionGuid: string;
    KeepAlive(): Promise<ISession>;
    Close(): Promise<ISession>;
}
