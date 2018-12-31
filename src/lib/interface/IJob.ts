"use strict";

export class JobStatusInfo {
    State: string;
    Progress: string;
    Url: string;
}

export interface IJob {
    GetStatus(): Promise<JobStatusInfo>
    Cancel(): Promise<any>;
}
