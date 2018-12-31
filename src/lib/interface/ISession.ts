"use strict";

const settings = require("../settings");
const axios = require("axios");

export interface ISession {
    SessionGuid: string;
    Open(baseUrl: string, apiKey: string, workspaceGuid: string): Promise<any>;
    KeepAlive(): Promise<any>;
    Close(): Promise<any>;
}
