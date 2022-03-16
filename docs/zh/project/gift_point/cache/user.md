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

prev: /zh/project/gift_point/cache/sport.md
next: /zh/project/gift_point/gift-point-cache.md

---

# 用户缓存设计

[[TOC]]

## 1、小程序登录

### 基本信息

- TYPE: STRING
- KEY: LOGIN_{$APPID}_{$USERID}
- VALUE: 10|20|30
- TTL: 今日剩余秒数

::: tip 【注意】
`10` ：游客(进入小程序未授权)；`20` ：授权基本信息； `30` ：授权基本信息 + 授权手机号 \
该用户是否已经登陆过;登陆过后,所有的再次调用login,会通过缓存直接返回user_id
:::

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220316161835.png)

---

### 常用场景

> 小程序

- `MyService->login` 判断是否登陆过
- `MyService->setUserInfo` 设置用户基本信息，更新登录状态
- `MyService->setUserPhone` 设置用户手机号，更新登录状态

---

> 管理后台

- 无