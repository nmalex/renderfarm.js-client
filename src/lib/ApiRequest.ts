"use strict";

import { IApiRequest } from "./interface/IApiRequest";
import { ISerializable } from "./interface/ISerializable";
import { IWorker } from "./interface/IWorker";

const settings = require("../settings");
const axios = require("axios");

export class ApiRequest<T extends ISerializable> implements IApiRequest<T> {
    private _baseUrl: string;
    private _target: T | ((baseUrl: string) => T); // target or target factory

    public constructor(baseUrl: string, target: T | ((baseurl: string) => T)) {
        this._baseUrl = baseUrl;
        this._target = target;
    }

    Get(path: string, uid: string, params: any): Promise<T> {
        return new Promise<T>(function(resolve: Function, reject: Function) {
            axios.get(`${this._baseUrl}${path}/${uid}`, { params: params })
                .then(function (response: any) {
                    if (response.data) {
                        resolve(this._target.Parse(response.data));
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

    GetAll(path: string, params: any): Promise<T[]> {
        return new Promise<T[]>(function(resolve: Function, reject: Function) {
            axios.get(`${this._baseUrl}${path}`, { params: params })
                .then(function (response: any) {
                    if (response.data) {
                        let baseUrl = this._baseUrl;
                        let targetCtor = this._target;
                        let targets = response.data.map((d:any) => { 
                            let t = targetCtor(baseUrl);
                            t.Parse(d);
                            return t;
                        });
                        resolve(targets);
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

    Post(path: string, data: any): Promise<T> {
        return new Promise<T>(function(resolve: Function, reject: Function) {
            axios.post(`${this._baseUrl}${path}`, data)
                .then(function (response: any) {
                    if (response.data) {
                        this._target.Parse(response.data);
                        resolve(this._target);
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

    Put(path: string, uid: string, data: any): Promise<T> {
        return new Promise<T>(function(resolve: Function, reject: Function) {
            axios.put(`${this._baseUrl}${path}/${uid}`, data)
                .then(function (response: any) {
                    if (response.data) {
                        resolve(this._target.Parse(response.data));
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

    Delete(path: string, uid: string): Promise<T> {
        return new Promise<T>(function(resolve: Function, reject: Function) {
            axios.delete(`${this._baseUrl}${path}/${uid}`)
                .then(function (response: any) {
                    if (response.data) {
                        resolve(this._target.Parse(response.data));
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
}
