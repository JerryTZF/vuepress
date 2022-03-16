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

prev: /zh/project/gift_point/cache/pickup.md
next: /zh/project/gift_point/cache/sport.md

---

# 红包缓存设计

[[TOC]]

## 1、红包兑换库存

### 基本信息

- TYPE: HASH TABLE
- KEY: REDPACK_INVENTORY_{$BATCHID}
- FIELD: CARD_ID
- VALUE: INT
- TTL: NULL

::: tip 【注意】
红包库存会在 `定时任务` 中每日重置红包个数
:::

---

### 示例

|    KEY     | FIELD | VALUE |        DESC         |
| :--------: | :---: | :---: | :-----------------: |
| HASH TABLE |       |       |                     |
|   \|---    |  21   |  10   | 红包ID=21剩余的数量 |
|   \|---    |  22   |  100  | 红包ID=21剩余的数量 |
|   \|---    |  ...  |  ...  |         ...         |

---

![示例](http://img.tzf-foryou.com/img/20220316143034.png)

### 使用场景

> 小程序客户端

- `RedpackService->rob` 判断当日当前场次红包库存是否充足
- `RedpackService->show` 红包详情页剩余数量展示

---

> 管理后台

- `RedpackService->redpackUpdate` 当新创建红包时，立即创建红包库存(如果创建了要到次日生成缓存,当日红包无法方法)

---

>  定时任务

- `RedpackReset->execute` 每天12:05AM恢复红包数量(重置库存)