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

prev: /zh/project/gift_point/table/task.md
next: /zh/project/gift_point/table/box-records.md
---

# 访问记录表

---

## 字段及说明

|    field    |    Type     |    Default     |  Index  |   Desc   |
| :---------: | :---------: | :------------: | :-----: | :------: |
|     id      |     int     | auto_increment | PRIMARY | 自增主键 |
|    date     | varchar(16) |       ""       |  NULL   |   日期   |
|   mobile    | varchar(16) |       ""       |  NULL   |  手机号  |
|    uuid     | varchar(32) |       ""       |  NULL   |   UUID   |
| create_time |  datetime   |      NULL      |  NULL   | 创建时间 |
| modify_time |  datetime   |      NULL      |  NULL   | 修改时间 |

---


---

## DDL

```sql
CREATE TABLE `browse` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `mobile` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `uuid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

---


## 使用场景

> 管理后台

- `IndexService->user` 统计浏览人数
- `UserService->statisstics` 用户详情页的访问(浏览)人数

---

> 小程序客户端

- `MyService->login` 每日第一次登录成功后，写入一次访问记录