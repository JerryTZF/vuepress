---
sidebar: 'auto'
prev: /zh/harvest/overview.md
next: /zh/harvest/mysql/field.md

---

# 基本原则

::: tip 【说明】
这里更多的是我在公司时，公司的 `DBA` 原则和我给同事定的一些规范；这些原则更多的是实践积累下来的，并不是完全根据理论去设计和要求。
:::

---

- 数据库的本质是存储，在非必要情况下，请勿大量使用数据库相关函数。
- 请仔细理解业务需求后，在进行判断数据库是否需要进行集群化，或者读写分离等；因为需要额外考虑主从同步延迟、数据一致性、分布式事务等。
- 单表数据量最好保持在千万左右，如果不止，请分表存储。
- 使用 `InnoDB`，字符集请尽量使用 `utf8mb4` ，对于火星文和 `emoji` 支持友好。
- 表名请勿使用驼峰命名(无论大小驼峰)，请尽量使用单词和 `_` 。
- 任一数据表请包含 `id(bigint unsigned)`、`create_time(datetime)`、`modify_time(datetime)` 字段；符合公司规范。
- 在无法预知后续可能有哪些字段时，可以在表中添加 `buffer` 冗余则断。
- 字段大小写不区分，这里尽量在程序中做到字段值不一致。