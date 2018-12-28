import { Session } from "./Session";

class Client {
    private session: Session;
    public constructed: boolean;
    public constructor() {
        this.constructed = true;
    }
    public Connect(): Promise<boolean> {
        return new Promise<boolean>(function (resolve, reject) {
            setTimeout(function () {
                resolve(true);
            }, 1000);
        }.bind(this));
    }
    public Open(): Promise<boolean> {
        return new Promise<boolean>(function (resolve, reject) {
            this.session = new Session();
            this.session.Open()
                .then(function (value) {
                    console.log("Session opened");
                    resolve(true);
                }.bind(this))
                .catch(function (err) {
                    console.error("Failed to open session");
                    reject();
                }.bind(this));
        }.bind(this));
    }
}

export { Client }