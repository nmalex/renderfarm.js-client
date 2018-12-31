"use strict";

export interface ISerializable  {
    toJson(): any;
    fromJSON(json: any): void;
}
