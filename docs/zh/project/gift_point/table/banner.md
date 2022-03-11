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

prev: /zh/project/gift_point/table/user.md
next: /zh/project/gift_point/table/kingkong.md
---

# 轮播图表

---

## 字段及说明

---

|    field    |         Type          |    Default     |  Index  |          Desc           |
| :---------: | :-------------------: | :------------: | :-----: | :---------------------: |
|     id      |          int          | auto_increment | PRIMARY |        自增主键         |
|    image    |     varchar(255)      |       ""       |  NULL   |        图片地址         |
|    type     | enum('NORMAL','TASK') |    "NORMAL"    |  NULL   |       轮播图类型        |
| target_type |      varchar(32)      |       ""       |  NULL   |        跳转类型         |
|   target    |     varchar(255)      |       ""       |  NULL   |        跳转地址         |
|   status    |      varchar(16)      |      "20"      |  NULL   | 10:上架;20:下架;30:删除 |
|    sort     |          int          |       0        |  NULL   |        排序权重         |
|   task_id   |          int          |       0        |  NULL   |         任务ID          |
|   remark    |     varchar(255)      |       ""       |  NULL   |          备注           |
| create_time |       datetime        |      NULL      |   KEY   |        创建时间         |
| modify_time |       datetime        |      NULL      |  NULL   |        修改时间         |

::: warning 【注意】
当type=TASK时,task_id字段是task表的外键。 \
当type=NORMAL时，task_id字段为0
:::

---

## DDL

---

```sql
CREATE TABLE `banner` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `type` enum('NORMAL','TASK') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NORMAL',
  `target_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20',
  `sort` int unsigned NOT NULL DEFAULT '0',
  `task_id` int unsigned NOT NULL DEFAULT '0' COMMENT '当type=''TASK''时,这里是task表的外键',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 使用场景

> 管理后台

- `CommonController->updateStatus` 变更轮播图状态
- `BannerService->updateBanner` 更新轮播图
- `BannerService->normalBannerList` 非任务类型轮播图列表
- `BannerService->taskBannerList` 任务类型轮播图列表

---

> 小程序客户端

- `BannerController->list` 轮播图列表