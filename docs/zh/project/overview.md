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

---

# 项目文档说明

## 数据库

> 1、数据库连接信息
>
> 2、数据库表->创建语句
>
> 3、缓存关键说明，例如：K-V、TTL、类型、使用场景等

---

## 中间件

> 1、定时任务
>
> 2、消息队列
>
> 3、三方API相关信息，Exp：关键公私钥等
>
> 4、使用到的SDK相关信息，Exp：阿里云SDK、EasyWechat等

---

## 部署

> 1、`Dockerfile`、`docker-compose.yml`、`docker-tack.yml` 等部署配置文件
>
> 2、阿里云私有镜像仓库地址
>
> 3、Github私有仓库地址
>
> 4、部署所在服务器地址、目录、日志目录等