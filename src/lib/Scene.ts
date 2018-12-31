"use strict";

import { IScene } from "./interface/IScene";
import { ICamera } from "./interface/ICamera";

const settings = require("../settings");
const axios = require("axios");

class Scene implements IScene {

    public Create(): Promise<IScene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Open(maxSceneFilename: string): Promise<IScene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
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