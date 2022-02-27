---
sidebarDepth: 2,
sidebar: [
{ text: '接口列表', link: '/zh/project/gift_point/gift-point-api'},
{ text: '获取轮播图' , link: '/zh/project/gift_point/api/banner'},
{ text: '盲盒数据展示', link: '/zh/project/gift_point/api/box-show'},
{ text: '领取盲盒', link: '/zh/project/gift_point/api/box-get'},
{ text: '金刚区列表', link: '/zh/project/gift_point/api/king-list'},
{ text: '封面图', link: '/zh/project/gift_point/api/king-img'},
{ text: '抽奖面板', link: '/zh/project/gift_point/api/lottery-board'},
{ text: '抽奖', link: '/zh/project/gift_point/api/lottery-do'},
{ text: '小程序登录', link: '/zh/project/gift_point/api/my-login'},
{ text: '授权基本信息', link: '/zh/project/gift_point/api/my-auth-info'},
{ text: '设置手机号', link: '/zh/project/gift_point/api/my-auth-phone'},
{ text: '查询用户积分', link: '/zh/project/gift_point/api/my-points'},
{ text: '用户积分变更记录', link: '/zh/project/gift_point/api/my-points-record'},
{ text: '过期积分列表(每日展示)', link: '/zh/project/gift_point/api/my-expired-list'},
{ text: '即将过期积分数', link: '/zh/project/gift_point/api/my-expired-points'},
{ text: '报名', link: '/zh/project/gift_point/api/pick-sign'},
{ text: '早起打卡面板数据', link: '/zh/project/gift_point/api/pick-board'},
{ text: '打卡', link: '/zh/project/gift_point/api/pick-pick'},
{ text: '早起打卡弹窗数据', link: '/zh/project/gift_point/api/pick-pop'},
{ text: '早起打卡排行榜', link: '/zh/project/gift_point/api/pick-rank'},
{ text: '抢红包', link: '/zh/project/gift_point/api/redpack-rob'},
{ text: '红包详情页数据', link: '/zh/project/gift_point/api/redpack-list'},
{ text: '广播红包用户', link: '/zh/project/gift_point/api/redpack-radio'},
{ text: '点击红包(统计用)', link: '/zh/project/gift_point/api/redpack-click'},
{ text: '签到', link: '/zh/project/gift_point/api/sign-sign'},
{ text: '签到想详情', link: '/zh/project/gift_point/api/sign-detail'},
{ text: '关注、收藏情况(签到)', link: '/zh/project/gift_point/api/sign-pop-info'},
{ text: '关注或者收藏(签到)', link: '/zh/project/gift_point/api/sign-pop'},
{ text: '完成任务', link: '/zh/project/gift_point/api/task-do'},
{ text: '任务列表', link: '/zh/project/gift_point/api/task-list'},
{ text: '点击任务', link: '/zh/project/gift_point/api/task-click'},
{ text: '获取用户步数', link: '/zh/project/gift_point/api/walk-get'},
{ text: '获取排行榜数据', link: '/zh/project/gift_point/api/walk-rank'},
{ text: '兑换积分', link: '/zh/project/gift_point/api/walk-exchange'},
]
prev: /zh/project/gift_point/api/my-points
next: /zh/project/gift_point/api/my-expired-list
---

# 用户积分变更记录

---

> ROUTE: v2/user/histories.json

> REQUEST:
```json
{
  "app_id": "2021001169664470",
  "user_id": "2088122804990942",
  "is_cost": "no", // 枚举;no:支出;yes:收入
  "start_time": "2021-12-01 00:00:00", // 选填,默认:2020-01-01 00:00:00
  "end_time": "2021-12-02 23:59:59", // 选填,默认:2025-01-01 00:00:00
  "page": 1, // 选填,默认1
  "step": 10 // 选填,默认10
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
      "id": 2729779,
      "task_id": "8",
      "record_points": -1,
      "transfer_info": "兑换红包扣减积分",
      "app_id": "2021001169664470",
      "create_time": "2021-12-01 16:59:01",
      "flag": "V2-REDPACK"
    },
    {
      "id": 2729778,
      "task_id": "8",
      "record_points": -1,
      "transfer_info": "兑换红包扣减积分",
      "app_id": "2021001169664470",
      "create_time": "2021-12-01 16:58:46",
      "flag": "V2-REDPACK"
    },
    {
      "id": 2729774,
      "task_id": "8",
      "record_points": -1,
      "transfer_info": "兑换红包扣减积分",
      "app_id": "2021001169664470",
      "create_time": "2021-12-01 16:42:53",
      "flag": "V2-REDPACK"
    }
  ],
  "count": 58
}
```