"use strict";

import { IJob } from "./IJob";

export interface IRenderManager {
    Render(maxCameraName: string, size: number[], domElement: HTMLDivElement): Promise<IJob>;
    Cancel(jobGuid: string): Promise<any>;
}
