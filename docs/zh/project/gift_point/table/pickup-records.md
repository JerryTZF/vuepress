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

prev: /zh/project/gift_point/table/lottery-records.md
next: /zh/project/gift_point/table/redpack-records.md
---

# 早起打卡记录表

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

|   Type    |    Buffer    |             Desc             |
| :-------: | :----------: | :--------------------------: |
| PICK_SIGN |    TICKET    | 用户报名扣除门票{amount}积分 |
| PICK_PICK | 1,2,3,4,5... |   用户连续打卡{$buffer}次    |
| PICK_PUB  |              |   普通打卡发放{amount}积分   |
| PICK_PUB  | SPECIAL_PUB  | 连续7天打卡发放{amount}积分  |

```text
buffer=1,2,3,4,5...
解:连续打卡次数

buffer=SPECIAL_PUB
解:连续7天打卡特殊奖励标记
```


## DDL

```sql
CREATE TABLE `daily_pickup_records` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='早起打卡流水表';
```


## 使用场景

> 管理后台

- `IndexService->pickup` 统计大盘数据->早起打卡数据
- `IndexService->reward` 统计大盘数据->所有奖励计算
- `PickupController->dayData` 每日早起打卡相关数据
- ~~`PickupService->detail` 瓜分打卡基础统计信息~~ **废弃,不符合业务需求**
- `PickupService->detailNew` 瓜分打卡详细信息

---
> 小程序客户端

- `PickupService->sign` 早起打卡->报名
- ~~`PickupService->show` 页面数据展示~~ **废弃**
- `PickupService->showNew` 页面数据展示
- `PickupService->pick` 早起打卡->打卡
- `PickupService->popup` 通知用户获得奖励情况(一天只弹一次)
- `PickupService->rank` 早起打卡->排行榜