"use strict";

import { Camera as threejsCamera } from "three";
import { IJob } from "./IJob";

export interface IRenderManager {
    Render(sessionGuid: string, camera: threejsCamera, ): Promise<IJob>;
    Cancel(jobGuid: string): Promise<any>;
}
