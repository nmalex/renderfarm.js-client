"use strict";

import { ICamera } from "./ICamera";

export interface IScene {
    Create(): Promise<IScene>;
    SaveAs(maxSceneFilename: string): Promise<IScene>;
    Open(maxSceneFilename: string): Promise<IScene>;
    Close(): Promise<any>;
    GetCameras(): Promise<ICamera[]>;
}
