"use strict";

import { Object3D as threejsObject3D } from "three";
import { ISerializable } from "./ISerializable";

export interface IObject3D<T extends threejsObject3D> extends ISerializable {
    Ref: T; // instance of three.js object in three scene
    Name: string; // name in 3ds max scene

    Post(sessionGuid: string): Promise<IObject3D<T>>;
    Get(sessionGuid: string): Promise<IObject3D<T>>;
    Put(sessionGuid: string): Promise<IObject3D<T>>;
    Delete(sessionGuid: string): Promise<IObject3D<T>>;
}
