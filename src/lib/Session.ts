"use strict";

import { ISession } from "./interface/ISession";
import { ApiRequest } from "./ApiRequest";
import { ISerializable } from "./interface/ISerializable";

class Session implements ISession, ISerializable {
    private _sessionGuid: string;
    private _baseUrl: string;

    public constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public get SessionGuid(): string {
        return this._sessionGuid;
    }

    public Open(apiKey: string, workspaceGuid: string): Promise<ISession> {
        return new ApiRequest<Session>(this._baseUrl, this)
            .Post("/session", {
                api_key: apiKey,
                workspace: workspaceGuid
            });
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