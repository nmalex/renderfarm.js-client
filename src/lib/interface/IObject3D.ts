"use strict";

import { Object3D as threejsObject3D } from "three";
import { ISerializable } from "./ISerializable";

export interface IObject3D<T extends threejsObject3D> extends ISerializable {
    Ref: T; // instance of three.js object in three scene
    Name: string; // name in 3ds max scene

    Post(): Promise<IObject3D<T>>;
    Get(): Promise<IObject3D<T>>;
    Put(): Promise<IObject3D<T>>;
    Delete(): Promise<IObject3D<T>>;
}
