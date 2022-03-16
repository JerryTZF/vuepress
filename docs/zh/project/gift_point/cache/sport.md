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

prev: /zh/project/gift_point/cache/redpack.md
next: /zh/project/gift_point/cache/user.md

---

# 运动兑积分缓存设计

[[TOC]]

## 1、配置信息

### 基础信息

- TYPE: HASH TABLE
- KEY: WALK_CONFIG
- FIELD: remark|rate|cover_img
- VALUE: mixed
- TTL: NULL

---

### 示例

|    KEY     |   FIELD   |        VALUE         |       DESC       |
| :--------: | :-------: | :------------------: | :--------------: |
| HASH TABLE |           |                      |                  |
|   \|---    |  remark   |         比例         |       备注       |
|   \|---    |   rate    |         300          | 步数兑换积分比例 |
|   \|---    | cover_img | `http://a.com/a.png` |  首页活动封面图  |

---

### 使用场景

> 小程序客户端

- `KingkongController->coverImg` 获取首页封面图
- `WalkService->rank` 活动页兑换比例展示
- `WalkService->exchange` 获取兑换比例进行计算获得积分数值

> 管理后台

- `WalkController->config` 配置配置


---

## 2、排行榜

### 基础信息

- TYPE: ZSET(有序集合)
- KEY: WALK_RANK
- MEMBER: {$USERID}
- SCORE: 用户走路步数
- TTL: 今日剩余秒数

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220316160130.png)

---

### 使用场景

> 小程序

- `WalkService->get` 获取用户步数写入集合
- `WalkService->rank` 获取排行榜

---

> 管理后台

- 无

---

## 3、每日用户兑换记录

### 基本信息

- TYPE: STRING
- KEY: WALK_EXED_{$APPID}_{$USERID}
- VALUE: HAD EXCHANGED
- TTL: 今日剩余秒数

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220316160943.png)

---

### 使用场景

> 小程序

- `WalkService->rank` 活动页展示用户是否已经兑换过积分
- `WalkService->exchange` 校验用户是否兑换过积分(不允许重复兑换)

---

> 管理后台

- 无