---
sidebar: 'auto'
sidebarDepth: 3
---


# 常用组件

::: warning 【说明】
这里偏向于使用和需要格外注意的点，对于**基础概念**的东西请自行学习理解。:hammer_and_pick: \
对应具体的代码详见：[Hyperf-demo](https://github.com/JerryTZF/hyperf-demo)
:::

## 协程

:mortar_board:  协程并不是一个组件，而是一个概念，Hyperf 官方解释的非常清晰 [协程是什么？](https://hyperf.wiki/2.2/#/zh-cn/coroutine?id=%e5%8d%8f%e7%a8%8b%e6%98%af%e4%bb%80%e4%b9%88%ef%bc%9f)

- [协程常见用法](/zh/hyperf/coroutines/coroutines.md)

## 中间件

- [跨域中间件](/zh/hyperf/middleware/cors.md)
- [验证器中间件](/zh/hyperf/middleware/validator.md)
- [自定义全局中间件](/zh/hyperf/middleware/overload.md)
- [示例中间件](/zh/hyperf/middleware/normal.md)


## 异常处理

- [注册异常处理器](/zh/hyperf/exception/register.md) <sup>必须</sup>
- [验证器异常处理器](/zh/hyperf/exception/validator.md)
- [数据库数据未找到异常处理](/zh/hyperf/exception/data-not-found.md)
- [限流异常处理器](/zh/hyperf/exception/rate-limit.md)
- [HTTP异常处理器](/zh/hyperf/exception/http.md)
- [全局异常处理器](/zh/hyperf/exception/global.md)

## 其他

- [日志配置和封装](/zh/hyperf/log/log.md)
- [事件机制](/zh/hyperf/listen/listen.md) :exclamation: 【重要】
- [定时任务](/zh/hyperf/crontab/crontab.md)
- [自定义进程](/zh/hyperf/process/process.md)
- [异步队列](/zh/hyperf/redis/queue.md)
- [缓存使用](/zh/hyperf/cache/cache.md)
- [文件系统](/zh/hyperf/file/file.md)

---

::: tip
持续施工 :construction:
:::