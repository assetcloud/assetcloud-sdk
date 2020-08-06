export interface AssetCloudRequestBase<T> {
    data: any,
    from: string,
    to: "*",
    type: T,
    checkCode: string,
    verifyCode: string,
}

export interface AssetCloudRequest<T> extends AssetCloudRequestBase<T> {
    appId: string;
}