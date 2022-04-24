---
sidebar: 'auto'

prev: /zh/harvest/overview.md

---

# 概览

::: tip TRAEFIK
`traefik` 与 `nginx` 一样，是一款优秀的反向代理工具，或者叫 `Edge Router`，这里我把它当做 `Gateway`。
:::

## 为什么使用Traefik

***演变过程：***

- `NGINX` + `PHP-FPM` + `模板引擎` 
- ↓
- `Traefik` + `Docker Compose`

---

*刚来公司的时候，使用的传统的 `NGINX` + `PHP-FPM`的方式，又因为公司项目性质是 ***小程序*** (多而小)，部分项目采用的还是
`模板引擎`，后面接手后，架构打算更换为 `Docker Compose` + `前后端分离`。此时 `Traefik` 的优势就非常适合我们此时的需求。*

---

***Traefik对比Nginx优势：***

- 支持服务动态发现，无需对每一个服务进行配置重启后生效。
- 自动装载 `SSL`，无需手动申请证书进行配置。:smile:
- `Provider` 完美支持 `Docker`,容器间通信格外方便。
- 动态调整自身负载均衡配置，无需手动配置。
- `Traefik` 提供的自身详细的metrics数据，对服务监控支持友好。
- 多种中间件可以对流量、路由等进行拦截处理。