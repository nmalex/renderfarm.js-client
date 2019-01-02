"use strict";

import { IScene } from "./IScene";

export interface ISession {
    Guid: string;
    Scene: IScene;

    Open(apiKey: string, workspaceGuid: string): Promise<ISession>;
    KeepAlive(): Promise<ISession>;
    Close(): Promise<ISession>;
}
