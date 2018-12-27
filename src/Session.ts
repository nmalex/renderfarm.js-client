"use strict";

class Session {
    public Open():Promise<boolean> {
        return new Promise<boolean>(function(resolve, reject) {
            setTimeout(function(){
                resolve(true);
            }, 1000);
        }.bind(this));
    }
}

export { Session };