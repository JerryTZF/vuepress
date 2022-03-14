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

prev: /zh/project/gift_point/gift-point-cache.md
next: /zh/project/gift_point/cache/sign.md

---

# 盲盒缓存设计

[[TOC]]

## 1、配置信息

### 基本信息

- TYPE: STRING
- KEY: BOXES_CONFIG
- VALUE: JSON STRING
- TTL: NULL

::: tip
因为不太想一张表就一行数据，所以使用Redis存储
:::

---

### 示例

```json
[
	{
		"name": "盲盒一", // 盲盒名称
		"task_sum": 5, // 完成{$task_sum}个任务才可以领取
		"alipay_point_valve": 500, // 该盲盒库存为500集分宝
		"alipay_point_unit": 1, // 领取盲盒可获得1集分宝
		"points_unit": 20 // 集分宝发放完毕后，领取盲盒不再发放集分宝，而是发阿芳20积分
	},
	{
		"name": "盲盒二",
		"task_sum": 8,
		"alipay_point_valve": 400,
		"alipay_point_unit": 2,
		"points_unit": 30
	},
	{
		"name": "盲盒三",
		"task_sum": 12,
		"alipay_point_valve": 300,
		"alipay_point_unit": 3,
		"points_unit": 40
	},
	{
		"name": "盲盒四",
		"task_sum": 18,
		"alipay_point_valve": 100,
		"alipay_point_unit": 5,
		"points_unit": 188
	}
]
```
---

### 使用场景

> 管理后台

- `BoxController->config` 管理后台配置盲盒信息

> 客户端小程序
 
- `BoxesService->get` 配置是否存在,不存在返回异常
- `BoxexService->show` 配置是否存在,不存在返回异常
- `TaskService->finish` 完成数至可以领取盲盒时，读取配置，确定下发哪一个盲盒

---

## 2、盲盒领取情况

### 基本信息

- TYPE: HASH TABLE
- KEY: BOXES_DONE_{$APPID}_{$USERID}
- FIELD: 盲盒名称
- VALUE: DONE
- TTL: NULL

---

### 示例

![示例](http://img.tzf-foryou.com/img/20220313143005.png)

---

### 常用场景

> 小程序客户端

- `BoxexService->show` 盲盒领取判断用户是否领取过该盲盒
- `BoxesService->get` 判断用户是否领取过该盲盒 + 写入缓存用户领取该盲盒记录