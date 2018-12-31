"use strict";

import { IScene } from "./interface/IScene";
import { ICamera } from "./interface/ICamera";

const settings = require("../settings");
const axios = require("axios");

class Scene implements IScene {
    private _baseUrl: string;

    public constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public Create(): Promise<IScene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Open(maxSceneFilename: string): Promise<IScene> {
        return new Promise(function(resolve, reject) {

            axios.post(`${this._baseUrl}/scene`, {
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

    public SaveAs(maxSceneFilename: string): Promise<IScene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Close(): Promise<any> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public GetCameras(): Promise<ICamera[]> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
}

export { Scene };