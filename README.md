### 资产云前端 SDK

![Release](https://img.shields.io/github/v/release/SwingCosmic/assetcloud-sdk)

[旧版文档](https://gitee.com/assetcloud-hdu/doc-cn/tree/master/app-devlep-flow/sdk/front-end/README.md)

1. 导入和初始化

   导入方式有两种，script标签引入或者npm包引入

   #### script标签引入
   ```html
   <script src="dist/sdk.umd.js"></script>
   <script>
   var ac = new ACSDK.SdkClient();
   ac.init().then(function() {
      console.log("SDK已初始化");
   });
   </script>
   ```
   #### npm包引入（推荐）
   ```javascript
   import SdkClient from "@assetcloud/asset-sdk";
   const ac = new SdkClient();
   await ac.init();
   ```

2. 监听和发送消息

   处理消息有两种方法，添加事件监听器和直接异步发送消息并等待返回结果。
   #### 直接监听事件
   支持处理来自平台主动推送的消息。

   ```javascript
   ac.addEventListener("GET_USER", e => {
     console.log(e.data.data.userId);
   });
   ac.send("GET_USER");
   
   ```
   #### 异步发送消息并返回结果
   返回`Promise`，如果平台返回值的`success`字段为`false`，会自动触发reject。

   ```javascript
   try {
     const res = await ac.sendAsync("GET_USER");
     const { userId } = res.data.data;
   } catch (error) {
     console.error(error.data.msg);
   }
   ```

   返回结果类型

    `AssetCloudEvent<T extends AssetCloudMessage>`

   <table>
    <thead>
      <tr>
        <th colspan=2>字段</th>
        <th>类型</th>
        <th>说明</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan=4>data</td>
        <td>data</td>
        <td><code>AssetCloudMessageMap[T]</code></td>
        <td>承载数据</td>
      </tr>
      <tr>
        <td>code</td>
        <td><code>number</code></td>
        <td>状态码</td>
      </tr>
      <tr>
        <td>success</td>
        <td><code>boolean</code></td>
        <td>是否成功</td>
      </tr>
      <tr>
        <td>msg</td>
        <td><code>string</code></td>
        <td>返回消息</td>
      </tr>
      <tr>
        <td colspan=2>type</td>
        <td><code>T</code></td>
        <td>消息类型</td>
      </tr>
    </tbody>
  </table>



### 前端可用消息

| 功能 | 消息类型 <br />AssetCloudMessage  | 请求参数 | 返回结果中data的格式<br />AssetCloudMessageMap[T] |
| -- | --  | -- | :--: |
| 获取用户 Id           | GET_USER  | 无 | `{ userId: string }` |
| 获取用户账号         | GET_USER_PHONE  | 无 | `{ phone: string }` |
| 获取当前用户所属集团列表            | GET_GROUP | 无 | `{ groupIds: object[] }` |
| 在浏览器打开新的标签页   | OPEN_TAB  | 需要打开的url，<br />如："http://www.baidu.com" | — |
| 跳转到平台首页         | GO_HOME   | 无 | — |
| 获取当前应用入口菜单         | GET_MENU   | 无 | `object` |
