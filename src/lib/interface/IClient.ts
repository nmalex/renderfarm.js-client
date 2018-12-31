"use strict";

import { IScene } from "./IScene";
import { ISession } from "./ISession";
import { IWorker } from "./IWorker";

export interface IClient {
    BaseUrl: string;
    Session: ISession;
    Scene: IScene;
    Connect(host: string, port: number): Promise<ISession>;
    GetWorkers(host: string, port: number): Promise<IWorker[]>;
}
