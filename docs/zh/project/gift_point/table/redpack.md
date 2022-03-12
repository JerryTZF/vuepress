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

prev: /zh/project/gift_point/table/kingkong.md
next: /zh/project/gift_point/table/task.md
---

# 红包配置表

---

## 字段及说明


|    field    |     Type     |    Default     |  Index  |           Desc           |
| :---------: | :----------: | :------------: | :-----: | :----------------------: |
|     id      |     int      | auto_increment | PRIMARY |         自增主键         |
|    appid    | varchar(32)  |       ""       |  NULL   |          应用ID          |
| batch_name  | varchar(128) |       ""       |  NULL   |         场次名称         |
|  child_id   |     int      |       0        |  NULL   |          场次ID          |
|   card_id   |     int      |       0        |  NULL   |          红包ID          |
| reward_type | varchar(16)  |       ""       |  NULL   |         奖励类型         |
|     sum     |     int      |       0        |  NULL   |     每日发放红包数量     |
|    unit     |     int      |       0        |  NULL   |       红包价值数值       |
|   ticket    |     int      |       10       |  NULL   |       兑换所需积分       |
|   status    | varchar(12)  |      "20"      |  NULL   | 红包状态;10:启用;20:下架 |
|  duration   |     int      |       0        |  NULL   |    疯抢时间(单位:分)     |
| start_time  | varchar(16)  |       ""       |  NULL   |       场次开始时间       |
|  end_time   | varchar(16)  |       ""       |  NULL   |       场次结束时间       |
| create_time |   datetime   |      NULL      |  NULL   |         创建时间         |
| modify_time |   datetime   |      NULL      |  NULL   |         修改时间         |

---

::: tip 【关键字段补充说明】
1、`child_id` 是对应的场次ID，如果值为`0`，那么该行数据为场次数据。*你可以理解为内连接方式表示`场次`和`红包`这种`一对多`的关系* \
2、`duration` 是表示对应场次开抢了，可以持续疯抢的时间长度，单位为：`分钟`
:::

---

## 示例

![表示例](http://img.tzf-foryou.com/img/20220311142007.png)

---

## DDL


```sql
CREATE TABLE `redpack` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `appid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'appid',
  `batch_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '场次名称',
  `child_id` int unsigned NOT NULL DEFAULT '0' COMMENT '场次ID',
  `card_id` int unsigned NOT NULL DEFAULT '0' COMMENT '卡片ID',
  `reward_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '奖励类型',
  `sum` int unsigned NOT NULL DEFAULT '0' COMMENT '库存',
  `unit` int unsigned NOT NULL DEFAULT '0' COMMENT '奖励数值',
  `ticket` int NOT NULL DEFAULT '10' COMMENT '门票积分',
  `status` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20' COMMENT '10:启用;20下架',
  `duration` int unsigned NOT NULL DEFAULT '0' COMMENT '持续时间',
  `start_time` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '红包开抢时间(EXP:14:00:00)',
  `end_time` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '红包结束时间(EXP:14:10:00)',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='红包配置表';
```

---

## 使用场景

> 管理后台

- `CommonController->updateStatus` 变更红包对应状态
- `RedpackService->batchUpdate` 更新红包场次信息
- `RedpackService->batchList` 获去场次列表
- `RedpackService->redpackUpdate` 更新红包信息
- `RedpackService->redpackList` 获取红包列表
- `RedpackService->detail` 获取红包详细信息
- `RedpackService->exDetail` 红包兑换详细信息

---

> 小程序客户端

- `RedpackService->rob` 抢红包
- `RedpackService->show` 展示红包详情页
- `RedpackService->radio` 广播中奖信息
- `RedpackService->click` 点击红包(记录点击情况)

---

> 定时任务

- `RedpackReset->execute` 查询红包配置重置每日的红包缓存库存