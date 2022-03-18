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
prev: /zh/project/gift_point/api/core-records
next: /zh/project/gift_point/api/core-expired
---

# 发放|扣减积分

---

> ROUTE: core/point/update.json

> REQUEST:

```json
{
  "app_id": "110", // AppID
  "task_id": "10", // 调用者模块对应的ID
  "amount": 1, // 变更积分数值 (大于0为增加;小于0位扣减)
  "uuid": "810216004156319970", // 用户ID
  "flag": "TASK", // 调用者模块对应的Flag
  "transfer_info": "测试", // 变更说明
  "expired_time": "2023-01-05 00:00:00" // 失效时间 (如果是发放积分必填;扣减积分不填)
}
```

> RESPONSE:

```json
{
  "code": 200,
  "msg": "ok",
  "status": true,
  "data": []
}
```