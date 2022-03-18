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
prev: /zh/project/gift_point/gift-point-api
next: /zh/project/gift_point/api/core-records
---

# 查询用户积分

---

> ROUTE: core/user/balance.json

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
    "active_balance": 8088
  }
}
```