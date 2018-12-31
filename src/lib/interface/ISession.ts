"use strict";

const settings = require("../settings");
const axios = require("axios");

export interface ISession {
    SessionGuid: string;
    Open(apiKey: string, workspaceGuid: string): Promise<ISession>;
    KeepAlive(): Promise<ISession>;
    Close(): Promise<ISession>;
}
