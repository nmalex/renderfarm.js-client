"use strict";

import { Object3D as threejsObject3D } from "three";
import { Camera as threejsCamera } from "three";
import { IObject3D } from "./interface/IObject3D";
import { IScene } from "./interface/IScene";
import { Camera, ICamera } from "./Camera";

const axios = require("axios");

//this is a client to 3ds max scene
class Scene implements IScene {
    private _baseUrl: string;
    private _sessionGuid: string;

    public constructor(baseUrl: string, sessionGuid: string) {
        this._baseUrl = baseUrl;
        this._sessionGuid = sessionGuid;
    }

    public New(): Promise<IScene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Open(maxSceneFilename: string): Promise<IScene> {
        return new Promise(function(resolve, reject) {

            axios.post(`${this._baseUrl}/scene`, {
                session: sessionGuid
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

    public Create(obj: threejsObject3D): Promise<IObject3D<threejsObject3D>> {
        if (obj.type === "Camera") return this.PostCamera(obj as unknown as threejsCamera);
    }

    public Read(maxNodeName: string): Promise<IObject3D<threejsObject3D>> {
        return new Promise<IObject3D<threejsObject3D>>(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    public Update(obj: threejsObject3D): Promise<IObject3D<threejsObject3D>> {
        return new Promise<IObject3D<threejsObject3D>>(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    public Delete(obj: threejsObject3D): Promise<IObject3D<threejsObject3D>> {
        return new Promise<IObject3D<threejsObject3D>>(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    private PostCamera(obj: threejsCamera): Promise<IObject3D<threejsCamera>> {
        return new Promise<IObject3D<threejsCamera>>(function(resolve, reject) {
            var request = new Camera(this._baseUrl, obj).Post(this._sessionGuid);
            request.then(function(camera: IObject3D<threejsCamera>){
                resolve(camera);
            }.bind(this)).catch(function(err){
                reject(err);
            }.bind(this));
            return;
        }.bind(this));
    }
}

export { Scene };