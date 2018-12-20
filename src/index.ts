"use strict";

export class Client {
    public Connect():Promise<boolean> {
        return new Promise<boolean>(function(resolve, reject) {
            setTimeout(function(){
                resolve(true);
            }, 1000);
        }.bind(this));
    }
}
