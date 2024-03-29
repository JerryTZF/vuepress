---
sidebar: 'auto'
sidebarDepth: 3

prev: /zh/harvest/overview.md

---

# mysql

## 基本原则

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

---

## 字段原则

- `id` 必须是主键，每个表必须有主键，且保持增长趋势的，小型系统可以依赖于 `MySQL` 的自增主键，大型系统或者需要分库分表时才使用内置的 `ID` 生成器。
- 字段尽量使用 `DEFAULT NOT NULL`，应该给该字段类型的一个默认值。
- `create_time` 和 `modify_time` 最好使用 `datetime`，一个是时间长度比 `timestamp` 长一些，其次我们不应该让数据库自己写入当前时间，而是程序写入。
- 定长字段请使用 `char`，例如用户的唯一ID，一般是指定长度且唯一。
- 枚举类型字段使用 `enum`，且不应该是 `10`、`20`...这种，应该是具体的意义的字段，例如：`active`、`freeze`、`ban`。
- `varchar` 是可变长字符串，不预先分配存储空间，长度不要超过5000，如果存储长度大于此值，定义字段类型为 `text`，独立出来一张表，用主键来对应，避免影响其它字段索引效率。
- 小数类型为`decimal`，禁止使用 `float` 和 `double`；会存在精度丢失问题。

### 整形
```text
- `TINYINT`
    - 1字节
    - 长度范围: -2^7 (-127) ~ 2^7-1 (127) 或者 0 ~ 2^8 (255)
- `SMALLINT`
    - 2字节
    - 长度范围: -2^15 (-32768) ~ 2^15-1 (32767) 或者 0 ~ 2^16-1 (65535)
- `MEDIUMINT`
    - 3字节
    - 长度范围: -2^31 (-8388608) ~ 2^23-1 (8388607) 或者 0 ~ 2^24-1 (16777215)
- `INT`
    - 4字节
    - 长度范围: -2^31 (-2147483648) ~ 2^31-1 (2147483647) 或者 0 ~ 2^32-1 (4294967295)
- `BIGINT`
    - 8字节
    - 长度范围: -2^63 (-9223372036854775808) ~ 2^63-1 (9223372036854775807) 或者 0 ~ 2^64-1 (18446744073709551615)
```
- 根据业务判断是否是 `unsigned`，无负数时，使用该约束。
- 设置长度(int(11)或者int(4))并无明显意义，只是影响显示位宽，因为类型已经决定了可以表示的数值的大小。
- 时间需要比较大小或者有索引时，可以使用 `int` 类型 表示时间戳，较早前会这么设计。

### 字符串类型

- 固定长度使用 `char` ;非固定长度使用 `varchar` 。
- `VARCHAR`: 最大长度为65532个字节，Exp: varchar(20)指的是20字符，无论存放的是数字、
  字母还是UTF8汉字，都可以存放20个，最大大小是65532字节。
- `CHAR`: char最多可以存放255个字节，Exp: char(20)指的是20字符，无论存放的是数字、
  字母还是UTF8汉字，都可以存放20个，最大大小是255字节。

::: tip
utf8编码中，一个英文字符等于一个字节，一个中文（含繁体）等于三个字节；utf8mb4字符集中一个汉字占4个字节
:::

---

## 索引原理及原则

::: tip
`索引` 本质上是一种数据结构，符合特定的算法，维护了数据表字段与查寻条件之间的关系。
:::

---

### 1、索引的分类

- 数据结构角度: `B-TREE`、`HASH`、`FULLTEXT`、`R-TREE`
- 物理存储角度: 聚簇索引、非聚簇索引
- 按照逻辑角度: 主键索引、唯一索引、普通索引、组合索引、全文索引

### 2、索引与引擎关系

