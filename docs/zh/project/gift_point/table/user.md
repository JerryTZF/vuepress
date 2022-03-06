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

prev: /zh/project/gift_point/table/admin.md
next: /zh/project/gift_point/table/banner.md
---

# 用户表

---

## 字段及说明


|     field     |       Type        |    Default     |   Index    |            Desc             |
| :-----------: | :---------------: | :------------: | :--------: | :-------------------------: |
|      id       |        int        | auto_increment |  PRIMARY   |          自增主键           |
|     uuid      |    varchar(32)    |       ""       | UNIQUE KEY |        豪斯莱唯一ID         |
|     appid     |    varchar(32)    |       ""       |    KEY     |         用户来源ID          |
|   inviteid    |        Int        |       0        |    NULL    |          邀请者ID           |
|    is_read    |   enum('0','1')   |      "0"       |    NULL    |      是否阅读相关协议       |
|  unique_code  |   varchar(128)    |       ""       | UNIQUE KEY |      小程序平台唯一ID       |
|     nick      |    varchar(64)    |       ""       |    NULL    |          平台昵称           |
|    gender     | enum('0','1','2') |      "0"       |    NULL    |      0:未知;1:男;2:女       |
|    avatar     |   varchar(128)    |       ""       |    NULL    |          平台头像           |
|   password    |   varchar(128)    |       ""       |    NULL    |            密码             |
|    address    |   varchar(255)    |       ""       |    NULL    |            地址             |
|   birthday    |    varchar(16)    |       ""       |    NULL    |            生日             |
|    mobile     |    varchar(16)    |       ""       |    KEY     |           手机号            |
|     rank      |    varchar(16)    |       10       |    KEY     | 10:游客;20:注册;30:授权手机 |
|    status     |      tinyint      |       10       |    KEY     |   10:可用;20:冻结;30:删除   |
| register_time |     datetime      |      NULL      |    NULL    |          授权时间           |
|  modify_info  |    varchar(64)    |       ""       |    NULL    |          修改说明           |
|  create_time  |     datetime      |      NULL      |    KEY     |          创建时间           |
|  modify_time  |     datetime      |      NULL      |    NULL    |          修改时间           |

---


## DDL 

```sql
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `uuid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '8102202007022142549970' COMMENT '豪斯莱平台ID；8102xxxxxxxx9970',
  `appid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户来源平台',
  `inviteid` int NOT NULL DEFAULT '0' COMMENT '邀请者ID',
  `is_read` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '是否阅读相关协议',
  `unique_code` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '不同平台唯一码',
  `nick` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '平台昵称',
  `gender` enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '0:未知;1:男;2:女',
  `avatar` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户头像地址',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户地址(国省市区)',
  `birthday` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户生日',
  `mobile` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户手机',
  `rank` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '10' COMMENT '用户身份(10:游客|20:已注册|30:已留手机号)',
  `status` tinyint NOT NULL DEFAULT '10' COMMENT '用户状态(10:可用;20:冻结;30:删除)',
  `modify_info` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '该用户信息更改说明',
  `register_time` datetime DEFAULT NULL COMMENT '注册时间',
  `create_time` datetime DEFAULT NULL COMMENT '生成时间',
  `modify_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_index` (`unique_code`) USING BTREE COMMENT '唯一码索引',
  UNIQUE KEY `uuid_index` (`uuid`) USING BTREE,
  KEY `status_index` (`status`) USING BTREE COMMENT '状态索引',
  KEY `mobile_index` (`mobile`) USING BTREE,
  KEY `group_index` (`appid`,`rank`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT COMMENT='积分系统应用层用户信息表';
```

---

## 使用场景