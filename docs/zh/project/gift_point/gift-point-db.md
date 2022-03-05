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
**目录**
[[TOC]]

# 积分有礼数据库设计

::: tip 【说明】
积分有礼项目共包含：`积分有礼小程序后端`、`积分底层服务` \
所有的字符集均为：`utf8mb4` 、 `utf8mb4_unicode_ci`
:::

---

## 积分有礼小程序后端

### 管理员表

---

|    field    |     Type     |    Default     |  Index  |   Desc   |
| :---------: | :----------: | :------------: | :-----: | :------: |
|     id      |     int      | auto_increment | PRIMARY | 自增主键 |
|   account   | varchar(64)  |       ""       |  NULL   |   账户   |
|    token    | varchar(255) |       ""       |  NULL   |  token   |
|     pwd     | varchar(255) |       ""       |  NULL   |   密码   |
| create_time |   datetime   |      Null      |   KEY   | 创建时间 |
| modify_time |   datetime   |      Null      |  NULL   | 修改时间 |

---

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

### 用户表

---

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

### 轮播图表

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
当type=TASK时,这里是task表的外键
:::

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

### 金刚区表

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

### 红包配置表


### 任务配置表


