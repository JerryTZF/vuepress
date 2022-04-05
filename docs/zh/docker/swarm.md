---
sidebar: 'auto'
sidebarDepth: 3
---

# docker swarm

::: tip 为什么使用 Docker Swarm
我们公司之前从 `PHP-FPM` 演变到 `Hyperf(Swoole)` ，当实现CLI后，大量的应用需要部署，并且新老项目PHP版本和定时任务 `Crontab`
不再适合，我提出使用 `编排容器` 来解决上面的问题，但是随着业务的量起来后，4核8G的机器经常会出现告警，后续思考上集群。因为后面一直
用的是Docker，又因为K8S有些重(后面也是两台机器而已)，所以最终选型 `Docker Swarm`。
:::

---

## 1、docker swarm 是什么

`Docker` 原生支持的容器集群管理工具，它可以把多个 `Docker` 主机组成的系统转换为单一的虚拟 `Docker` 主机，使得容器可以组
成***跨主机***的子网网络。通过执行命令与单一的主 `Swarm` 进行沟通，而不必分别和每个 `Docker Engine` 沟通。在灵活的调度策略下，
团队可以更好地管理可用的主机资源，保证应用容器的高效运行。

## 2、docker swarm 优势

- 动态扩容，可以动态的将各个服务运行至对应的机器。 (`replicated` 、 `global`)
- 集群服务支持动态路由，由 `ingress routing mesh` 支持。
- 支持动态扩容缩容，以及节点不可用时的动态发现和舍弃。

## 3、集群构建

::: tip
这里以一台阿里云、两台腾讯云为例，
Ps:正常来说，集群搭建应该是一个机房或者一个局域网内机器搭建，这里以两台公网机器搭建，顺便还要搭建自己的VPN，这里我使用的是 [zerotier](https://my.zerotier.com/network/e5cd7a9e1c096a33)
:sunglasses:

这里的`ECS`的安全组需要打开一些端口。

![](http://img.tzf-foryou.com/img/20220405225239.png)

![](http://img.tzf-foryou.com/img/20220405225409.png)

端口解释：\
`4789`：端口4789用于容器入网的UDP。`Docker Swarm` 默认的是4789，但是这里为什么是5789呢？因为阿里云默认不开放 `4789 UDP` 端口。:cry:\
`7946`：端口7946 TCP/UDP用于容器网络发现。\
上面两个端口可参见：[Use swarm mode routing mesh](https://docs.docker.com/engine/swarm/ingress/)\
`2377`：但是
:::

### 1、初始化 Manager

```shell
docker swarm init --advertise-addr 10.147.18.171:2377 --data-path-addr 10.147.18.171 --data-path-port 5789
```

## 4、更新回滚

## 5、docker stack

## 6、stack 和 compose 区别


---

::: danger 【注意】

:::


---

::: tip
持续施工 :construction:
:::