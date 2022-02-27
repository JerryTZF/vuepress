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

|          API           | DOMAIN |            ROUTE            |       TYPE       |
| :--------------------: | :----: | :-------------------------: | :--------------: |
|       [获取轮播图](/zh/project/gift_point/api/banner)       |   /    |     v2/banner/list.json     | application/json |
|      [盲盒数据展示](/zh/project/gift_point/api/box-show)      |   /    |      v2/box/show.json       | application/json |
|        [领取盲盒](/zh/project/gift_point/api/box-get)        |   /    |       v2/box/get.json       | application/json |
|       [金刚区列表](/zh/project/gift_point/api/king-list)       |   /    |    v2/kingkong/list.json    | application/json |
|         [封面图](/zh/project/gift_point/api/king-img)         |   /    | v2/kingkong/cover_img.json  | application/json |
|        [抽奖面板](/zh/project/gift_point/api/lottery-board)        |   /    |    v2/lottery/show.json     | application/json |
|          [抽奖](/zh/project/gift_point/api/lottery-do)          |   /    |     v2/lottery/do.json      | application/json |
|       [小程序登录](/zh/project/gift_point/api/my-login)       |   /    |     v2/user/login.json      | application/json |
|      [授权基本信息](/zh/project/gift_point/api/my-auth-info)      |   /    |   v2/user/auth/info.json    | application/json |
|       [设置手机号](/zh/project/gift_point/api/my-auth-phone)       |   /    |   v2/user/auth/phone.json   | application/json |
|      [查询用户积分](/zh/project/gift_point/api/my-points)      |   /    |     v2/user/points.json     | application/json |
|    [用户积分变更记录](/zh/project/gift_point/api/my-points-record)    |   /    |   v2/user/histories.json    | application/json |
| [过期积分列表(每日展示)](/zh/project/gift_point/api/my-expired-list) |   /    |    v2/user/expired.json     | application/json |
|     [即将过期积分数](/zh/project/gift_point/api/my-expired-points)     |   /    | v2/user/recent/expired.json | application/json |
|          [报名](/zh/project/gift_point/api/pick-sign)          |   /    |      v2/pick/sign.json      | application/json |
|    [早起打卡面板数据](/zh/project/gift_point/api/pick-board)    |   /    |      v2/pick/show.json      | application/json |
|          [打卡](/zh/project/gift_point/api/pick-pick)          |   /    |      v2/pick/pick.json      | application/json |
|    [早起打卡弹窗数据](/zh/project/gift_point/api/pick-pop)    |   /    |      v2/pick/pop.json       | application/json |
|     [早起打卡排行榜](/zh/project/gift_point/api/pick-rank)     |   /    |      v2/pick/rank.json      | application/json |
|         [抢红包](/zh/project/gift_point/api/redpack-rob)         |   /    |     v2/redpack/rob.json     | application/json |
|     [红包详情页数据](/zh/project/gift_point/api/redpack-list)     |   /    |    v2/redpack/show.json     | application/json |
|      [广播红包用户](/zh/project/gift_point/api/redpack-radio)      |   /    |    v2/redpack/radio.json    | application/json |
|    [点击红包(统计用)](/zh/project/gift_point/api/redpack-click)    |   /    |    v2/redpack/click.json    | application/json |
|          [签到](/zh/project/gift_point/api/sign-sign)          |   /    |       v2/sign/do.json       | application/json |
|       [签到想详情](/zh/project/gift_point/api/sign-detail)       |   /    |     v2/sign/detail.json     | application/json |
|  [关注、收藏情况(签到)](/zh/project/gift_point/api/sign-pop-info)  |   /    |    v2/sign/pop/info.json    | application/json |
|   [关注或者收藏(签到)](/zh/project/gift_point/api/sign-pop)   |   /    |      v2/sign/pop.json       | application/json |
|        [完成任务](/zh/project/gift_point/api/task-do)        |   /    |     v2/task/finish.json     | application/json |
|        [任务列表](/zh/project/gift_point/api/task-list)        |   /    |      v2/task/list.json      | application/json |
|        [点击任务](/zh/project/gift_point/api/task-click)        |   /    |     v2/task/click.json      | application/json |
|      [获取用户步数](/zh/project/gift_point/api/walk-get)      |   /    |      v2/walk/get.json       | application/json |
|     [获取排行榜数据](/zh/project/gift_point/api/walk-rank)     |   /    |      v2/walk/rank.json      | application/json |
|        [兑换积分](/zh/project/gift_point/api/walk-exchange)        |   /    |    v2/walk/exchange.json    | application/json |


