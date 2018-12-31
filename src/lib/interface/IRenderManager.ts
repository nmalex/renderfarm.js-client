"use strict";

import { Camera as threejsCamera } from "three";
import { IJob } from "./IJob";

export interface IRenderManager {
    Render(camera: threejsCamera, ): Promise<IJob>;
}
