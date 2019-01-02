"use strict";

import { Camera as threejsCamera } from "three";
import { ICamera } from "./interface/ICamera";
import { ApiRequest } from "./ApiRequest";

const settings = require("../settings");
const axios = require("axios");

export class Camera implements ICamera {
    private _baseUrl: string;
    private _maxCameraName: string;
    private _threejsCameraObj: threejsCamera;

    private constructor(baseUrl: string, threejsCameraObj: threejsCamera, maxCameraName: string) {
        this._baseUrl = baseUrl;
        this._threejsCameraObj = threejsCameraObj;
        this._maxCameraName = maxCameraName;
    }

    public get MaxCameraName(): string {
        return this._maxCameraName;
    }

    public get ThreejsCameraObj(): threejsCamera {
        return this._threejsCameraObj;
    }

    public Upload(sessionGuid: string): Promise<ICamera> {
        return new ApiRequest<ICamera>(this._baseUrl, this).Post("/camera", {
            camera: this.toJSON()
        });
    }

    // factory method, reads a camera from 3ds max and creates corresponding threejs camera
    public Download(sessionGuid: string): Promise<ICamera> {
        return new ApiRequest<ICamera>(this._baseUrl, this).Get("/camera", this._maxCameraName, {
            session: sessionGuid
        });
    }

    // sends camera changes to 3ds max
    public Update(sessionGuid: string): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    // deletes camera from 3ds max scene
    public Delete(sessionGuid: string): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public toJSON(): any {
        return this._threejsCameraObj.toJSON();
    }
    public Parse(json: any): void {
        //todo: implement json parsing
    }
}
