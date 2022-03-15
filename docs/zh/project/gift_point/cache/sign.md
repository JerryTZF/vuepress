---
sidebarDepth: 2,
sidebar: [
{ text: '返回', link: '/zh/project/gift_point/gift-point-cache.md'},
{ text: '盲盒', link: '/zh/project/gift_point/cache/box.md'},
{ text: '天天签到', link: '/zh/project/gift_point/cache/sign.md'},
{ text: '积分抽奖', link: '/zh/project/gift_point/cache/lottery.md'},
{ text: '早起打卡', link: '/zh/project/gift_point/cache/pickup.md'},
{ text: '红包', link: '/zh/project/gift_point/cache/redpack.md'},
{ text: '运动兑积分', link: '/zh/project/gift_point/cache/sport.md'},
{ text: '用户相关', link: '/zh/project/gift_point/cache/user.md'},
]

prev: /zh/project/gift_point/cache/box.md
next: /zh/project/gift_point/cache/lottery.md

---

# 天天签到缓存设计

[[TOC]]

## 1、配置信息

### 基本信息

- TYPE: STRING
- KEY: SIGN_CONFIG
- VALUE: JSON STRING
- TTL: NULL

::: tip
因为不太想一张表就一行数据，所以使用Redis存储
:::


### 示例

```json
{
	"7": 2, // 连续签到7天，发放2集分宝
	"14": 4, // 连续签到14天，发放4集分宝
	"21": 7, // 连续签到21天，发放7集分宝
	"30": 11 // 连续签到30天，发放11集分宝
}
```

### 使用场景

> 管理后台

- `SignController->config` 配置天天签到的基本信息

> 小程序客户端

- `SignService->show` 天天签到配置信息是否存在，不存在无法展示该用户的签到信息

## 2、签到记录

### 基本信息

- TYPE: STRING
- KEY: SIGN_{$APPID}_{$USERID}
- VALUE: SIGNED
- TTL: 今日剩余秒数

### 使用场景

> 小程序客户端

- `SignService->sign` 判断当日是否已经签到过 + 写入当日签到记录