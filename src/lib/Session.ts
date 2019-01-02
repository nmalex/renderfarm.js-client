"use strict";

import { ISession } from "./interface/ISession";
import { ApiRequest } from "./ApiRequest";
import { ISerializable } from "./interface/ISerializable";
import { IScene } from "./interface/IScene";
import { Scene } from "./Scene";

class Session implements ISession, ISerializable {
    private _sessionGuid: string;
    private _baseUrl: string;
    private _scene: IScene;

    public constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public get Guid(): string {
        return this._sessionGuid;
    }

    public get Scene(): IScene {
        return this._scene;
    }

    public Open(apiKey: string, workspaceGuid: string): Promise<ISession> {
        return new Promise<ISession>(function(resolve, reject){
            let request = new ApiRequest<Session>(this._baseUrl, this).Post("/session", {
                api_key: apiKey,
                workspace: workspaceGuid
            });
            request
            .then(function(session){
                this._scene = new Scene(this._baseUrl);
                resolve(session);
            }.bind(this))
            .catch(function(err){
                reject(err);
            }.bind(this));
        }.bind(this));
    }

    public KeepAlive(): Promise<ISession> {
        return new ApiRequest<Session>(this._baseUrl, this)
            .Put("/session", this._sessionGuid, {});
    }

    public Close(): Promise<ISession> {
        return new ApiRequest<Session>(this._baseUrl, this)
            .Delete("/session", this._sessionGuid);
    }

    public Serialize(): any {
        return {
            guid: this._sessionGuid
        };
    }

    public Deserialize(json: any): void {
        if (!json.guid) {
            throw new Error("can't parse Session json");
        }

        this._sessionGuid = json.guid;
    }
}

export { Session };