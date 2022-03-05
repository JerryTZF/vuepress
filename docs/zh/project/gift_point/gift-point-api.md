---
sidebarDepth: 2,
sidebar: [
{ text: '项目文档', link: '/zh/project/overview' },
{ text: '积分有礼', collapsible: true, children : [
{ text: '数据库设计' ,link : '/zh/project/gift_point/gift-point-db'},
{ text: '缓存设计' , link: '/zh/project/gift_point/gift-point-cache'},
{ text: '配置及依赖', link: '/zh/project/gift_point/gift-point-config'},
{ text: '其他' , link: '/zh/project/gift_point/gift-point-others'},
{ text: '接口文档', link: '/zh/project/gift_point/gift-point-api'}
]},
{ text: '运营商', collapsible: true, children: [
{ text: '数据库设计' ,link : '/zh/project/operator/operator-db'},
{ text: '缓存设计' , link: '/zh/project/operator/operator-cache'},
{ text: '配置及依赖', link: '/zh/project/operator/operator-config'},
{ text: '其他' , link: '/zh/project/operator/operator-others'},
{ text: '接口文档', link: '/zh/project/operator/operator-api'}
]},
{ text: '银行申卡', collapsible: true, children: [
{ text: '数据库设计' ,link : '/zh/project/bank/bank-db'},
{ text: '缓存设计' , link: '/zh/project/bank/bank-cache'},
{ text: '配置及依赖', link: '/zh/project/bank/bank-config'},
{ text: '其他' , link: '/zh/project/bank/bank-others'},
{ text: '接口文档', link: '/zh/project/bank/bank-api'}
]}
]

---

# 积分有礼接口文档

---

## 积分有礼客户端

|          API           | DOMAIN |            ROUTE            |       TYPE       |
| :--------------------: | :----: | :-------------------------: | :--------------: |
|       [获取轮播图](/zh/project/gift_point/api/banner.md)       |   /    |     v2/banner/list.json     | application/json |
|      [盲盒数据展示](/zh/project/gift_point/api/box-show.md)      |   /    |      v2/box/show.json       | application/json |
|        [领取盲盒](/zh/project/gift_point/api/box-get.md)        |   /    |       v2/box/get.json       | application/json |
|       [金刚区列表](/zh/project/gift_point/api/king-list.md)       |   /    |    v2/kingkong/list.json    | application/json |
|         [封面图](/zh/project/gift_point/api/king-img.md)         |   /    | v2/kingkong/cover_img.json  | application/json |
|        [抽奖面板](/zh/project/gift_point/api/lottery-board.md)        |   /    |    v2/lottery/show.json     | application/json |
|          [抽奖](/zh/project/gift_point/api/lottery-do.md)          |   /    |     v2/lottery/do.json      | application/json |
|       [小程序登录](/zh/project/gift_point/api/my-login.md)       |   /    |     v2/user/login.json      | application/json |
|      [授权基本信息](/zh/project/gift_point/api/my-auth-info.md)      |   /    |   v2/user/auth/info.json    | application/json |
|       [设置手机号](/zh/project/gift_point/api/my-auth-phone.md)       |   /    |   v2/user/auth/phone.json   | application/json |
|      [查询用户积分](/zh/project/gift_point/api/my-points.md)      |   /    |     v2/user/points.json     | application/json |
|    [用户积分变更记录](/zh/project/gift_point/api/my-points-record.md)    |   /    |   v2/user/histories.json    | application/json |
| [过期积分列表(每日展示)](/zh/project/gift_point/api/my-expired-list.md) |   /    |    v2/user/expired.json     | application/json |
|     [即将过期积分数](/zh/project/gift_point/api/my-expired-points.md)     |   /    | v2/user/recent/expired.json | application/json |
|          [报名](/zh/project/gift_point/api/pick-sign.md)          |   /    |      v2/pick/sign.json      | application/json |
|    [早起打卡面板数据](/zh/project/gift_point/api/pick-board.md)    |   /    |      v2/pick/show.json      | application/json |
|          [打卡](/zh/project/gift_point/api/pick-pick.md)          |   /    |      v2/pick/pick.json      | application/json |
|    [早起打卡弹窗数据](/zh/project/gift_point/api/pick-pop.md)    |   /    |      v2/pick/pop.json       | application/json |
|     [早起打卡排行榜](/zh/project/gift_point/api/pick-rank.md)     |   /    |      v2/pick/rank.json      | application/json |
|         [抢红包](/zh/project/gift_point/api/redpack-rob.md)         |   /    |     v2/redpack/rob.json     | application/json |
|     [红包详情页数据](/zh/project/gift_point/api/redpack-list.md)     |   /    |    v2/redpack/show.json     | application/json |
|      [广播红包用户](/zh/project/gift_point/api/redpack-radio.md)      |   /    |    v2/redpack/radio.json    | application/json |
|    [点击红包(统计用)](/zh/project/gift_point/api/redpack-click.md)    |   /    |    v2/redpack/click.json    | application/json |
|          [签到](/zh/project/gift_point/api/sign-sign.md)          |   /    |       v2/sign/do.json       | application/json |
|       [签到想详情](/zh/project/gift_point/api/sign-detail.md)       |   /    |     v2/sign/detail.json     | application/json |
|  [关注、收藏情况(签到)](/zh/project/gift_point/api/sign-pop-info.md)  |   /    |    v2/sign/pop/info.json    | application/json |
|   [关注或者收藏(签到)](/zh/project/gift_point/api/sign-pop.md)   |   /    |      v2/sign/pop.json       | application/json |
|        [完成任务](/zh/project/gift_point/api/task-do.md)        |   /    |     v2/task/finish.json     | application/json |
|        [任务列表](/zh/project/gift_point/api/task-list.md)        |   /    |      v2/task/list.json      | application/json |
|        [点击任务](/zh/project/gift_point/api/task-click.md)        |   /    |     v2/task/click.json      | application/json |
|      [获取用户步数](/zh/project/gift_point/api/walk-get.md)      |   /    |      v2/walk/get.json       | application/json |
|     [获取排行榜数据](/zh/project/gift_point/api/walk-rank.md)     |   /    |      v2/walk/rank.json      | application/json |
|        [兑换积分](/zh/project/gift_point/api/walk-exchange.md)        |   /    |    v2/walk/exchange.json    | application/json |


---


## 积分底层

::: warning 【注意】
前端无需关注
:::

---

|           API            | DOMAIN |          ROUTE           |       TYPE       |
| :----------------------: | :----: | :----------------------: | :--------------: |
|       [查询用户积分](/zh/project/gift_point/api/core-query-points.md)       |   /    |  core/user/balance.json  | application/json |
|   [查询用户积分变更记录](/zh/project/gift_point/api/core-records.md)   |   /    |  core/user/records.json  | application/json |
|   [发放\|扣减 用户积分](/zh/project/gift_point/api/core-update.md)    |   /    |  core/point/update.json  | application/json |
|     [查询用户过期积分](/zh/project/gift_point/api/core-expired.md)     |   /    | core/point/expired.json  | application/json |
| [查询最近一天要过期的积分](/zh/project/gift_point/api/core-recent-expired.md) |   /    | core/recent/expired.json | application/json |

---

