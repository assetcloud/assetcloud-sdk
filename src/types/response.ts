import { AssetCloudMessage, AssetCloudMessageMap } from './message';

type AssetCloudResponseBody<T extends AssetCloudMessage, R> = {
    code: number,
    success: boolean,
    type: T,
    msg: string,
    data: R
};

/** 
 * 资产云前端消息响应 
 * @template T 资产云前端消息
 * @template D 若消息没有响应体，返回的值，默认为{}
 */
export type AssetCloudResponse<T extends AssetCloudMessage, D = {}> = {
    [M in AssetCloudMessage]: AssetCloudResponseBody<M,
        M extends (keyof AssetCloudMessageMap)
        ? AssetCloudMessageMap[M]
        : D
    >
}[T];
