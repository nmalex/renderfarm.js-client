const axios = require('axios');

import Scene from './Scene'

export default class Session {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey  = apiKey;
        this.data = null;
    }

    get guid() {
        return this.data ? this.data.guid : null;
    }

    async open(workgroup, workspaceGuid, maxSceneFilename) {
        return new Promise(async function(resolve, reject){
            try {
                var response = await axios.post(this.baseUrl + '/session', {
                    api_key: this.apiKey,
                    workgroup: workgroup,
                    workspace_guid: workspaceGuid,
                    scene_filename: maxSceneFilename,
                });
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this))
    }

    async refresh() {
        return new Promise(async function(resolve, reject){
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
        return new Promise(async function(resolve, reject){
            if (!this.data) {
                reject(new Error("session closed"));
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
