"use strict";

export interface ISerializable  {
    //is used to serialize front-end model to be sent to api
    Serialize(): any;

    //is used to deserialize api responses into front-end model
    Deserialize(data: any): void;
}
