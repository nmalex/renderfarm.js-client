import { Session } from "./Session";

const axios = require("axios");

const apiVersion = 1;

class Client {
    private session: Session;
    private apiKey: string;
    private workspace: string;
    private baseUrl: string;

    public constructor(apiKey: string, workspace: string) {
        this.apiKey = apiKey;
        this.workspace = workspace;
    }

    public Connect(host: string, port: number): Promise<any> {
        if (port) {
            this.baseUrl = `https://${host}:${port}/v${apiVersion}`;
        } else {
            this.baseUrl = `https://${host}/v${apiVersion}`;
        }

        return new Promise(function(resolve, reject) {
            axios.post(`${this.baseUrl}/session`, {
                api_key: this.apiKey, 
                workspace: this.workspace
            }).then(function (response) {
                if (!response || response.status !== 200) {
                    reject(); //todo: provide error
                    return;
                }

                if (response.data && response.data.id) { //todo: be consistent, return guid
                    resolve(true); //todo: provide some success object
                } else {
                    console.log(response.data);
                    reject(response.data);
                }
            }).catch(function (error) { //todo: streamline how error is returned from api
                console.log(" >> here: ", error);
                reject(error);
            }); // end of axios.post promise

        }.bind(this));
    }
}

export { Client }