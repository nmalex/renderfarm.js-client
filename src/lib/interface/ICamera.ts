"use strict";

import { Camera as threejsCamera } from "three";
import { ISerializable } from "./ISerializable";

export interface ICamera extends ISerializable {
    ThreejsCameraObj: threejsCamera;
    MaxCameraName: string;

    Upload(sessionGuid: string): Promise<ICamera>;
    Download(sessionGuid: string): Promise<ICamera>;
    Update(sessionGuid: string, obj: threejsCamera): Promise<ICamera>;
    Delete(sessionGuid: string): Promise<ICamera>;
}
