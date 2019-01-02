"use strict";

import { ICamera } from "../Camera";

export interface IScene {
    Create(sessionGuid: string): Promise<IScene>;
    SaveAs(sessionGuid: string, maxSceneFilename: string): Promise<IScene>;
    Open(sessionGuid: string, maxSceneFilename: string): Promise<IScene>;
    Close(sessionGuid: string): Promise<any>;
}
