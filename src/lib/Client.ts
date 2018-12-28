import { Session } from "./Session";
import { Scene } from "./Scene";

const settings = require("../settings");
const axios = require("axios");

class Client {
    private session: Session;
    private apiKey: string;
    private workspaceGuid: string;
    private baseUrl: string;

    public constructor(apiKey: string, workspaceGuid: string) {
        this.apiKey = apiKey;
        this.workspaceGuid = workspaceGuid;
    }

    public Connect(host: string, port: number): Promise<Session> {
        if (port) {
            this.baseUrl = `https://${host}:${port}/v${settings.apiVersion}`;
        } else {
            this.baseUrl = `https://${host}/v${settings.apiVersion}`;
        }

        this.session = new Session();
        return this.session.Open(this.baseUrl, this.apiKey, this.workspaceGuid);
    }

    public OpenScene(): Promise<Scene> {
        return new Promise(function(resolve, reject) {
            reject(); // todo: implement it
        }.bind(this));
    }
}

export { Client }