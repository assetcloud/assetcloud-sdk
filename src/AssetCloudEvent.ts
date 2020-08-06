import { AssetCloudMessage, AssetCloudMessageMap } from "./types/message";
import { AssetCloudResponse } from './types/response';

/**
 * 资产云消息事件对象
 */
export class AssetCloudEvent<T extends AssetCloudMessage | "error"> extends Event {
    readonly type!: T;
    readonly data: T extends "error" ? { msg: string, data: any, originType: AssetCloudMessage } 
        : T extends AssetCloudMessage ? AssetCloudResponse<T> : never;
    
    constructor(type: T, data: AssetCloudEvent<T>["data"]) {
        super(type);
        this.data = data;
    }
}
