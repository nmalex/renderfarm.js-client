"use strict";

import { Camera } from "./Camera";

const axios = require("axios");

class Scene {
    public Open(sceneFilename: string): Promise<Scene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public Close(): Promise<any> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }

    public GetCameras(): Promise<Camera[]> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
}

export { Scene };