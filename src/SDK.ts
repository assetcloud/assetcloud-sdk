import EventEmitter, { EventListener as Listener } from "./EventEmitter";
import { AssetCloudMessage, AssetCloudMessageMap } from "./types/message";
import { AssetCloudEvent } from './AssetCloudEvent';
import { AssetCloudRequest, AssetCloudRequestBase } from './types/request';

type AssetCloudMessageEventMap = {
    [K in AssetCloudMessage | "error"]: Listener<AssetCloudEvent<K>>;
};

/** 资产云SDK客户端类 */
export default class SdkClient implements EventTarget {

    readonly baseUrl: string;
    private messageQueue: {
        type: AssetCloudMessage,
        checkCode: string,
        resolve?: (value: AssetCloudEvent<AssetCloudMessage>) => void;
        reject?: (value: AssetCloudEvent<"error">) => void;
    }[] = [];

    private appId: string | null = null;
    private eventEmitter = new EventEmitter<AssetCloudMessageEventMap>();



    /** 创建新SDK客户端实例 */
    constructor() {
        this.baseUrl = `${window.location.origin}${window.location.pathname}`;
    }


    //#region 接口实现
    addEventListener(type: AssetCloudMessage | "error", listener: EventListener) {
        this.eventEmitter.addEventListener(type, listener);
    }
    dispatchEvent<T extends AssetCloudMessage | "error">(event: AssetCloudEvent<T>) {
        return this.eventEmitter.dispatchEvent(event as any);
    }
    removeEventListener(type: AssetCloudMessage | "error", callback: EventListener) {
        this.eventEmitter.removeEventListener(type, callback);
    }
    //#endregion

    /** 初始化SDK客户端 */
    async init() {
        window.addEventListener("message", this.handleMessage);
        return this.sendAsync("APP_INIT", this.baseUrl);
    }

    /** 销毁SDK客户端，销毁后可重新初始化 */
    destroy() {
        this.eventEmitter.clearListeners();
        window.removeEventListener("message", this.handleMessage);
        this.appId = null;
        this.messageQueue = [];
    }

    /**
     * 向平台发送消息并以事件的形式接收
     * @param type 要发送的消息类型
     * @param data [可选]请求参数
     */
    send(type: AssetCloudMessage, data?: any) {
        if (type != "APP_INIT" && !this.appId) {
            this.dispatchEvent(new AssetCloudEvent("error", {
                data: null,
                msg: "初始化未完成！",
                originType: type
            }));
            return;
        }
        this.nativePostMessage({ type, data });
    }

    /**
     * 向平台发送消息并返回Promise
     * @param type 要发送的消息类型
     * @param data [可选]请求参数
     * @returns 一个Promise，包含消息响应的内容
     */
    sendAsync<T extends AssetCloudMessage>(type: T, data?: any): Promise<AssetCloudEvent<T>> {
        return new Promise((resolve, reject) => {
            if (type != "APP_INIT" && !this.appId) {
                reject(new AssetCloudEvent("error", {
                    data: null,
                    msg: "初始化未完成！",
                    originType: type
                }));
            }
            this.nativePostMessage({ type, data }, resolve, reject);
        });
    }

    private nativePostMessage<T extends AssetCloudMessage>(msg: { type: T, data: any },
        resolve?: (value: AssetCloudEvent<T>) => void,
        reject?: (value: AssetCloudEvent<"error">) => void) {
        const message = {
            data: msg.data,
            from: this.baseUrl,
            appId: this.appId,
            to: "*",
            type: msg.type,
            checkCode: "r" + new Date().getTime() + "_" + ~~(Math.random() * 100),
            verifyCode: "",
        };
        this.messageQueue.push({
            type: message.type,
            checkCode: message.checkCode,
            resolve,
            reject
        })
        window.top.postMessage(message, "*");
    }


    private handleMessage = (e: MessageEvent) => {
        if (e.data && e.data.from === "HOST") {
            //处理平台返回的数据
            const { type, data, success, code, msg, checkCode } = e.data; //来自平台的数据
            let event:  AssetCloudEvent<any>;
            while (true) {
                if (e.data.type === "APP_INIT") {
                    if (e.data.success) {
                        this.appId = e.data.data;
                    } else {
                        event = new AssetCloudEvent("error", {
                            data,
                            msg: "初始化失败！" + e.data.msg,
                            originType: type
                        });
                        break;
                    }
                }
                event = new AssetCloudEvent(type, { data, success, code, msg });
                break;
            }
            
            const item = this.messageQueue.filter(q => q.checkCode == checkCode)[0];
            if (item) {
                this.messageQueue.splice(this.messageQueue.indexOf(item), 1);             
                if (item.resolve && item.reject) {
                     event.data.success ? item.resolve(event) : item.reject(event);  
                } else {
                    this.dispatchEvent(event);
                }
            } else {
                console.warn(`ACSDK: 未在消息队列中找到当前消息 { type = ${type}, checkCode = ${checkCode} }`);
                this.dispatchEvent(event);
            }
            
        }
    }

}