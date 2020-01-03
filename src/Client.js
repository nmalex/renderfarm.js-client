import Session from './Session'
import Scene from './Scene'
import Job from './Job'

export default class Client {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.protocol + "://" + config.host + ":" + config.port + "/v1";
        this.session = null;
    }

    async openSession(workspaceGuid, sceneFilename) {
        this.session = new Session(this.baseUrl, this.apiKey);
        return this.session.open(workspaceGuid, sceneFilename);
    }

    async createScene(threejsSceneObj, threejsCameraObj) {
        var scene = new Scene(this.baseUrl, this.apiKey);
        return scene.post(this.session.guid, threejsSceneObj, threejsCameraObj);
    }

    async createJob(cameraName, width, height, onStarted, onProgress, onImageReady) {
        var job = new Job(this.baseUrl, this.apiKey);
        var promise = job.post(this.session.guid, cameraName, width, height);
        promise.then(function(){
            var job2 = job;
            var interval = setInterval(async function(){
                var jobInfo = await job2.get();
                if (jobInfo.data.state !== 'rendering') {
                    clearInterval(interval);
                    if (jobInfo.data.urls && jobInfo.data.urls.length > 0) {
                        onImageReady(jobInfo.data.urls[0]);
                    }
                }
            }.bind(this), 1000);
        }.bind(this));
        return promise;
    }

    async close() {
        if (this.session) {
            return this.session.close();
        }
    }
}
