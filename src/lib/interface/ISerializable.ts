"use strict";

export interface ISerializable  {
    toJson(): any;
    Parse(json: any): void;
}
