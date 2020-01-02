import Session from './Session'

export default class Client {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.protocol + "://" + config.host + ":" + config.port + "/v1";
        this.session = null;
    }

    async openSession(workspaceGuid) {
        this.session = new Session(this.baseUrl, this.apiKey);
        return this.session.open(workspaceGuid);
    }
}
