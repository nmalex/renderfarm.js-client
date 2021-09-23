import Session from './Session'
import Scene from './Scene'
import Job from './Job'
import { ICallbacks, IConfig, IConvertSettings, IRenderSettings, IVraySettings } from './interfaces';

export default class Client {
    private apiKey: string;
    private baseUrl: string;
    private session: Session;
    private scene: Scene;
    private job: Job;
    private autoCloseSession: boolean;

    constructor(config: IConfig) {
        const protocol = config.protocol ? config.protocol : "https";
        const port = config.port ? config.port : 443;

        this.apiKey = config.apiKey;
        this.baseUrl = protocol + "://" + config.host + ":" + port + "/v1";
        this.session = null;
        this.scene = null;
        this.job = null;

        this.autoCloseSession = true; // close session once job is done
    }

    async openSession(workgroup: string, workspaceGuid: string, sceneFilename: string, additionalParams: any) {
        this.session = new Session(this.baseUrl, this.apiKey);
        return this.session.open(workgroup, workspaceGuid, sceneFilename, additionalParams);
    }

    async createScene(threejsSceneObj: any, threejsCameraObj: any) {
        this.scene = new Scene(this.baseUrl, this.apiKey);
        return this.scene.post(this.session.guid, threejsSceneObj, threejsCameraObj);
    }

    async createJob(threejsCameraObj: any, renderSettings: IRenderSettings, vraySettings: IVraySettings, callbacks: ICallbacks) {
        this.job = new Job(this.baseUrl, this.apiKey);

        var promise = this.job.post(this.session.guid, threejsCameraObj, renderSettings, vraySettings);
        promise.then(async function () {

            var jobInfo = await this.job.get();
            callbacks && callbacks.onStarted && callbacks.onStarted(jobInfo.data);

            var interval = setInterval(async function () {
                var jobInfo = await this.job.get();
                if (jobInfo.data.state !== 'rendering' && jobInfo.data.state !== 'pending') {
                    clearInterval(interval);
                    if (this.autoCloseSession) {
                        this.session.close(); // auto close session
                    }
                    if (jobInfo.data.urls && jobInfo.data.urls.length > 0) {
                        callbacks && callbacks.onImageReady && callbacks.onImageReady(jobInfo.data.urls[0]);
                    } else {
                        callbacks && callbacks.onError && callbacks.onError(jobInfo.data);
                    }
                } else {
                    callbacks && callbacks.onProgress && callbacks.onProgress(jobInfo.data);
                }
            }.bind(this), 1250); // check job state interval

        }.bind(this));

        return promise;
    }

    async createJobConvert(fileUrl: string, convertSettings: IConvertSettings, onStarted: Function, onProgress: Function, onResultReady: Function, onImageReady: Function, onError: Function) {
        this.job = new Job(this.baseUrl, this.apiKey);

        var promise = this.job.postConvert(this.session.guid, fileUrl, convertSettings);
        promise.then(async function () {

            var jobInfo = await this.job.get();
            onStarted && onStarted(jobInfo.data);

            var interval = setInterval(async function () {
                var jobInfo = await this.job.get();
                if (jobInfo.data.state !== 'processing' && jobInfo.data.state !== 'pending') {
                    clearInterval(interval);
                    if (jobInfo.data.urls && jobInfo.data.urls.length > 0) {
                        onImageReady && onResultReady(jobInfo.data.urls[0]);
                    } else {
                        onError && onError(jobInfo.data);
                    }
                } else {
                    onProgress && onProgress(jobInfo.data);
                }
            }.bind(this), 1250); // check job state interval

        }.bind(this));

        return promise;
    }

    async close() {
        if (!this.session) {
            return Promise.resolve();
        }

        return this.session.close();
    }
}
function setInterval(arg0: any, arg1: number) {
    throw new Error('Function not implemented.');
}

function clearInterval(interval: void) {
    throw new Error('Function not implemented.');
}

