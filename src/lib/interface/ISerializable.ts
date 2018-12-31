"use strict";

export interface ISerializable  {
    toJson(): any;
    parse(json: any): void;
}
