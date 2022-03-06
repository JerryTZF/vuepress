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

prev: /zh/project/overview
next: /zh/project/gift_point/gift-point-cache
---
# 积分有礼数据库设计

::: tip 【说明】
积分有礼项目共包含：`积分有礼小程序后端`、`积分底层服务` \
所有的字符集均为：`utf8mb4` 、 `utf8mb4_unicode_ci`
:::

---

## 积分有礼小程序后端

- [管理员表](/zh/project/gift_point/table/admin.md)
- [用户表](/zh/project/gift_point/table/user.md)
- [轮播图表](/zh/project/gift_point/table/banner.md)
- [金刚区表](/zh/project/gift_point/table/kingkong.md)
- [红包配置表](/zh/project/gift_point/table/redpack.md)
- [任务配置表](/zh/project/gift_point/table/task.md)
- [访问记录表](/zh/project/gift_point/table/visit-records.md)
- [盲盒记录记录表](/zh/project/gift_point/table/box-records.md)
- [抽奖记录记录表](/zh/project/gift_point/table/lottery-records.md)
- [早起打卡记录表](/zh/project/gift_point/table/pickup-records.md)
- [领取红包记录表](/zh/project/gift_point/table/redpack-records.md)
- [每日签到记录表](/zh/project/gift_point/table/sign-records.md)
- [完成任务记录表](/zh/project/gift_point/table/task-records.md)
- [每日步数记录表](/zh/project/gift_point/table/walk-records.md)

---

## 积分底层服务

- [UUID与手机号映射表](/zh/project/gift_point/table/map.md)
- [积分统计表(十表)](/zh/project/gift_point/table/statistics.md)
- [积分流水表(十表)](/zh/project/gift_point/table/records.md)


---