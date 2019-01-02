"use strict";

import { Camera as threejsCamera } from "three";
import { IObject3D } from "./interface/IObject3D";
import { ApiRequest } from "./ApiRequest";

const settings = require("../settings");
const axios = require("axios");

export type ICamera = IObject3D<threejsCamera>;

export class Camera implements ICamera {
    private _baseUrl: string;
    private _maxCameraName: string;
    private _threejsCameraObj: threejsCamera;

    private constructor(baseUrl: string, threejsCameraObj: threejsCamera, maxCameraName: string) {
        this._baseUrl = baseUrl;
        this._threejsCameraObj = threejsCameraObj;
        this._maxCameraName = maxCameraName;
    }

    public get Name(): string {
        return this._maxCameraName;
    }

    public get Ref(): threejsCamera {
        return this._threejsCameraObj;
    }

    public Post(sessionGuid: string): Promise<ICamera> {
        throw new Error("Method not implemented.");
    }
    public Get(sessionGuid: string): Promise<ICamera> {
        throw new Error("Method not implemented.");
    }
    public Put(sessionGuid: string): Promise<ICamera> {
        throw new Error("Method not implemented.");
    }
    public Delete(sessionGuid: string): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Serialize(): any {
        return {

        };
    }
    public Deserialize(json: any): void {
        //todo: implement json parsing
    }
}
