import axios from 'axios';

export default class Session {
    private baseUrl: string;
    private apiKey: string;
    private data: any;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey  = apiKey;
        this.data = null;
    }

    get guid(): string {
        return this.data ? this.data.guid : null;
    }

    async open(workgroup: string, workspaceGuid: string, maxSceneFilename: string, additonalParams: any) {
        return new Promise(async function(resolve: Function, reject: Function){
            try {
                var response = await axios.post(this.baseUrl + '/session', {
                    api_key: this.apiKey,
                    workgroup: workgroup,
                    workspace_guid: workspaceGuid,
                    scene_filename: maxSceneFilename,
                    //
                    debug: additonalParams && additonalParams.debug,
                });
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this));
    }

    async refresh() {
        return new Promise(async function(resolve: Function, reject: Function){
            if (!this.data) {
                reject(new Error("session closed"));
            }
            try {
                var response = await axios.get(this.baseUrl + '/session/' + this.data.guid, {});
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this))
    }

    async close() {
        return new Promise(async function(resolve: Function, reject: Function){
            if (!this.data) {
                reject(new Error("session closed"));
            }
            if (this.data.closed) {
                resolve(this);
            }
            try {
                var response = await axios.delete(this.baseUrl + '/session/' + this.data.guid, {});
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this))
    }
}
