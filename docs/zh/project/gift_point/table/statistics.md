---
sidebarDepth: 2,
sidebar: [
{text: '返回', link: '/zh/project/gift_point/gift-point-db.md'},
{ text: '映射表', link: '/zh/project/gift_point/table/map.md'},
{ text: '积分统计表', link: '/zh/project/gift_point/table/statistics.md'},
{ text: '积分流水表', link: '/zh/project/gift_point/table/records.md'},
]

prev: /zh/project/gift_point/table/map.md
next: /zh/project/gift_point/table/records.md

---

# 积分统计表

## 字段及说明

|       field       |       Type       |    Default     |  Index  |         Desc         |
| :---------------: | :--------------: | :------------: | :-----: | :------------------: |
|        id         |       int        | auto_increment | PRIMARY |       自增主键       |
|       uuid        |   varchar(32)    |       ""       |   KEY   |         UUID         |
|       phone       |   varchar(16)    |       ""       |  NULL   |       小程序ID       |
|      amount       |       int        |       0        |  NULL   |       积分数值       |
|    is_expired     | enum('yes','no') |      "no"      |  NULL   | 该条统计积分是否失效 |
| expired_timestamp |       int        |       0        |  NULL   |    积分失效时间戳    |
|    create_time    |     datetime     |      NULL      |   KEY   |       创建时间       |
|    modify_time    |     datetime     |      NULL      |  NULL   |       修改时间       |


::: warning 【注意】
1、增加用户积分：\
该用户没有积分记录时，新增一条；有对应积分记录时，amount字段增加对应积分 \
2、扣减用户积分：\
优先扣减即将失效积分，对应行的数据的amount不够减时，跳到下一行再次进行扣减，详见：`PointService->deductPoints`
:::

## DDL

```sql
CREATE TABLE `user_statistics_N` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户ID',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户手机',
  `expired_timestamp` int NOT NULL DEFAULT '0' COMMENT '积分失效时间戳',
  `amount` int unsigned NOT NULL DEFAULT '0' COMMENT '失效期当日积分',
  `is_expired` enum('yes','no') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no' COMMENT '是否已经失效',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `uuid_index` (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户有效积分统计表';
```

::: tip
采用十表，将用户均匀分布到十张表中，规则：UUID倒数第四位是0~9，然后查询(更新)对应的数据表
:::

---

## 使用场景

> 积分底层工具封装

- `_Tool/User->getStatisticsTableByUuid` 根据 `UUID` 获取 对应的统计表

> 积分底层API

- `PointService->grantPoints` 增加用户积分
- `PointService->deductPoints` 扣减用户积分