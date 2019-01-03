import { ISerializable } from "./interface/ISerializable";
import { IJob, JobStatusInfo } from "./interface/IJob";

export class Job implements IJob, ISerializable {
    GetStatus(): Promise<JobStatusInfo> {
        throw new Error("Method not implemented.");
    }
    Cancel(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    Serialize(): any {
        return {

        }
    }    
    Deserialize(json: any): void {
        //todo: deserialize json
        console.log(json);
    }
}