---
sidebarDepth: 2,
sidebar: [
{text: '返回', link: '/zh/project/gift_point/gift-point-db.md'},
{ text: '映射表', link: '/zh/project/gift_point/table/map.md'},
{ text: '积分统计表', link: '/zh/project/gift_point/table/statistics.md'},
{ text: '积分流水表', link: '/zh/project/gift_point/table/records.md'},
]

prev: /zh/project/gift_point/table/statistics.md
next: /zh/project/gift_point/gift-point-db.md

---

# 积分流水表

---

## 字段及说明

|     field     |     Type     |    Default     |  Index  |      Desc      |
| :-----------: | :----------: | :------------: | :-----: | :------------: |
|      id       |     int      | auto_increment | PRIMARY |    自增主键    |
|     uuid      | varchar(32)  |       ""       |   KEY   |      UUID      |
|     phone     | varchar(16)  |       ""       |  NULL   |    小程序ID    |
|    task_id    | varchar(16)  |       ""       |  NULL   |   任务编号ID   |
|     flag      | varchar(32)  |       ""       |  NULL   |   流水标志位   |
|    app_id     | varchar(16)  |       ""       |  NULL   | 流水来源APPID  |
| record_points |     int      |       0        |  NULL   |  积分记录积分  |
| transfer_info | varchar(128) |       ""       |  NULL   |  积分变更说明  |
| expired_time  |     int      |       0        |  NULL   | 积分失效时间戳 |
|  create_time  |   datetime   |      NULL      |   KEY   |    创建时间    |
|  modify_time  |   datetime   |      NULL      |  NULL   |    修改时间    |


## DLL

```sql
CREATE TABLE `user_transfer_record_N` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户ID',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户手机号',
  `task_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '任务/活动编号',
  `flag` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '活动/任务类型',
  `app_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '积分变化来源App',
  `record_points` int NOT NULL DEFAULT '0' COMMENT '积分记录积分',
  `transfer_info` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '积分变更说明',
  `expired_time` int NOT NULL DEFAULT '0' COMMENT '该积分失效时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `uuid_index` (`uuid`) USING BTREE COMMENT '用户ID索引',
  KEY `task_index` (`task_id`) USING BTREE COMMENT '任务编号索引',
  KEY `expired_index` (`expired_time`) USING BTREE COMMENT '失效时间索引',
  KEY `create_index` (`create_time`) USING BTREE COMMENT '创建时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户积分变更记录表';
```

---

::: tip
采用十表，将用户均匀分布到十张表中，规则：UUID倒数第四位是0~9，然后查询(更新)对应的数据表
:::


## 使用场景

- `PointService->queryUserRecords` 查询用户积分变更记录
- `Tool/User->setUserTransferRecord` 查询用户积分变更记录