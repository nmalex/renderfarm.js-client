"use strict";

import { Camera as threejsCamera } from "three";
import { ICamera } from "./interface/ICamera";

export class Camera implements ICamera {
    private _maxCameraName: string;
    private _threejsCameraObj: threejsCamera;
    public get threejsCameraObj(): threejsCamera {
        return this._threejsCameraObj;
    }
    public get maxCameraName(): string {
        return this._maxCameraName;
    }
    // factory method, takes threejs camera and creates corresponding 3ds max camera in scene
    public static Upload(obj: threejsCamera): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
    // factory method, reads a camera from 3ds max and creates corresponding threejs camera
    public static Download(maxCameraName: string): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
    // sends camera changes to 3ds max
    public Upload(): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
    // deletes camera from 3ds max scene
    public Delete(): Promise<ICamera> {
        return new Promise(function (resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
}
