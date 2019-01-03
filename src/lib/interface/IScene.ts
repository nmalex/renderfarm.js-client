"use strict";

import { Object3D as threejsObject3D } from "three";
import { IObject3D } from "./IObject3D";

export interface IScene {
    New(): Promise<IScene>;
    SaveAs(maxSceneFilename: string): Promise<IScene>;
    Open(maxSceneFilename: string): Promise<IScene>;
    Close(): Promise<any>;

    Create(obj: threejsObject3D): Promise<IObject3D<threejsObject3D>>;
    Read(maxNodeName: string): Promise<IObject3D<threejsObject3D>>;
    Update(obj: threejsObject3D, maxNodeName: string | undefined): Promise<IObject3D<threejsObject3D>>;
    Delete(obj: threejsObject3D, maxNodeName: string | undefined): Promise<IObject3D<threejsObject3D>>;
}
