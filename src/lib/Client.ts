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
    private _session: ISession;
    private _apiKey: string;
    private _workspaceGuid: string;
    private _baseUrl: string;

    public constructor(apiKey: string, workspaceGuid: string) {
        this._apiKey = apiKey;
        this._workspaceGuid = workspaceGuid;
    }

    public get BaseUrl(): string {
        return this._baseUrl;
    }

    public get Session(): ISession {
        return this._session;
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
        return new Promise<ISession>(function(resolve, reject){
            this._session.Open(this._apiKey, this._workspaceGuid)
                .then(function(session: ISession){
                    this._scene = new Scene(this._baseUrl, session.Guid);
                    this._renderManager = new RenderManager(this._baseUrl, session.Guid);
                    resolve(session);
                }.bind(this))
                .catch(function(err){
                    reject(err);
                }.bind(this));
        }.bind(this));
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