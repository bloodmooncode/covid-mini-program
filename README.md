# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


## 开发须知

1. 云函数文件夹命名规则
   1. 小驼峰命名法
   2. 各板块有各自的云函数，有各自前缀
   3. 前缀：
      1. 主入口 mXxxXxx
      2. 信息汇总 iaXxXxx
      3. 心理咨询 pcXxxXxx
      4. 志愿者点赞不需要
      5. 志愿服务 vsXxxXxx
      6. 用餐，物资不需要
2. js 变量命名规则
   1. 驼峰命名法
3. js 方法库文件命名
   1. 短划线命名 abc-efg.js
4. 页面命名
   1. 短划线命名
5. 统一缩进
   1. 统一用 2 space 缩进

## 需要注意
本项目开启了 eslint 和 commit check

如果 项目中有过不了 eslint 的问题，将无法 commit ！

尽量使用 vscode / webstorm 等强 ide 去开发，使用微信开发者工具预览。

如有提交失败问题无法确定，随时联系 王炳楠。
