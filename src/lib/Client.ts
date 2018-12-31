import { IClient } from "./interface/IClient";
import { ISession } from "./interface/ISession";
import { IScene } from "./interface/IScene";
import { Session } from "./Session";
import { Scene } from "./Scene";
import { IRenderManager } from "./interface/IRenderManager";
import { RenderManager } from "./RenderManager";

const settings = require("../settings");
const axios = require("axios");

class Client implements IClient {
    private _session: Session;
    private _apiKey: string;
    private _workspaceGuid: string;
    private _baseUrl: string;
    private _scene: Scene;
    private _renderManager: RenderManager;

    public constructor(apiKey: string, workspaceGuid: string) {
        this._apiKey = apiKey;
        this._workspaceGuid = workspaceGuid;
    }

    public get BaseUrl(): string {
        return this._baseUrl;
    }

    public get Scene(): IScene {
        return this._scene;
    }

    public get Session(): ISession {
        return this._session;
    }

    public get RenderManager(): IRenderManager {
        return this._renderManager;
    }

    public Connect(host: string, port: number): Promise<ISession> {
        if (port && port !== 443) {
            this._baseUrl = `https://${host}:${port}/v${settings.apiVersion}`;
        } else {
            this._baseUrl = `https://${host}/v${settings.apiVersion}`;
        }

        this._session = new Session(this._baseUrl);
        this._scene = new Scene(this._baseUrl);
        this._renderManager = new RenderManager(this._baseUrl);
        return this._session.Open(this._apiKey, this._workspaceGuid);
    }
}

export { Client }