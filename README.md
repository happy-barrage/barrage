# barrage

一个简单的使用 Express 4 的 Node.js 应用。
可以运行在 LeanEngine Node.js 运行时环境。

## 本地运行，开发模式

启动项目的服务：

```
$ avoscloud
```
启动页面：

```
$ cd client
$ gulp
```




## 部署到 LeanEngine

每次部署之前请先到client里面运行

```
$ gulp webpack-s //(stage)
```

部署到测试环境：

```
$ avoscloud deploy -g
```

部署到生产环境：

```
$ cd client
$ gulp webpack-p //production
$ cd ..
$ avoscloud publish
```

## 相关文档

* [LeanEngine 指南](https://leancloud.cn/docs/cloud_code_guide.html)
* [JavaScript 指南](https://leancloud.cn/docs/js_guide.html)
* [JavaScript SDK API](https://leancloud.cn/docs/api/javascript/index.html)
* [命令行工具详解](https://leancloud.cn/docs/cloud_code_commandline.html)
* [LeanEngine FAQ](https://leancloud.cn/docs/cloud_code_faq.html)

