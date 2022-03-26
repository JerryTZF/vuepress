---
sidebar: 'auto'
sidebarDepth: 3
---

# 使用规范

::: tip
规范和一些需要注意的点 :smile:
:::

## 全局

- 无法通过全局变量获取请求参数，`$_GET`、`$_POST`、`$_REQUEST`、`$_SESSION`、`$_COOKIE`、`$_SERVER` 等。
- 容器管理的都是单例，减少了大量无意义的对象创建和销毁；同时，`DI` 管理的实例中不能有随着请求变化而变化的值。因为第一次修改后，第二次读取 
会是修改后的值，这种情况要通过协程上下文存储。比如[示例中间件](/zh/hyperf/middleware/normal.md)中`request`对象添加了`user`对象后
要重新写入上下文中。

---

## 事件机制

- 不要在 `Listener` 中注入 `EventDispatcherInterface` 。 参考：[事件机制](/zh/hyperf/listen/listen.md)
- 最好只在 `Listener` 中注入 `ContainerInterface`

## 请求

- [避免协程间数据混淆](https://hyperf.wiki/2.2/#/zh-cn/controller?id=%e9%81%bf%e5%85%8d%e5%8d%8f%e7%a8%8b%e9%97%b4%e6%95%b0%e6%8d%ae%e6%b7%b7%e6%b7%86)(参考上面 **全局** 第二条)

---


## 规范

- 自定义`监听器`、`进程`、`定时任务`等尽量使用注解进行声明；`Hyperf` 官方组件，尽量在 `config/autoload/xxx.php `中配置。
- 异常处理时，尽量抛出自定义异常，然后通过 `事件` 或者 `异常处理器` 进行集中捕获处理。


---

:::tip
持续施工 :construction:
:::