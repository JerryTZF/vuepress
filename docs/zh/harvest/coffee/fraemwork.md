---
sidebar: false
prev: /zh/harvest/overview.md

---


# 框架是否真的重要

### 使用框架的原则

> 使用框架，本质上是为了提高开发效率。但是不同的框架侧重是不一致的。
> 
> ① 如果框架支持某些功能，应尽可能使用框架的组件，而不是自己去组织。
> 
> ② 统一的代码结构和风格有助于提升项目的完整度和可读性，因为可能不同的人接手一个项目，如果没有一定的规范，会显得非常凌乱。
> 
> ③ 封装性一定要做好，不然使用框架的优雅便无法体现；例如 [封装库](https://github.com/JerryTZF/hyperf-demo/tree/main/app/Lib)


### 不同框架的迥异

> 对于不同的语言，框架的整体风格是迥异的。基于的不同语言的底层也是不一样的。
> 例如 `Python` 的 `Flask` 是基于 `WSGI模型`。`Golang` 的 `Gin` 是基于标准库的 `net/http`。但是
> 这两种框架，侧重的是 `Web Server` 。也就是说，他们不会包含传统 `Web` 框架中的 `日志`、`数据库(ORM)`、`定时器` 、
> `验证器`、等。
> 
> 常见功能，如果你需要，则需要自己去引用三方包，因为不同的模块，基于的标准是基本一致的。所以，很多时候，你会发现
> 很多项目需要自己维护很多进程，对于进程的启停顺序和监听，也需要自己维护。总而言之，上面的两个框架，是 `小而美` 的体现 ！！！

### hyperf和laravel的区别

> 其实他们在设计上有很多相似的地方，因为一些底层组件是引用的相同的库，但是底层却不一样，`laravel` 是基于 `php-fpm`，`hyperf` 是基于
> `Swoole`，存在着本质区别，没有谁好谁坏，但是我个人认为 `hyperf` 更加新颖，更适合云时代，对于`Docker` 的支持也是更加友好。性能层面也是
> 更加优秀。

---

### 补充

> 对于php传统的 `LNMP` 环境，`laravel` 更加普世，我之前写过一段时间的 `laravel`，但是后面掌握了 `Swoole` 和 `Hyperf` ，我感觉像是
> 突破了php的一些限制，令我是非常开心的。对于公司需要使用 `laravel` 还是 `hyperf`，我都能接受，但是 `TP` 系列的我是不太建议，
> 虽然三者对我都没什么太大难度。如果我是决策者，那么前两者会是我的选择。