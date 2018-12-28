"use strict";

import { Camera as threejsCamera } from "three";

export interface ICamera {
    threejsCameraObj: threejsCamera;
    maxCameraName: string;
    Upload(): Promise<ICamera>;
    Delete(): Promise<ICamera>;
}
