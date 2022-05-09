---
sidebar: 'auto'
prev: /zh/harvest/overview.md

---

# 锁的使用

::: tip
我项主要从 `乐观锁`、`悲观锁`、`共享锁`、`排他锁`、`表锁`、`行锁` 等几个维度去解释和介绍我经常的使用场景。
:::

---

## 乐观锁

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


## 悲观锁

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

## 共享锁

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

## 排它锁

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

## 表锁

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


## 行锁

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





## 分布式锁

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



## 死锁

***是指两个或两个以上的进程在执行过程中,因争夺资源而造成的一种互相等待的现象,若无外力作用,它们都将无法推进下去。***