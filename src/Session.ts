"use strict";

const axios = require("axios");

class Session {
    private _sessionGuid: string;

    public get SessionGuid(): string {
        return this._sessionGuid;
    }

    public Open(baseUrl: string, apiKey: string, workspaceGuid: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            if (this._sessionGuid) {
                reject("session already open");
            }

            axios.post(`${baseUrl}/session`, {
                api_key: apiKey, 
                workspace: workspaceGuid
            })
            .then(function (response: any) {
                if (response.data && response.data.guid) {
                    this._sessionGuid = response.data.guid;
                    resolve(response.data);
                } else if (response.data && response.data.error) {
                    reject(response.data.error);
                } else {
                    reject("failed to handle server response");
                }
            }.bind(this))
            .catch(function (err: any) {
                if (err.response && err.response.data && err.response.data.error) {
                    reject(err.response.data.error);
                } else if (err.message) {
                    reject(err.message);
                } else {
                    reject(err);
                }
            }.bind(this)); // end of axios.post promise
        }.bind(this));
    }

    public KeepAlive(): Promise<any> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Close(): Promise<any> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
}

export { Session };