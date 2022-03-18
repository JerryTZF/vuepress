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
prev: /zh/project/gift_point/api/core-query-points
next: /zh/project/gift_point/api/core-update
---

# 查询用户积分变更记录

---

> ROUTE: core/user/records.json

> REQUEST:

```json
{
  "uuid": "810215970546729970", // 用户ID
  "is_cost": "yes", // 枚举:yes:收入;no:支出
  "start_time": "2022-01-27 00:00:00", // 查询开始时间
  "end_time": "2022-01-28 23:59:00", // 查询结束时间
  "page": 1, // 第{$page}页
  "step": 5 // 每页{$step}页
}
```

> RESPONSE:

```json
{
  "code": 200,
  "msg": "ok",
  "status": true,
  "data": [
    {
      "id": 2759420, // ID
      "task_id": "10003", // 产生该积分变更的任务ID
      "record_points": 6, // 变更分值
      "transfer_info": "运动赢积分", // 变更说明
      "app_id": "110", // appid
      "create_time": "2022-01-28 18:33:32", // 记录时间
      "flag": "WALK" // 标志位:对应调用者的标记
    },
    {
      "id": 2759419,
      "task_id": "13",
      "record_points": 25,
      "transfer_info": "高德打车100元优惠券",
      "app_id": "110",
      "create_time": "2022-01-28 18:33:04",
      "flag": "TASK"
    },
    {
      "id": 2759418,
      "task_id": "16",
      "record_points": 40,
      "transfer_info": "30G专属流量办卡即享",
      "app_id": "110",
      "create_time": "2022-01-28 18:31:43",
      "flag": "TASK"
    },
    {
      "id": 2759417,
      "task_id": "12",
      "record_points": 12,
      "transfer_info": "打王者荣耀免流量",
      "app_id": "110",
      "create_time": "2022-01-28 18:31:18",
      "flag": "TASK"
    },
    {
      "id": 2759416,
      "task_id": "11",
      "record_points": 15,
      "transfer_info": "爱奇艺会员季卡",
      "app_id": "110",
      "create_time": "2022-01-28 18:30:41",
      "flag": "TASK"
    }
  ],
  "total": 18
}
```