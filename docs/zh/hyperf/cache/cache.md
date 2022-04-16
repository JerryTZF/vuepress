---
sidebar: 'auto'
sidebarDepth: 3
prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/file/file.md

---

# 缓存使用

::: tip 【说明】
- 该组件基于[AOP](https://hyperf.wiki/2.2/#/zh-cn/aop)，可以理解为Python的`装饰器`。执行方法前后先执行其他代码。
- 使用有两种方式，一种是简单使用，获取实例存储、读取、删除等；另一种是通过注解，切入要缓存的方法，读取时直接走缓存。
:::

---

## 封装代理类

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/25 11:24
 * Author: JerryTian<tzfforyou@163.com>
 * File: Cache.php
 * Desc:
 */


namespace App\Lib\_Cache;

use Hyperf\Cache\Listener\DeleteListenerEvent;
use Hyperf\Di\Annotation\Inject;
use Hyperf\Utils\ApplicationContext;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\SimpleCache\CacheInterface;

class Cache
{
    #[Inject]
    protected EventDispatcherInterface $dispatcher;

    // 获取实例
    public static function getInstance(): CacheInterface
    {
        return ApplicationContext::getContainer()->get(CacheInterface::class);
    }

    // 静态调用
    public static function __callStatic($action, $args)
    {
        return self::getInstance()->$action(...$args);
    }

    // 清除缓存
    public function flush(string $listener, array $args)
    {
        $this->dispatcher->dispatch(new DeleteListenerEvent($listener, $args));
    }
}
```

---

## 简单调用

```php
    #[PostMapping(path: "cache")]
    public function simpleCache(): array
    {
        $cache = Cache::getInstance();

        // 一般对于缓存,Key里面会加入一些变量,那么可以将Key写入枚举类
        $key = sprintf(CacheKeys::IS_USER_LOGON, 'YOUR_APPID', 'USER_ID');
        // 一次写入单个缓存
        $cache->set($key, ['a' => 'b'], 300);
        // 读取单个缓存
        $cacheData = $cache->get($key, '');
        // 一次写入多个缓存(具有原子性)
        $cache->setMultiple(['key1' => 'value1', 'key2' => 'value2'], 300);
        // 一次读取多个缓存
        $multipleData = $cache->getMultiple(['key1', 'key2'], []);

        // 清除所有的key
        $cache->clear();

        return $this->result->setData([
            'single'   => $cacheData,
            'multiple' => $multipleData
        ])->getResult();
    }
```

---

## 注解使用

::: warning 【注意】
- 这里只是示例 `Cacheable` 注解；`CachePut` 、 `CacheEvict` 不常用也比较简单，就不列举。
- 注解中的 `value` 参数不是缓存的值，而是缓存的key！这里一定要注意
:::

```php
    // 这里生成缓存的KEY是: "c:admin:Jerry_12345678"
    #[Cacheable(prefix: "admin", ttl: 300, value: "#{account}_#{uuid}", listener: "UPDATE-ADMIN-INFO")]
    public function getAdminInfo(string $account, string $uuid = '12345678'): array
    {
        $adminInfo = Admin::query()->where(['account' => $account])->firstOrFail();
        return $adminInfo->toArray();
    }

    public function updateAdminInfo(string $account, string $password): array
    {
        /** @var Admin $adminInfo */
        $adminInfo = Admin::query()->where(['account' => $account])->firstOrFail();
        $adminInfo->pwd = $password; // 模型中有修改器，所以无需加密
        $adminInfo->save();

        // 刷新缓存
        (new Cache())->flush('UPDATE-ADMIN-INFO', [
            'account' => $account,
            'uuid'    => '12345678'
        ]);

        return $this->result->getResult();
    }
```