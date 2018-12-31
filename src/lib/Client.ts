import { IClient } from "./interface/IClient";
import { ISession } from "./interface/ISession";
import { IScene } from "./interface/IScene";
import { Session } from "./Session";
import { Scene } from "./Scene";
import { IRenderManager } from "./interface/IRenderManager";
import { RenderManager } from "./RenderManager";
import { ApiRequest } from "./ApiRequest";
import { Worker } from "./Worker";
import { IWorker } from "./interface/IWorker";

const settings = require("../settings");

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

    private MakeBaseUrl(host: string, port: number): string {
        if (port && port !== 443) {
            return `https://${host}:${port}/v${settings.apiVersion}`;
        } else {
            return `https://${host}/v${settings.apiVersion}`;
        }
    }

    public Connect(host: string, port: number): Promise<ISession> {
        this._baseUrl = this.MakeBaseUrl(host, port);
        this._session = new Session(this._baseUrl);
        this._scene = new Scene(this._baseUrl);
        this._renderManager = new RenderManager(this._baseUrl);
        return this._session.Open(this._apiKey, this._workspaceGuid);
    }

    public GetWorkers(host: string, port: number): Promise<IWorker[]> {
        return new ApiRequest<Worker>(
            this.MakeBaseUrl(host, port), 
            function(baseUrl: string) {
                return new Worker(baseUrl);
            }).GetAll("/worker", {
                api_key: this._apiKey
            });
    }
}

export { Client }