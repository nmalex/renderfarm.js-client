"use strict";

export interface IWorker {
    Ip: string;
    Port: number;
    Mac: string;
    Endpoint: string;
    Workgroup: string;
    FirstSeen: Date;
    LastSeen: Date;
    CpuUsage: number;
    RamUsage: number;
    TotalRam: number;
}
