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

prev: /zh/project/gift_point/gift-point-db.md
next: /zh/project/gift_point/table/user.md
---

# 管理员表

---

## 字段及说明

|    field    |     Type     |    Default     |  Index  |   Desc   |
| :---------: | :----------: | :------------: | :-----: | :------: |
|     id      |     int      | auto_increment | PRIMARY | 自增主键 |
|   account   | varchar(64)  |       ""       |  NULL   |   账户   |
|    token    | varchar(255) |       ""       |  NULL   |  token   |
|     pwd     | varchar(255) |       ""       |  NULL   |   密码   |
| create_time |   datetime   |      Null      |   KEY   | 创建时间 |
| modify_time |   datetime   |      Null      |  NULL   | 修改时间 |

---

::: tip 【说明】
1、每次管理员登陆均会刷新token并写入对应字段，即：同一管理员在不同设备登录，前一台设备会自动登出。\
2、`pwd`字段才用md5加密处理。
:::

---

## DDL

```sql
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '账户',
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `pwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `create_time` datetime DEFAULT NULL,
  `modify_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;
```

---

## 使用场景

- `CheckTokenMiddleware` 中间件校验
- `LoginService` 校验管理员是否存在