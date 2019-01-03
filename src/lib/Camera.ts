"use strict";

import { PerspectiveCamera as threejsPerspectiveCamera } from "three";
import { IObject3D } from "./interface/IObject3D";
import { ApiRequest } from "./ApiRequest";

const lzString = require("lz-string");

export type ICamera = IObject3D<threejsPerspectiveCamera>;

export class Camera implements ICamera {
    private _baseUrl: string;
    private _sessionGuid: string;
    private _maxCameraName: string;
    private _threejsCameraObj: threejsPerspectiveCamera;

    public constructor(baseUrl: string, sessionGuid: string, threejsCameraObj: threejsPerspectiveCamera) {
        this._baseUrl = baseUrl;
        this._sessionGuid = sessionGuid;
        this._threejsCameraObj = threejsCameraObj;
    }

    public get Name(): string {
        return this._maxCameraName;
    }

    public get Ref(): threejsPerspectiveCamera {
        return this._threejsCameraObj;
    }

    public Post(): Promise<ICamera> {
        return new ApiRequest(this._baseUrl, this).Post("/camera", this.Serialize());
    }
    public Get(): Promise<ICamera> {
        throw new Error("Method not implemented.");
    }
    public Put(): Promise<ICamera> {
        throw new Error("Method not implemented.");
    }
    public Delete(): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Serialize(): any {
        this._threejsCameraObj.updateMatrix();
        this._threejsCameraObj.updateMatrixWorld (true);
        this._threejsCameraObj.updateProjectionMatrix();
    
        var cameraJson = this._threejsCameraObj.toJSON();
        var cameraText = JSON.stringify(cameraJson);
        var compressedCameraData = lzString.compressToBase64(cameraText);

        return {
            session: this._sessionGuid,
            camera: compressedCameraData
        };
    }

    public Deserialize(json: any): void {
        this._maxCameraName = json.id;
        this._threejsCameraObj.userData.maxNodeName = json.id;
        //todo: deserialize json.camera into this._threejsCameraObj
    }
}
