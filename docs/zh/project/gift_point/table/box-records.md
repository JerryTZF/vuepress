---
sidebarDepth: 2,
sidebar: [
{text: '返回', link: '/zh/project/gift_point/gift-point-db.md'},
{text: '管理员表' , link: '/zh/project/gift_point/table/admin.md'},
{text: '用户表' , link: '/zh/project/gift_point/table/user.md'},
{text: '轮播图表' , link: '/zh/project/gift_point/table/banner.md'},
{text: '金刚区表' , link: '/zh/project/gift_point/table/kingkong.md'},
{text: '红包配置表' , link: '/zh/project/gift_point/table/redpack.md'},
{text: '任务配置表' , link: '/zh/project/gift_point/table/task.md'},
{text: '访问记录表' , link: '/zh/project/gift_point/table/visit-records.md'},
{text: '盲盒记录表' , link: '/zh/project/gift_point/table/box-records.md'},
{text: '抽奖记录表' , link: '/zh/project/gift_point/table/lottery-records.md'},
{text: '早起打卡记录表' , link: '/zh/project/gift_point/table/pickup-records.md'},
{text: '领取红包记录表' , link: '/zh/project/gift_point/table/redpack-records.md'},
{text: '每日签到记录表' , link: '/zh/project/gift_point/table/sign-records.md'},
{text: '完成任务记录表' , link: '/zh/project/gift_point/table/task-records.md'},
{text: '每日步数记录表' , link: '/zh/project/gift_point/table/walk-records.md'},
]

prev: /zh/project/gift_point/table/visit-records.md
next: /zh/project/gift_point/table/lottery-records.md
---

# 盲盒记录记录表

---


## 字段及说明

|    field    |     Type     |    Default     |  Index  |    Desc    |
| :---------: | :----------: | :------------: | :-----: | :--------: |
|     id      |     int      | auto_increment | PRIMARY |  自增主键  |
|    uuid     | varchar(32)  |       ""       |   KEY   |    UUID    |
|    appid    | varchar(32)  |       ""       |  NULL   |  小程序ID  |
|    type     | varchar(16)  |       ""       |  NULL   |   标记位   |
|     aid     |     int      |       0        |  NULL   |   外键ID   |
|   amount    |     int      |       0        |  NULL   |  发放数值  |
|     biz     | varchar(64)  |       ""       |  NULL   | 外部订单号 |
|    date     | varchar(16)  |       ""       |   KEY   |    日期    |
|   buffer    | varchar(255) |       ""       |  NULL   | 辅助标记位 |
| create_time |   datetime   |      NULL      |   KEY   |  创建时间  |
| modify_time |   datetime   |      NULL      |  NULL   |  修改时间  |


::: tip 【注意】
buffer、type字段(标志位)说明： buffer字段是作为type字段的额外补充解释。 \
:point_down: 是 `type` 和 `buffer` 的解释
:::

|     Type      |  Buffer  |                   Desc                    |
| :-----------: | :------: | :---------------------------------------: |
| BOX_[boxName] |  集分宝  |     盲盒($boxName)获得{amount}集分宝      |
| BOX_[boxName] |   积分   |            盲盒($boxName)获得             |
| BOX | $boxName | 完成任务数等于盲盒开启条件时,记入一条记录 |

```text
buffer=集分宝 
解:该盲盒获取的奖励是集分宝

buffer=积分
解:该盲盒获取的奖励是积分

buffer=$boxName
解:完成任务数等于盲盒开启条件时,记入一条记录
```
---


## DDL

```sql
CREATE TABLE `daily_box_records` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `appid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `aid` int unsigned NOT NULL DEFAULT '0',
  `amount` int NOT NULL DEFAULT '0',
  `biz` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `date` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `buffer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `uuid` (`uuid`) USING BTREE,
  KEY `create_time` (`create_time`) USING BTREE,
  KEY `date` (`date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='流水表';
```
---


## 使用场景

> 管理后台

- `IndexService->box` 盲盒领取相关大盘统计数据
- `IndexService->reward` 奖励统计大盘数据(积分总和)
- `BoxService->detail` 盲盒基础信息
- `BoxService->detailInfo` 盲盒详细信息(用户兑换)


---

> 小程序客户端

- `BoxService->get` 领取盲盒
- `TaskService->finish` 完成指定数量[任务](/zh/project/gift_point/table/task-records.md)后，新增一条`可打开`盲盒记录