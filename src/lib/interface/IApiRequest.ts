"use strict";

import { ISerializable } from "./ISerializable";

export interface IApiRequest<T extends ISerializable>  {
    Get(path: string): Promise<T>;
    GetAll(path: string): Promise<T>;
    Post(path: string, data: any): Promise<T>;
    Put(path: string, data: any): Promise<T>;
    Delete(path: string): Promise<T>;
}
