---
sidebarDepth: 2,
sidebar: [
{ text: '接口列表' , link: '/zh/project/gift_point/gift-point-api'},
{ text: '查询用户积分' , link: '/zh/project/gift_point/api/core-query-points'},
{ text: '查询用户积分变更记录', link: '/zh/project/gift_point/api/core-records'},
{ text: '发放|扣减积分', link: '/zh/project/gift_point/api/core-update'},
{ text: '查询过期积分', link: '/zh/project/gift_point/api/core-expired'},
{ text: '最近一天要过期的积分', link: '/zh/project/gift_point/api/core-recent-expired.md'},
]
prev: /zh/project/gift_point/api/core-expired
next: /zh/project/gift_point/gift-point-api
---

# 最近一天要过期的积分


---

> ROUTE: core/recent/expired.json

> REQUEST:

```json
{
  "uuid": "810215970546729970"
}
```

> RESPONSE:

```json
{
  "code": 200,
  "msg": "ok",
  "status": true,
  "data": {
    "s": 1647532800, // 今天时间戳
    "e": 1647619200, // 明天时间戳
    "points": 0 // 在{$s}和{$e}之间要失效的积分数值
  }
}
```
