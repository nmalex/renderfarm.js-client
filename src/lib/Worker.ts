"use strict";

import { IWorker } from "./interface/IWorker";

export class Worker implements IWorker {
    private _baseUrl: string;
    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    public Ip: string;
    public Port: number;
    public Mac: string;
    public Endpoint: string;
    public Workgroup: string;
    public FirstSeen: Date;
    public LastSeen: Date;
    public CpuUsage: number;
    public RamUsage: number;
    public TotalRam: number;

    public toJson() {
        return {};    
    }

    public Parse(json: any): void {
        this.Ip        = json.ip;
        this.Port      = json.port;
        this.Mac       = json.mac;
        this.Endpoint  = json.endpoint;
        this.Workgroup = json.workgroup;
        this.FirstSeen = new Date(json.firstSeen);
        this.LastSeen  = new Date(json.lastSeen);
        this.CpuUsage  = json.cpuUsage;
        this.RamUsage  = json.ramUsage;
        this.TotalRam  = json.totalRam;
    }
}
