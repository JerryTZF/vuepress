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

prev: /zh/project/gift_point/gift-point-db
next: /zh/project/gift_point/gift-point-config

---
# 积分有礼缓存设计

::: tip 【说明】
1、缓存设计主要分：`盲盒`、`天天签到`、`积分抽奖`、`早起打卡`、`红包`、`运动兑积分`、`用户相关`这几个模块进行设置 \
2、活动的 `配置` 目前也是通过缓存进行存储 \
3、cache 采用 `Redis`
:::

---

- [盲盒](/zh/project/gift_point/cache/box.md)
- [天天签到](/zh/project/gift_point/cache/sign.md)
- [积分抽奖](/zh/project/gift_point/cache/lottery.md)
- [早起打卡](/zh/project/gift_point/cache/pickup.md)
- [红包](/zh/project/gift_point/cache/redpack.md)
- [运动兑积分](/zh/project/gift_point/cache/sport.md)
- [用户相关](/zh/project/gift_point/cache/user.md)
