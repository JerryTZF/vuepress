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

prev: /zh/project/gift_point/cache/sign.md
next: /zh/project/gift_point/cache/pickup.md

---

# 积分抽奖

[[TOC]]

## 1、配置信息

- TYPE: HASH TABLE
- KEY: LOTTERY_CONFIG
- FIELD: cover_image|ticket|min|max|remark|reward
- VALUE: mixed
- TTL: NULL

::: danger 【注意】
这里使用普通的 `K-V` 类型即可，当时没有考虑太多选择了 `HASH TABLE` ，这里后期可以优化掉
:::

---

### 示例

|    KEY     |    FIELD    |         VALUE         |       DESC       |
| :--------: | :---------: | :-------------------: | :--------------: |
| HASH TABLE |             |                       |                  |
|   \|---    |     min     |           1           |  抽奖次数最小值  |
|   \|---    |     max     |           6           |  抽奖次数最大值  |
|   \|---    |   ticket    |          10           | 每次抽奖所需积分 |
|   \|---    |   remark    |       抽奖配置        |       备注       |
|   \|---    | cover_image | `https://a.com/a.png` |  首页活动封面图  |
|   \|---    |   reward    |      JSON STRING      |     奖励详情     |

*JSON STRING*

```json
[
  {
    "icon": "https://pic.com/176.png", // 该奖项图标地址
    "level": "7", // 奖项级别
    "name": "10积分", // 奖项名称
    "reward_type": "积分", // 奖励类型
    "sum": 10000, // 奖项数量(该奖项被中10000次后无法再中)
    "amount": 10, // 奖励数值
    "rate": 0.1 // 概率
  },
  {
    "icon": "https://pic.com/176.png",
    "level": "5",
    "name": "1集分宝",
    "reward_type": "集分宝",
    "sum": 200,
    "amount": 1,
    "rate": 0.55
  },
  {
    "icon": "https://pic.com/176.png",
    "level": "4",
    "name": "288积分",
    "reward_type": "积分",
    "sum": 3000,
    "amount": 288,
    "rate": 0.2
  },
  {
    "icon": "https://pic.com/176.png",
    "level": "3",
    "name": "10集分宝",
    "reward_type": "集分宝",
    "sum": 50,
    "amount": 10,
    "rate": 0.07
  },
  {
    "icon": "https://pic.com/176.png",
    "level": "2",
    "name": "20集分宝",
    "reward_type": "集分宝",
    "sum": 35,
    "amount": 20,
    "rate": 0
  },
  {
    "icon": "https://pic.com/176.png",
    "level": "6",
    "name": "388集分宝",
    "reward_type": "集分宝",
    "sum": 0,
    "amount": 388,
    "rate": 0
  },
  {
    "icon": "https://pic.com/176.png",
    "level": "1",
    "name": "688积分",
    "reward_type": "积分",
    "sum": 100,
    "amount": 688,
    "rate": 0.08
  }
]
```
---

:::  tip 【注意】
所有奖项的 `rate` 的和必须等于 `1`
:::

---

### 使用场景

> 管理后台

- `LotteryController->config` 编辑/查看 配置

> 小程序客户端

- `KingkongController->coverImg` 获取封面图
- `LotteryService->do` 抽奖检查配置是否存在 + 读取配置进行抽奖
- `LotteryService->show` 读取抽奖配置展示抽奖页面对应信息

## 2、抽奖次数记录

### 基本信息

- TYPE: STRING
- KEY: LOTTERY_TIMES_{$APPID}_{$USERID}
- VALUE: INT
- TTL: 今日剩余秒数

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220314213648.png)

---

### 使用场景

> 管理后台

- 无

---

> 小程序客户端

- `LotteryService->do` 校验是否剩余抽奖次数是否够再次抽奖
- `LotteryService->show` 展示用户剩余抽奖次数

---

## 3、每一个奖项剩余数量


### 基本信息

- TYPE: STRING
- KEY: LOTTERY_DAILY_TIMES_{$REWARD_LEVEL}
- VALUE: INT
- TTL: 今日剩余秒数

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220314214152.png)

> 管理后台

- 无

---

> 小程序客户端

- `LotteryService->do` 对应奖项剩余的数量是否够再次抽奖(业务校验处理)