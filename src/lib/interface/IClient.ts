"use strict";

import { IScene } from "./IScene";
import { ISession } from "./ISession";

export interface IClient {
    Scene: IScene;
    Connect(host: string, port: number): Promise<ISession>;
}
