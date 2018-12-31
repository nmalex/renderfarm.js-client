"use strict";

import { ISerializable } from "./ISerializable";

export interface IApiRequest<T extends ISerializable>  {
    Get(path: string, uid: string, params: any): Promise<T>;
    GetAll(path: string, params: any): Promise<T[]>;
    Post(path: string, data: any): Promise<T>;
    Put(path: string, uid: string, data: any): Promise<T>;
    Delete(path: string, uid: string): Promise<T>;
}
