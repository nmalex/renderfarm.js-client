"use strict";

import { Camera as threejsCamera } from "three";

export interface ICamera {
    ThreejsCameraObj: threejsCamera;
    MaxCameraName: string;

    Update(obj: threejsCamera): Promise<ICamera>;
    Delete(): Promise<ICamera>;
}
