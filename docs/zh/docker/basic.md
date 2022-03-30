---
sidebar: 'auto'

---

# Docker

::: warning 【注意】
在使用 `Docker` 前，我们应该知道我们的诉求和痛点是什么，然后去了解 `Docker` 是否可以解决我们的痛点；

---

以我为例：

- `Swoole` 无法跑在 `Windows` 上( 现在可以了:smile: )，但是Docker虚拟化出对应的环境可以解决。
- 多个项目依赖的 `PHP` 版本不一致，并且需要在 `Nginx` 上配置多个虚拟主机。
- 对于不熟悉我的项目的同事要跑起来项目，需要配置很多配置，有时他们只是想看下效果，我需要花费一些时间进行沟通。

---

上面就突出了 `Docker` 的优势：

1. 提供(需要声明)对应的依赖环境，不必再为项目环境而苦恼。
2. 项目间边界清晰，且交付清晰，降低沟通成本。
3. ...
:::

---

## 安装

- [ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [centos](https://docs.docker.com/engine/install/centos/)
- [windows desktop](https://docs.docker.com/desktop/windows/install/)
- [mac desktop](https://docs.docker.com/desktop/mac/install/)
- [docker compose](https://docs.docker.com/compose/install/)

## 换源

- 获取加速地址：前往 => `https://cr.console.aliyun.com/cn-shenzhen/instances/mirrors` => `镜像加速器`
- 编辑配置：编辑(不存在则新建) `/etc/docker/daemon.json` ，添加：

```json
{"registry-mirrors": ["https://xxxxxxx.mirror.aliyuncs.com"]}
```
- 重启：`systemctl daemon-reload` + `systemctl restart docker`


## 镜像


## 容器


## 网络


## 卷


---


::: tip
持续施工 :construction:
:::