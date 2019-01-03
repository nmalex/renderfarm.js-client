"use strict";

import { Camera as threejsCamera } from "three";
import { IRenderManager } from "./interface/IRenderManager";
import { IJob, JobStatusInfo } from "./interface/IJob";
import { ApiRequest } from "./ApiRequest";
import { Job } from "./Job";

const settings = require("../settings");
const axios = require("axios");

export class RenderManager implements IRenderManager {
    private _baseUrl: string;
    private _sessionGuid: string;

    public constructor(baseUrl: string, sessionGuid: string) {
        this._baseUrl = baseUrl;
        this._sessionGuid = sessionGuid;
    }

    public Render(maxCameraName: string, size: number[], domElement: HTMLDivElement): Promise<IJob> {
        console.log(" >> RENDER: ", maxCameraName, size);
        let target = new Job();
        return new Promise<IJob>(function(resolve, reject){
            new ApiRequest(this._baseUrl, target).Post("/job", {
                session: this._sessionGuid,
                width: size[0],
                height: size[1], 
                camera: maxCameraName
            })
            .then(function(job){
                resolve(job);
            }.bind(this))
            .catch(function(err){
                reject(err);
            }.bind(this))
        }.bind(this));
    }

    public Cancel(jobGuid: string): Promise<any> {
        return new Promise<any>(function(resolve, reject){
            //todo: implement it
            reject();
        }.bind(this));
    }
}
