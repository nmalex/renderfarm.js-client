"use strict";

export interface ISerializable  {
    //toJSON is used to serialize front-end model to be sent to api
    toJSON(): any;

    //parse is used to deserialize api responses into front-end model
    Parse(json: any): void;
}
