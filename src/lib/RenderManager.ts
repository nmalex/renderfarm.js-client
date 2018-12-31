"use strict";

import { Camera as threejsCamera } from "three";
import { IRenderManager } from "./interface/IRenderManager";
import { IJob } from "./interface/IJob";

const settings = require("../settings");
const axios = require("axios");

export class RenderManager implements IRenderManager {
    private _baseUrl: string;

    public constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    Render(camera: threejsCamera): Promise<IJob> {
        throw new Error("Method not implemented.");
    }
}
