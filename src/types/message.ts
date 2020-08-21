/** 资产云前端消息 */
export type AssetCloudMessage =
    /** 初始化 */
    "APP_INIT" |
    /** 获取当前用户ID */
    "GET_USER" |
    /** 获取当前用户手机号 */
    "GET_USER_PHONE" |
    /** 打开新标签页 */
    "OPEN_TAB" |
    /** 跳转至首页 */
    "GO_HOME" |
    /** 获取当前用户所属集团ID列表 */
    "GET_GROUP" |
    /** 获取入口菜单 */
    "GET_MENU"
    ;

/** 针对每一种消息，分别定义返回数据的类型 */
export interface AssetCloudMessageMap {
    "APP_INIT": string;
    "GET_USER": {
        /** 用户ID */
        userId: string
    };
    "GET_USER_PHONE": {
        /** 用户手机号 */
        phone: string
    };
    "GET_GROUP": {
        /** 当前用户所属集团列表 */
        groupIds: {
            id: string;
            groupName: string;
            groupCode: string;
            type: number;
            [key: string]: any;
        }[]
    };
    "GET_MENU": {
        [key: string]: any;
    }
    
}

