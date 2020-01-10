const axios = require('axios');

export default class Job {
    constructor(baseUrl, apiKey) {
        this.baseUrl     = baseUrl;
        this.apiKey      = apiKey;
    }

    async post(sessionGuid, cameraName, width, height) {
        return new Promise(async function(resolve, reject) {
            try {
                var response = await axios.post(this.baseUrl + '/job', {
                    session_guid: sessionGuid,
                    render_width: width, 
                    render_height: height, 
                    progressiveMaxRenderTime: 5.0,
                    progressiveNoiseThreshold: 0.01,
                    camera_json: threejsCameraObj.toJSON().object,
                });
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this));
    }

    async get() {
        return new Promise(async function(resolve, reject) {
            try {
                var response = await axios.get(this.baseUrl + '/job/' + this.data.guid, {});
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this));
    }
}
