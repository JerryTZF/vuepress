---
sidebar: 'auto'
sidebarDepth: 3
---

# web常规使用

::: tip 【说明】
这里主要列举我开发(WEB)过程中一些常规的操作，和一些自己封装的组件。\
详细可以参考：[Lib库封装](https://github.com/JerryTZF/hyperf-demo/tree/main/app/Lib)
:::

---

## 图像相关

- [验证码](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Image/Captcha.php)
- [二维码](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Image/Qrcode.php)
- [条形码](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Image/Barcode.php)
- [mime类型转换(图片)](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Controller/DemoController.php#L136)

## AES加/解密

- [AES](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Encrypt/AES.php)

## 分布式锁(Redis版)

- [redis锁](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Lock/RedisLock.php)
- [redis锁示例](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Controller/DemoController.php#L205)
- [sql悲观锁示例](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Controller/DemoController.php#L172)

## Guzzle封装

- [http请求客户端](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Guzzle/RequestClient.php)

## 异地登录

- [异地/其他设备登录](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Middleware/CheckTokenMiddleware.php)

## 辅助函数

- [辅助函数](https://learnku.com/docs/laravel/5.8/helpers/3919#introduction)

---

::: tip
持续施工 :construction:
:::