---
sidebarDepth: 2,
sidebar: [
{text: '返回', link: '/zh/project/gift_point/gift-point-db.md'},
{ text: '映射表', link: '/zh/project/gift_point/table/map.md'},
{ text: '积分统计表', link: '/zh/project/gift_point/table/statistics.md'},
{ text: '积分流水表', link: '/zh/project/gift_point/table/records.md'},
]

prev: /zh/project/gift_point/table/walk-records.md
next: /zh/project/gift_point/table/statistics.md

---

# UUID与手机号映射表

---

## 字段与说明

|    field    |    Type     |    Default     |  Index  |   Desc   |
| :---------: | :---------: | :------------: | :-----: | :------: |
|     id      |     int     | auto_increment | PRIMARY | 自增主键 |
|    uuid     | varchar(32) |       ""       |   KEY   |   UUID   |
|    phone    | varchar(16) |       ""       |  NULL   | 手机号 |
| create_time |  datetime   |      NULL      |   KEY   | 创建时间 |
| modify_time |  datetime   |      NULL      |  NULL   | 修改时间 |

::: tip 【说明】
这里的phone和uuid是一个`一对多`的关系，即：多个平台(app_id)的不同uuid通过手机号，可以实现数据互通
:::


## DDL

```sql
CREATE TABLE `mapping_relation` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户ID',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户手机号',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `uuid_index` (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='UUID和手机号映射表';
```

## 使用场景

> 积分底层工具封装

- `_Tool/User->getUuidsByUuid` 根据 `UUID` 获取 `UUIDs` 集合
- `_Tool/User->setUuidAndPhoneMapping` 写入用户 `UUID` 和 `phone` 映射关系表


> 积分底层API

- `PointController->updateUserPoints` 查询用户是否有绑定手机号，以便添加手机号入参