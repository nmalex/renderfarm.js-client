import { Session } from "./Session";

const settings = require("./settings");
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

    public Connect(host: string, port: number): Promise<any> {
        if (port) {
            this.baseUrl = `https://${host}:${port}/v${settings.apiVersion}`;
        } else {
            this.baseUrl = `https://${host}/v${settings.apiVersion}`;
        }

        this.session = new Session();
        return this.session.Open(this.baseUrl, this.apiKey, this.workspaceGuid);
    }

    public OpenScene(sceneFilename: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            axios.post(`${this.baseUrl}/session`, {
                scene_filename: sceneFilename,
                session: this.session
            }).then(function (response: any) {
                if (response.data && response.data.gid) {
                    this.session = response.data.gid;
                    resolve(response.data);
                } else if (response.data && response.data.error) {
                    reject(response.data.error);
                } else {
                    reject("failed to handle server response");
                }
            }).catch(function (err: any) {
                if (err.message) {
                    reject(err);
                    return;
                } else if (err.response && err.response.data && err.response.error) {
                    reject(err.response.error);
                } else {
                    reject(err);
                }
            }); // end of axios.post promise

        }.bind(this));
    }
}

export { Client }