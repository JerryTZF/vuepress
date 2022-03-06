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
prev: /zh/project/gift_point/table/banner.md
next: /zh/project/gift_point/table/redpack.md
---

# 金刚区表

---

## 字段及说明

---

|    field    |     Type     |    Default     |  Index  |          Desc           |
| :---------: | :----------: | :------------: | :-----: | :---------------------: |
|     id      |     int      | auto_increment | PRIMARY |        自增主键         |
|    icon     | varchar(128) |       ""       |  NULL   |        图标地址         |
|    name     | varchar(32)  |       ""       |  NULL   |        图标名称         |
| target_type | varchar(32)  |       ""       |  NULL   |        跳转类型         |
|   target    |     text     |                |  NULL   |        跳转地址         |
|   status    | varchar(16)  |      "20"      |  NULL   | 10:上架;20:下架;30:删除 |
|    sort     |     int      |       0        |  NULL   |        排序权重         |
|   remark    | varchar(255) |       ""       |  NULL   |          备注           |
| create_time |   datetime   |      NULL      |   KEY   |        创建时间         |
| modify_time |   datetime   |      NULL      |  NULL   |        修改时间         |


---

## DDL

```sql
CREATE TABLE `kingkong` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20',
  `sort` int unsigned NOT NULL DEFAULT '0',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 使用场景


