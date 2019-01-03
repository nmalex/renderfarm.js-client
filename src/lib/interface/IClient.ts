"use strict";

import { IScene } from "./IScene";
import { ISession } from "./ISession";
import { IWorker } from "./IWorker";

export interface IClient {
    BaseUrl: string;
    Session: ISession;
    Connect(host: string, port: number): Promise<ISession>;
    GetWorkers(host: string, port: number): Promise<IWorker[]>;
}
