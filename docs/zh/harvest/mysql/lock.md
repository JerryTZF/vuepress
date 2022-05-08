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


## 行锁

## 分布式锁

## 死锁