|   索引    |            InnoDb             |            MyISAAM            |            MEMORY             |
| :-------: | :---------------------------: | :---------------------------: | :---------------------------: |
|   BTREE   |      :white_check_mark:       |      :white_check_mark:       |      :white_check_mark:       |
|   HASH    | :negative_squared_cross_mark: | :negative_squared_cross_mark: |      :white_check_mark:       |
|   RTREE   | :negative_squared_cross_mark: |      :white_check_mark:       | :negative_squared_cross_mark: |
| FULL-TEXT |      :white_check_mark:       |      :white_check_mark:       | :negative_squared_cross_mark: |

### 3-1、B-TREE

![](http://img.tzf-foryou.com/img/20220501181954.jpg)

---

> 持有的属性：
>
> M: 子节点个数(本图中M=3)
>
> N: 关键字的个数n满足：ceil(m/2)-1 <= n <= m-1

---

模拟查找关键字29的过程:

1. 根据根节点找到磁盘块1，读入内存。【磁盘I/O操作第1次】
2. 比较关键字29在区间（17,35），找到磁盘块1的指针P2。
3. 根据P2指针找到磁盘块3，读入内存。【磁盘I/O操作第2次】
4. 比较关键字29在区间（26,30），找到磁盘块3的指针P2。
5. 根据P2指针找到磁盘块8，读入内存。【磁盘I/O操作第3次】
6. 在磁盘块8中的关键字列表中找到关键字29。

::: tip 【总结】
分析上面过程，发现需要3次磁盘 `I/O` 操作，和3次内存查找操作。
由于内存中的关键字是一个有序表结构，可以利用二分法查找提高效率。
而3次磁盘 `I/O` 操作是影响整个 `B-Tree` 查找效率的决定因素。
`B-Tree` 相对于 `AVLTree缩` 减了节点个数，使每次磁盘 `I/O` 取到内存的数据都发挥了作用，从而提高了查询效率。
相比二叉搜索树，高度/深度更低，自然查询效率更高。
:::

---

### 3-2、B+TREE

![](http://img.tzf-foryou.com/img/20220501183038.jpg)

---

**B+Tree相对于B-Tree有几点不同：**

- 非叶子节点只存储键值信息。
- 所有叶子节点之间都有一个链指针
- 数据记录都存放在叶子节点中

---

通常在B+Tree上有两个头指针，一个指向根节点，另一个指向关键字最小的叶子节点，而且所有叶子节点(即数据节点)之间是一种链式环结构。
因此可以对B+Tree进行两种查找运算：一种是对于主键的范围查找和分页查找，另一种是从根节点开始，进行随机查找。
B+Tree的查询效率更加稳定。由于B+Tree只有叶子节点保存key信息，查询任何key都要从root走到叶子，所以更稳定。

---

::: tip
从二叉查找树过渡到B树，有一个显著的变化就是，一个节点可以存储多个数据了，相当于一个磁盘块里边可以存储多个数据，大大减少了我们的 `I/O` 次数 !!!
:::

---

### 3-3、HASH

![](http://img.tzf-foryou.com/img/20220501183528.jpg)

---

简单地说，***哈希索引就是采用一定的哈希算法***，把键值换算成新的哈希值，检索时不需要类似B+树那样从根节点到叶子节点逐级查找，只需一次哈希算法即可立刻定位到相应的位置，速度非常快。

---

**和B-tree区别:**

- 如果是***等值查询***，那么哈希索引明显有绝对优势，因为只需要经过一次算法即可找到相应的键值；当然了，这个前提是，键值都是唯一的。如果键值不是唯一的，就需要先找到该键所在位置，然后再根据链表往后扫描，直到找到相应的数据。
- 从示意图中也能看到，如果是范围查询检索，这时候哈希索引就毫无用武之地了，因为原先是有序的键值，经过哈希算法后，有可能变成不连续的了，就没办法再利用索引完成范围查询检索。
- 哈希索引也没办法利用索引完成排序，以及 `like 'xxx%'` 这样的部分模糊查询(这种部分模糊查询，其实本质上也是范围查询)。
- 哈希索引也不支持多列联合索引的最左匹配规则。
- B+树索引的关键字检索效率比较平均，不像B树那样波动幅度大，在有大量重复键值情况下，哈希索引的效率也是极低的，因为存在所谓的哈希碰撞问题。
- 在MySQL中，只有 `HEAP/MEMORY` 引擎表才能显式支持哈希索引(NDB也支持，但这个不常用)

### 3-4、聚簇索引

将数据存储与索引放到了一块，找到索引也就找到了数据。操作是在内存里面，不用回行操作。详见: [聚簇索引](https://www.jianshu.com/p/fa8192853184)

---
### 3-5、非聚簇索引

![](http://img.tzf-foryou.com/img/20220501184329.png)

---
- InnoDB使用的是聚簇索引，将主键组织到一棵B+树中，而行数据就储存在叶子节点上，若使用 `"where id = 14"` 这样的条件查找主键，则按照B+树的检索算法即可查找到对应的叶节点，之后获得行数据。
- 若对Name列进行条件搜索，则需要两个步骤：第一步在辅助索引B+树中检索Name，到达其叶子节点获取对应的主键。第二步使用主键在主索引B+树种再执行一次B+树检索操作，最终到达叶子节点即可获取整行数据。(重点在于通过其他键需要建立辅助索引)
- MyISM使用的是非聚簇索引，非聚簇索引的两棵B+树看上去没什么不同，节点的结构完全一致只是存储的内容不同而已，主键索引B+树的节点存储了主键，辅助键索引B+树存储了辅助键。表数据存储在独立的地方，这两颗B+树的叶子节点都使用一个地址指向真正的表数据，对于表数据来说，这两个键没有任何差别。由于索引树是独立的，通过辅助键检索无需访问主键的索引树。
---

### 3-6、主键索引

- 主键索引必定是唯一索引，但是唯一索引不一定是主键索引。
- 一张表只能有一个主键，不能为空。
- 用于快速索引，参考上面的 `聚簇索引` 中使用主键的操作。
- 常见用于外键约束。

---

### 3-7、唯一索引

- 可以起到约束列数据写入不能重复，且提高了索引的效率，使索引更有价值。

---

### 3-8、普通索引

- 普通索引就是普通索引 :confused:
- 最好用于 `order by` 、`group by` 、`where column=x` 、`select * from T1 LEFT JOIN T2 ON T1.C1=T2.C2` ，在巧不在多。
- 大量数据添加修改索引时还是建议删掉索引后操作数据，然后再为其添加索引。

### 3-9、组合索引

- 为多列添加索引，可以使得在多个查询条件的时候匹配更加迅速。
- 组合索引的区分度最好是从大到小，可以第一次索引就筛除大部分数据。
- 要求最左原则。

---

## 索引原理及原则

::: tip
我项主要从 `乐观锁`、`悲观锁`、`共享锁`、`排他锁`、`表锁`、`行锁` 等几个维度去解释和介绍我经常的使用场景。
:::

### 乐观锁

本质上是 `修改前判断`。属于业务层面的锁机制，并非由数据库引擎支持。

```sql
select `version`, `good_id` from `good` where `sku` = '德芙巧克力(200g)';
update `good` set `count` = `count` + 1, `version` = `version` + 1 where `good_id` = #{good_id} and `version` = #{version}
```

***示例：***

```php
    #[GetMapping(path: "optimistic_locking")]
    public function optimisticLock(): array
    {
        /** @var Good $goodInfo */
        $good = Db::table('good')
            ->where(['g_name' => '红富士苹果'])
            ->select(['id', 'version', 'g_price'])
            ->first();
        $rows = Db::table('good')
            ->where(['id' => $good->id, 'version' => $good->version])
            ->where('g_inventory', '>', 0)
            ->decrement('g_inventory', 1, ['version' => (string)(intval($good->version) + 1)]);

        if ($rows !== 0) {
            (new SaleRecords([
                'gid'      => $good->id,
                'order_no' => date('YmdHis') . uniqid(),
                'buyer'    => uniqid(),
                'amount'   => $good->g_price
            ]))->save();

            return $this->result->getResult();
        }

        // 未更新成功可以进行自旋处理,这里不举例了
        [$e, $m] = [ErrorCode::INVENTORY_ERR, ErrorCode::getMessage(ErrorCode::INVENTORY_ERR)];
        return $this->result
            ->setErrorInfo($e, $m)
            ->getResult();
    }
```

---

::: danger 【注意】
- 一般不会用到关系型数据库提供的所能力，属于业务级别锁。
- 如果一个变量V初次读取的时候是A值，并且在准备赋值的时候检查到它仍然是A值，那我们就能说明它的值没有被其他线程修改过了吗？
  很明显是不能的，因为在这段时间它的值可能被改为其他值，然后又改回A，那 `CAS` 操作就会误认为它从来没有被修改过。
  这个问题被称为 `CAS` 操作的 `ABA` 问题。
:::

---

### 悲观锁

> 在关系数据库管理系统里，悲观并发控制（又名“悲观锁”，Pessimistic Concurrency Control，缩写“PCC”）是一种并发控制的方法。
它可以阻止一个事务以影响其他用户的方式来**修改数据**。如果一个事务执行的操作都某行数据应用了锁，那只有当这个事务把锁释放，其他事务才能够执行与该锁冲突的操作。

> 悲观并发控制主要用于数据争用激烈的环境，以及发生并发冲突时使用锁保护数据的成本要低于回滚事务的成本的环境中。在对任意记录进行修改前，先尝试为该记录加上排他锁（exclusive locking）。
如果加锁失败，说明该记录正在被修改，那么当前查询可能要等待或者抛出异常。 具体响应方式由开发者根据实际需要决定。如果成功加锁，那么就可以对记录做修改，事务完成后就会解锁了。其间如果有其他对该记录做修改或加排他锁的操作，都会等待我们解锁或直接抛出异常。

---

::: tip 【说明】
- 基于数据库引擎实现，修改前先锁定，修改后释放的思路来处理数据竞争。
- 锁住之后根据是否可读又可以分为 `共享锁` 和 `排它锁` (下面会解释举例)。
- `悲观锁` 是一种思想，并非一种物理实现的锁机制，所以和它对立思路的是 `乐观锁`。
:::

---

### 共享锁

- 允许不同事务(多个线程)之前共享加锁读取，但不允许其它事务修改或者加入排他锁。
- 如果有修改必须等待一个事务提交完成，才可以执行，容易出现死锁，请务必考虑超时处理和事务提交或回滚。


```sql
# 默认开启自动提交
SET autocommit=0;
# 0.开始事务
start transaction;
# 1.查询出商品信息 | 其他事务都可以读取该行数据,只有持有锁的事务提交或回滚,那么当前事务才可修改
select status from t_goods where id=1 lock in share mode; # 
# 2.根据商品信息生成订单
insert into t_orders (id,goods_id) values (null,1);
# 3.修改商品status为2
update t_goods set status=2 where id=1;
# 4.提交事务
commit;
# InnoDB使用锁是基于索引的，用到索引是会锁定行，反之锁表
# 效率不高，并发非常大的话会导致锁的竞争
```

---

***示例：***

```php
    #[GetMapping(path: "share_mode_lock")]
    public function shareModeLock(): array
    {
        try {
            Db::beginTransaction();
            /** 上共享锁 @var Good $dove */
            $dove = Good::where(['g_name' => '德芙巧克力(200g)'])->sharedLock()->first();
            // 库存是否充足
            if ($dove->g_inventory > 0) {
                // 插入记录表购买记录
                (new SaleRecords([
                    'gid'      => $dove->id,
                    'order_no' => date('YmdHis') . uniqid(),
                    'buyer'    => uniqid(),
                    'amount'   => $dove->g_price
                ]))->save();
                // 扣减库存
                $dove->g_inventory -= 1;
            } else {
                // 库存不足,提交事务,释放共享锁
                Db::commit();
                [$e, $m] = [ErrorCode::INVENTORY_ERR, ErrorCode::getMessage(ErrorCode::INVENTORY_ERR)];
                return $this->result->setErrorInfo($e, $m)->getResult();
            }
            // 更新数据
            $dove->save();
            // 提交事务,释放共享锁
            Db::commit();
        } catch (\Exception $e) {
            // 回滚,释放共享锁
            Db::rollBack();
            return $this->result->setErrorInfo($e->getCode(), $e->getMessage())->getResult();
        }

        return $this->result->getResult();
    }
```

---

### 排它锁

- 事务之间不允许其它排他锁或共享锁读取，修改更不可能。
- 一次只能有一个排他锁执行 `commit` 或 `rollback` 之后，其它事务才可执行。

---

***示例：***

```php
    #[GetMapping(path: "for_update_lock")]
    public function forUpdateLock(): array
    {
        try {
            Db::beginTransaction();
            /** @var Good $dove */
            $dove = Good::query()->where(['g_name' => '德芙巧克力(200g)'])->lockForUpdate()->first();

            if ($dove->g_inventory > 0) {
                (new SaleRecords([
                    'gid'      => $dove->id,
                    'order_no' => date('YmdHis') . uniqid(),
                    'buyer'    => uniqid(),
                    'amount'   => $dove->g_price
                ]))->save();

                $dove->g_inventory -= 1;
            } else {
                Db::commit();
                [$e, $m] = [ErrorCode::INVENTORY_ERR, ErrorCode::getMessage(ErrorCode::INVENTORY_ERR)];
                return $this->result->setErrorInfo($e, $m)->getResult();
            }
            $dove->save();
            Db::commit();
        } catch (\Exception $e) {
            Db::rollBack();
            return $this->result->setErrorInfo($e->getCode(), $e->getMessage())->getResult();
        }
        return $this->result->getResult();
    }
```

---

### 表锁
相对其他数据库而言，MySQL的锁机制比较简单，其最 显著的特点是不同的存储引擎支持不同的锁机制。
比如，`MyISAM` 和 `MEMORY` 存储引擎采用的是表级锁（`table-level locking`）；
`BDB` 存储引擎采用的是页面锁（`page-level locking`），但也支持表级锁；
`InnoDB` 存储引擎既支持行级锁（`row-level locking`），也支持表级锁，但默认情况下是采用行级锁。

- 表级锁：开销小，加锁快；不会出现死锁；锁定粒度大，发生锁冲突的概率最高，并发度最低。
- 行级锁：开销大，加锁慢；会出现死锁；锁定粒度最小，发生锁冲突的概率最低，并发度也最高。
- 页面锁：开销和加锁时间界于表锁和行锁之间；会出现死锁；锁定粒度界于表锁和行锁之间，并发度一般。

> **加锁节点**：MyISAM在执行查询语句（SELECT）前，会自动给涉及的所有表加读锁，在执行更新操作（UPDATE、DELETE、INSERT等）前，
会自动给涉及的表加写锁，这个过程并不需要用户干预，因此用户一般不需要直接用LOCK TABLE命令给MyISAM表显式加锁(除非模拟事务等操作)。
但是这个节点也是有参数更改，但是更改后就不再是这个表的特色了。。。

> **MyISAM锁的调度**：首先达成共识，MyISAM的读锁和写锁是互斥的(读的时候不能写，写的时候不能读)，读锁是串行的(读取的时候允许读)。
但是！！！一个读操作先到，一个写操作后到（之前没有被锁定），写锁也会插队到读锁前面先获取锁，然后读操作就要等着。。。
所以对于有大量写操作的业务，还是不用MyISAM引擎。因为，大量的更新操作会造成查询操作很难获得读锁，从而可能永远阻塞。

---

### 行锁

**InnoDB支持行级锁、事务，这里就InnoBD描述。由于行锁的颗粒度小，会造成脏读、重复读等问题，这里也是ACID中隔离性体现的地方。**

**InnoDB实现了排它锁(X)、共享锁(S)的行级锁。**

- 排它锁(X)：允许一个事务去读一行，阻止其他事务获得相同数据集的排他锁
- 共享锁(S)：允许获取排他锁的事务更新数据，阻止其他事务取得相同的数据集共享读锁和排他写锁。

---

**另外，为了允许行锁和表锁共存，实现多粒度锁机制，InnoDB还有两种内部使用的 `意向锁`（Intention Locks），这两种意向锁都是表锁。
当一个事务对表加了 `意向排他锁` 时，另外一个事务在加锁前就会通过该表的 `意向排他锁` 知道前面已经有事务在对该表进行独占操作，从而等待。**
- 意向共享锁(IS)：事务打算给数据行共享锁，事务在给一个数据行加共享锁前必须先取得该表的IS锁。
- 意向排他锁(IX)：事务打算给数据行加排他锁，事务在给一个数据行加排他锁前必须先取得该表的IX锁。

|        | **X** | **IX** | **S** | **IS** |
| :----: | :---: | :----: | :---: | :----: |
| **X**  | 冲突  |  冲突  | 冲突  |  冲突  |
| **IX** | 冲突  |  兼容  | 冲突  |  兼容  |
| **S**  | 冲突  |  冲突  | 兼容  |  兼容  |
| **IS** | 冲突  |  兼容  | 兼容  |  兼容  |

*如果一个事务请求的锁模式与当前的锁兼容，InnoDB就请求的锁授予该事务；反之，如果两者两者不兼容，该事务就要等待锁释放*。

---

::: tip
InnoDB行锁是通过索引上的索引项来实现的，这一点ＭySQL与Oracle不同，后者是通过在数据中对相应数据行加锁来实现的。
InnoDB这种行锁实现特点意味者：**只有通过索引条件检索数据，InnoDB才会使用行级锁，否则，InnoDB将使用表锁！**
:::

---

### 分布式锁

顾名思义，分布式锁是指在分布式场景下，保证同一时刻对共享数据只能被一个应用的一个线程操作。用来保证共享数据的安全性和一致性。

***需要满足的需求***

- 首先最基本的，我们要保证同一时刻只能有一个应用的一个线程可以执行加锁的方法，或者说获取到锁；（一个应用线程执行）
- 然后我们这个分布式锁可能会有很多的服务器来获取，所以我们一定要能够高性能的获取和释放；（高性能）
- 不能因为某一个分布式锁获取的服务不可用，导致所有服务都拿不到或释放锁，所以要满足高可用要求；（高可用）
- 假设某个应用获取到锁之后，一直没有来释放锁，可能服务本身已经挂掉了，不能一直不释放，导致其他服务一直获取不到锁；（锁失效机制，防止死锁）
- 一个应用如果成功获取到锁之后，再次获取锁也可以成功；（可重入性）
- 在某个服务来获取锁时，假设该锁已经被另一个服务获取，我们要能直接返回失败，不能一直等待。（非阻塞特性）

---

我自己一般使用[Redis](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Lib/_Lock/RedisLock.php)来作为分布式锁的实现。当然 `ZK` 等也可以实现。

---

这篇[文章](https://www.cnblogs.com/heiz123/p/15979113.html)我觉着写的不错，可以参考。


---

### 死锁

***是指两个或两个以上的进程在执行过程中,因争夺资源而造成的一种互相等待的现象,若无外力作用,它们都将无法推进下去。***
