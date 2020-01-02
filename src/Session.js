const axios = require('axios');

export default class Session {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey  = apiKey;
    }

    async open(workspaceGuid) {
        return new Promise(async function(resolve, reject){
            try {
                var response = await axios.post(this.baseUrl + '/session', {
                    api_key: this.apiKey,
                    workspace_guid: workspaceGuid,
                });
                console.log(` >> session open: `, response);
                this.guid = response.data.data.guid;
                resolve(this);
            } catch (err) {
                reject(err);
            }
        }.bind(this))
    }

    async close() {
        return new Promise(async function(resolve, reject){
            try {
                var response = await axios.delete(this.baseUrl + '/session/' + this.guid, {});
                console.log(` >> session closed: `, response);
                this.guid = null;
                resolve(this);
            } catch (err) {
                reject(err);
            }
        }.bind(this))
    }
}
