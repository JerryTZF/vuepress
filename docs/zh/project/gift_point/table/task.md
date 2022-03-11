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

prev: /zh/project/gift_point/table/redpack.md
next: /zh/project/gift_point/table/visit-records.md
---

# 任务配置表

---

## 字段及说明


|    field    |         Type          |    Default     |  Index  |           Desc            |
| :---------: | :-------------------: | :------------: | :-----: | :-----------------------: |
|     id      |          int          | auto_increment | PRIMARY |         自增主键          |
|    icon     |     varchar(128)      |       ""       |  NULL   |       任务图标地址        |
|    name     |      varchar(64)      |       ""       |  NULL   |         任务名称          |
|    flag     |      varchar(32)      |       ""       |  NULL   |      任务类型标志位       |
|   remark    |     varchar(255)      |       ""       |  NULL   |           备注            |
| reward_type | enum('积分','集分宝') |     "积分"     |  NULL   |       任务奖励类型        |
|   amount    |          int          |       0        |  NULL   |         发放数值          |
|  btn_desc   |     varchar(255)      |       ""       |  NULL   |         按钮文案          |
| target_type |      varchar(16)      |       ""       |  NULL   |         跳转类型          |
|   target    |         text          |      NULL      |  NULL   |         跳转地址          |
|   repeat    |          int          |       1        |  NULL   |      可重复执行次数       |
|    sort     |          int          |       0        |  NULL   |         排序权重          |
|   status    |      varchar(16)      |      "20"      |  NULL   | 任务状态(10:上架;20:下架) |
| create_time |       datetime        |      NULL      |  NULL   |         创建时间          |
| modify_time |       datetime        |      NULL      |  NULL   |         修改时间          |


---

## DDL

```sql
CREATE TABLE `task` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `flag` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `reward_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reward_type` enum('积分','集分宝') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '积分',
  `amount` int unsigned NOT NULL DEFAULT '0',
  `btn_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `repeat` int NOT NULL DEFAULT '1',
  `sort` int unsigned NOT NULL DEFAULT '0',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 使用场景

> 管理后台

- `CommonController->updateStatus` 变更任务对应状态
- `TaskService->update` 更新任务
- `TaskService->list` 任务列表
- `TaskService->detail` 某日任务详情
- `TaskService->finishDetail` 某日任务完成详情(每个用户)

---


> 小程序

- `BannerController->list` 完成任务类型的banner展示任务对应的信息
- `TaskService->finish` 完成任务
- `TaskService->click` 点击任务(统计用)
- `TaskService->list` 任务列表
