---
sidebarDepth: 2,
sidebar: [
{ text: '项目文档', link: '/zh/project/overview' },
{ text: '积分有礼', collapsible: true, children : [
{ text: '数据库设计' ,link : '/zh/project/gift_point/gift-point-db'},
{ text: '缓存设计' , link: '/zh/project/gift_point/gift-point-cache'},
{ text: '配置及依赖', link: '/zh/project/gift_point/gift-point-config'},
{ text: '其他' , link: '/zh/project/gift_point/gift-point-others'},
{ text: '接口文档', link: '/zh/project/gift_point/gift-point-api'}
]},
{ text: '运营商', collapsible: true, children: [
{ text: '数据库设计' ,link : '/zh/project/operator/operator-db'},
{ text: '缓存设计' , link: '/zh/project/operator/operator-cache'},
{ text: '配置及依赖', link: '/zh/project/operator/operator-config'},
{ text: '其他' , link: '/zh/project/operator/operator-others'},
{ text: '接口文档', link: '/zh/project/operator/operator-api'}
]},
{ text: '银行申卡', collapsible: true, children: [
{ text: '数据库设计' ,link : '/zh/project/bank/bank-db'},
{ text: '缓存设计' , link: '/zh/project/bank/bank-cache'},
{ text: '配置及依赖', link: '/zh/project/bank/bank-config'},
{ text: '其他' , link: '/zh/project/bank/bank-others'},
{ text: '接口文档', link: '/zh/project/bank/bank-api'}
]}
]

prev: /zh/project/gift_point/gift-point-config
next: /zh/project/gift_point/gift-point-api

---
# 其他声明

## 支付宝SDK配置

::: tip 【说明】
- 使用支付宝官方 [easy-sdk](https://github.com/alipay/alipay-easysdk/tree/master/php)
- `easy-sdk` 中的 `API` 均为 `OpenAPI`，前端的 `my.xxx` 为前端调用功能API，不是开放能力中的API
- 详细的支付宝使用见对应文档
:::

---

::: danger 【注意】
- 单个服务(Server)对多个小程序提供服务，即：不同的小程序请求服务，动态的进行配置装载。在并发较高时，后者的配置会覆盖前者的配置，导致发生错误，
因为`easy-sdk`内部是单例实现，所以这里需要保证一个请求所装载的配置均在对应的协程内。 
- 上传文件相关API，在 `PHP8` 中无法使用，SDK的一个BUG :cry:
:::

### 初始化配置

[SDK初始化代码](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Alipay/AlipaySDK.php)

::: warning 【说明】
> 将底层的初始化过程单独拉出来，目的是：每次请求都是一个协程，那么在协程内单独初始化该条请求
:::
---

[构建客户端](https://github.com/JerryTZF/hyperf-demo/blob/d06c1205c0/app/Lib/_Alipay/AlipayApi.php#L173)

---



## 集群配置

::: danger 【注意】
- `.env` 配置文件写入镜像中，原因：① 镜像仓库为私有仓库；② 集群映射配置文件比较麻烦
- 采用 `Docker Swarm` 集群模式，`K8S` 有些过于庞大不适合
- Gateway 使用 `Traefik` 进行反代
:::

*stack文件*

```yaml
version: "3.5"

services:
  gift-point-server:
    image: registry.images.com/Repositories/gift-point-server-v2:v1.7.3
    networks:
      - proxy
    volumes:
      - type: volume
        source: gift_point_server_logs
        target: /opt/www/runtime/logs
      - type: volume
        source: gift_point_server_cert
        target: /opt/www/app/Cert
    deploy:
      mode: global
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.gift-point-server.rule=Host(`point.xxxx.com`) || Host(`point.yyyy.cn`)"
        - "traefik.http.routers.gift-point-server.entrypoints=websecure"
        - "traefik.http.routers.gift-point-server.tls.certresolver=le"
        - "traefik.http.services.gift-point-server.loadbalancer.server.port=9501"

networks:
  proxy:
    external: true

volumes:
  gift_point_server_logs:
  gift_point_server_cert:
```
---

*启动命令*

- `docker stack deploy --with-registry-auth -c point-gift-server-stack.yml gift-point-v2`

---

## 涉及到的订单系统

![](http://img.tzf-foryou.com/img/20220408104555.jpg)