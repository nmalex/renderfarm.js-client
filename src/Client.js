import Session from './Session'
import Scene from './Scene'
import Job from './Job'

export default class Client {
    constructor(config) {
        const protocol = config.protocol ? config.protocol : "https";
        const port     = config.port     ? config.port     :  443;

        this.apiKey = config.apiKey;
        this.baseUrl = protocol + "://" + config.host + ":" + port + "/v1";
        this.session = null;
        this.scene = null;
        this.job = null;
    }

    async openSession(workspaceGuid, sceneFilename) {
        this.session = new Session(this.baseUrl, this.apiKey);
        return this.session.open(workspaceGuid, sceneFilename);
    }

    async createScene(threejsSceneObj, threejsCameraObj) {
        this.scene = new Scene(this.baseUrl, this.apiKey);
        return this.scene.post(this.session.guid, threejsSceneObj, threejsCameraObj);
    }

    async createJob(cameraName, width, height, onStarted, onProgress, onImageReady, onError) {
        this.job = new Job(this.baseUrl, this.apiKey);

        var promise = this.job.post(this.session.guid, cameraName, width, height);
        promise.then(async function(){

            var jobInfo = await this.job.get();
            onStarted && onStarted(jobInfo.data);

            var interval = setInterval(async function(){
                var jobInfo = await this.job.get();
                if (jobInfo.data.state !== 'rendering') {
                    clearInterval(interval);
                    if (jobInfo.data.urls && jobInfo.data.urls.length > 0) {
                        onImageReady && onImageReady(jobInfo.data.urls[0]);
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
