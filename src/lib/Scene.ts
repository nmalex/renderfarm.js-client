"use strict";

import { Object3D as threejsObject3D } from "three";
import { PerspectiveCamera as threejsPerspectiveCamera } from "three";
import { IObject3D } from "./interface/IObject3D";
import { IScene } from "./interface/IScene";
import { Camera } from "./Camera";

const axios = require("axios");

//this is a client to 3ds max scene
class Scene implements IScene {
    private _baseUrl: string;
    private _sessionGuid: string;
    private _maxNodeName: string;

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
                session: this._sessionGuid,
                scene_filename: maxSceneFilename,
            })
            .then(function (response: any) {
                if (response.data && response.data.id) {
                    this._sceneRootNode = response.data.id;
                    resolve(this);
                } else if (response.data && response.data.error) {
                    reject(response.data.error);
                } else {
                    console.log(response.data);
                    reject({ message: "failed to handle server response", response: response.data });
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
        if (obj.type === "PerspectiveCamera") return this.PostCamera(obj as unknown as threejsPerspectiveCamera);
    }

    public Read(maxNodeName: string): Promise<IObject3D<threejsObject3D>> {
        return new Promise<IObject3D<threejsObject3D>>(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    public Update(obj: threejsObject3D, maxNodeName: string | undefined): Promise<IObject3D<threejsObject3D>> {
        return new Promise<IObject3D<threejsObject3D>>(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    public Delete(obj: threejsObject3D, maxNodeName: string | undefined): Promise<IObject3D<threejsObject3D>> {
        return new Promise<IObject3D<threejsObject3D>>(function(resolve, reject) {
            reject();
        }.bind(this));
    }

    private PostCamera(obj: threejsPerspectiveCamera): Promise<IObject3D<threejsPerspectiveCamera>> {
    
        return new Promise<IObject3D<threejsPerspectiveCamera>>(function(resolve, reject) {
            new Camera(`${this._baseUrl}/scene/${this._sceneGuid}`, this._sessionGuid, obj).Post()
            .then(function(camera: IObject3D<threejsPerspectiveCamera>){
                resolve(camera);
            }.bind(this)).catch(function(err){
                reject(err);
            }.bind(this));
            return;
        }.bind(this));
    }
}

export { Scene };