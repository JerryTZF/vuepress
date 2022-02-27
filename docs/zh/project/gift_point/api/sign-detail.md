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
{ text: '签到详情', link: '/zh/project/gift_point/api/sign-detail'},
{ text: '关注、收藏情况(签到)', link: '/zh/project/gift_point/api/sign-pop-info'},
{ text: '关注或者收藏(签到)', link: '/zh/project/gift_point/api/sign-pop'},
{ text: '完成任务', link: '/zh/project/gift_point/api/task-do'},
{ text: '任务列表', link: '/zh/project/gift_point/api/task-list'},
{ text: '点击任务', link: '/zh/project/gift_point/api/task-click'},
{ text: '获取用户步数', link: '/zh/project/gift_point/api/walk-get'},
{ text: '获取排行榜数据', link: '/zh/project/gift_point/api/walk-rank'},
{ text: '兑换积分', link: '/zh/project/gift_point/api/walk-exchange'},
]
prev: /zh/project/gift_point/api/sign-sign
next: /zh/project/gift_point/api/sign-pop-info
---

# 签到详情

---

> ROUTE: v2/sign/detail.json

> REQUEST:
```json
{
  "app_id": "2021001169664470",
  "user_id": "2088222096950517"
}
```

> RESPONSE:

```json
{
  "code": 200,
  "msg": "ok",
  "status": true,
  "data": {
    "combo_sum": 3, // 连续签到天数
    "reward": 1, // 今天签到应该发放多少集分宝
    "sign_days": [ // 签到历史
      "2021-10-28",
      "2021-10-29",
      "2021-10-30",
      "2021-10-31"
    ],
    "special_days": { // 未来日期应该发放的集分宝数值
      "2021-12-03": 2,
      "2021-12-10": 4,
      "2021-12-17": 7,
      "2021-12-26": 11
    },
    "is_sign": false, // 今日是否签过到
    "more_day": 3, // 还需要连续签到天数
    "more_point": 7 // 还需要{$more_point}天可以获得7积分
  }
}
```