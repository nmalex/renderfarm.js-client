"use strict";

import { IApiRequest } from "./interface/IApiRequest";
import { ISerializable } from "./interface/ISerializable";

const settings = require("../settings");
const axios = require("axios");

export class ApiRequest<T extends ISerializable> implements IApiRequest<T> {
    private _baseUrl: string;
    private _target: T;

    public constructor(baseUrl: string, target: T) {
        this._baseUrl = baseUrl;
        this._target = target;
    }

    Get(path: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
    GetAll(path: string): Promise<T> {
        throw new Error("Method not implemented.");
    }

    Post(path: string, data: any): Promise<T> {
        return new Promise<T>(function(resolve: Function, reject: Function) {
            axios.post(`${this._baseUrl}${path}`, data)
                .then(function (response: any) {
                    if (response.data && response.data.guid) {
                        resolve(this._target.fromJSON(response.data));
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

    Put(path: string, data: any): Promise<T> {
        throw new Error("Method not implemented.");
    }
    Delete(path: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
}
