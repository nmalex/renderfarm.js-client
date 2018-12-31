"use strict";

import { ISession } from "./interface/ISession";
import { ApiRequest } from "./ApiRequest";
import { ISerializable } from "./interface/ISerializable";

const settings = require("../settings");
const axios = require("axios");

class Session implements ISession, ISerializable {
    private _sessionGuid: string;
    private _baseUrl: string;

    public constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public get SessionGuid(): string {
        return this._sessionGuid;
    }

    public Open(apiKey: string, workspaceGuid: string): Promise<ISession> {
        return new ApiRequest<Session>(this._baseUrl, this)
            .Post("/session", {
                api_key: apiKey,
                workspace: workspaceGuid
            });
    }

    public KeepAlive(): Promise<ISession> {
        return new Promise(function(resolve, reject) {
            if (!this._sessionGuid) {
                reject("session not open");
            }

            reject(); // todo: implement it
        }.bind(this));
    }

    public Close(): Promise<ISession> {
        return new Promise(function(resolve, reject) {
            if (!this._sessionGuid) {
                reject("session not open");
            }

            reject(); // todo: implement it
        }.bind(this));
    }

    public toJson(): any {
        return {
            guid: this._sessionGuid
        };
    }

    public fromJSON(json: any): void {
        if (!json.guid) {
            throw new Error("can't parse Session json");
        }

        this._sessionGuid = json.guid;
    }
}

export { Session };