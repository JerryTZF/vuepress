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

prev: /zh/project/gift_point/cache/lottery.md
next: /zh/project/gift_point/cache/redpack.md

---

# 早起打卡缓存设计

[[TOC]]


## 1、配置信息

### 基本信息

- TYPE: HASH TABLE
- KEY: PICKUP_CONFIG
- FIELD: cover_image|ticket|coefficient|max|min|inflation_min|inflation_max|remark
- VALUE: mixed
- TTL: NULL

::: danger 【注意】
这里使用普通的 `K-V` 类型即可，当时没有考虑太多选择了 `HASH TABLE` ，这里后期可以优化掉
:::

---

### 示例

|    KEY     |     FIELD     |         VALUE         |           DESC            |
| :--------: | :-----------: | :-------------------: | :-----------------------: |
| HASH TABLE |               |                       |                           |
|   \|---    |      min      |          10           |      发放积分最小值       |
|   \|---    |      max      |          100          |      发放积分最大值       |
|   \|---    |    ticket     |          10           |       报名所需积分        |
|   \|---    |    remark     |         备注          |           备注            |
|   \|---    |  cover_image  | `https://a.com/a.png` |      首页活动封面图       |
|   \|---    |  coefficient  |          60           |       奖池膨胀系数        |
|   \|---    | inflation_min |           1           | 连续7天打卡膨胀系数最小值 |
|   \|---    | inflation_max |           3           | 连续7天打卡膨胀系数最大值 |


---

::: tip 【关键FIELD说明】
`coefficient` : 构成奖池数值一部分：`奖池数值` = `门票总数` * `coefficient` \

---

- 当用户 `第` 连续 `7` 天打卡时，发放积分为：\
mt_rand(min,max) * mt_rand(inflation_min,inflation_max)
- 当用户不是 `第` 连续 `7` 天打卡是，发放积分为： \
mt_rand(min,max)
:::

---

### 使用场景

> 管理后台

- `PickController->config` 设置配置

---

> 小程序客户端

- `KingkongController->coverImg` 首页活动图
- `PickupService->sign` 配置是否存在 + 读取配置业务逻辑配置
- `PickupService->show` 配置是否存在 + 读取配置业务逻辑配置

---

## 2、打卡弹窗提醒

### 基本信息

- TYPE: STRING
- KEY: PICKUP_IS_POPUP_{$APPID}_{$USERID}
- VALUE: HAD POP
- TTL: 今日剩余秒数

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220315222939.png)

---

### 使用场景

> 管理后台

- 无

---

> 小程序客户端

- `PickupController->popup` 写入已弹窗记录
- `PickupService->showNew` 早起打卡活动是否已弹窗字段
- ~~`PickupService->show` 早起打卡活动是否已弹窗字段~~