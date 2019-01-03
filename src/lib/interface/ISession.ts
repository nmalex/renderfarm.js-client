"use strict";

import { IScene } from "./IScene";
import { IRenderManager } from "./IRenderManager";

export interface ISession {
    Guid: string;
    Scene: IScene;
    RenderManager: IRenderManager;

    Open(apiKey: string, workspaceGuid: string): Promise<ISession>;
    KeepAlive(): Promise<ISession>;
    Close(): Promise<ISession>;
}
