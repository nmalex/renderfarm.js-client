import axios from 'axios';
import { IConvertSettings, IRenderSettings } from './interfaces';

export default class Job {
    private baseUrl: string;
    private apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl     = baseUrl;
        this.apiKey      = apiKey;
    }

    async post(sessionGuid: string, threejsCameraObj: any, renderSettings: IRenderSettings, vraySettings) {
        return new Promise(async function(resolve, reject) {
            try {
                const cameraJson = threejsCameraObj.toJSON().object;
                if (!cameraJson.name) {
                    // if user did not care to set camera name, we still need some
                    cameraJson.name = "Camera001";
                }

                var response = await axios.post(this.baseUrl + '/job', {
                    session_guid: sessionGuid,
                    job_type: "render",
                    render_width: renderSettings.width,
                    render_height: renderSettings.height,
                    alpha: renderSettings.alpha,
                    camera_json: cameraJson,
                    render_settings: vraySettings || {
                        // use it to pass direct vray settings
                    }
                }, {
                    timeout: 15*60*1000, // 15min timeout
                });
                this.data = response.data.data;
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this));
    }

    async postConvert(sessionGuid: string, fileUrl: string, convertSettings: IConvertSettings) {
        return new Promise(async function(resolve, reject) {
            try {
                var response = await axios.post(this.baseUrl + '/job/convert', {
                    session_guid: sessionGuid,
                    job_type: "convert",
                    input_url: fileUrl,
                    settings: convertSettings || {
                        // use this to pass extra settings to converter logic
                    }
                }, {
                    timeout: 15*60*1000, // 15min timeout
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
        return new Promise(async function(resolve: Function, reject: Function) {
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
