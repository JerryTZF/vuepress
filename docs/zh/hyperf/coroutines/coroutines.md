---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md

---

# 协程

::: tip 【引言】
了解协程前，先了解下传统的`PHP-FPM` 的工作模式。`PHP-FPM` 本质上是一个进程管理器，实现了 `FastCGI` 协议。
当请求发送到 `Nginx` 或者 `Apache` 后，`Nginx` 通过 `FastCGI` 协议将请求转发给 `PHP-FPM` 处理，`PHP-FPM` fork对应的 `work`
进程来执行 `PHP` 脚本。执行完后回收该进程。整个过程是 `同步阻塞` 的。当大量请求并发请求时，创建的进程会非常多，并且创建、销毁进程占用资源是非常大的。同时，多进程下会产生大量的 `MySQL` 连接，此时数据库
也会产生瓶颈。

---

为了解决传统FPM的痛点，我们容易想到的是单个进程内开启多个线程来处理多个请求或者并发问题，但是从代码级别上来说，PHP并不支持多线程，其次，多线程
有许多问题需要额外考虑，多线程读写加锁问题(CPU调度)、锁的颗粒度、死锁问题、线程异常可能导致整个进程崩溃。那么，这时就可以采用 `协程` 来解决问题。

---
![swoole进程线程模型图](http://img.tzf-foryou.com/img/20220326191804.png)

:::

## 创建多个协程

```php
    // 异步创建多个协程
    private function _multipleCoroutines()
    {
        $cids = [];
        for ($i = 100; $i--;) {
            $cid = Coroutine::create(function () use ($i) {
                // 注意:虽然打印了日志,但是这里是不会执行的,
                // 因为是异步,主协程已经执行完了(没有协程切换)
                Log::stdout()->info("第{$i}个任务正在执行");
                Coroutine::sleep(mt_rand(0, 5));
            });
            array_push($cids, $cid);
        }

        // 除非这里阻塞,否则上面创建的协程不会执行
        Coroutine::sleep(5.0);

        $cids = json_encode($cids);
        Log::stdout()->info("子协程ID集合为: $cids");
    }
```

## 协程间通信

```php
    // 协程间通信
    private function _channel()
    {
        $ch = new Channel(10); // 缓冲管道(类似golang)
        for ($i = 10; $i--;) {
            Coroutine::create(function () use ($ch) {
                $random = mt_rand(1, 100);
                $ch->push($random);
            });
        }

        $sum = 0;
        while (true) {
            Coroutine::sleep(1.0); // 方便控制台查看
            if ($ch->isEmpty()) {
                Log::stdout()->warning('管道已经为空');
                break;
            }
            $data = $ch->pop(2.0);
            Log::stdout()->info("管道获取的数据为: $data");
            if ($data) {
                $sum += intval($data);
            } else {
                assert($ch->errCode === SWOOLE_CHANNEL_TIMEOUT);
                break;
            }
        }

        Log::stdout()->warning("管道pop数据总和为:   $sum");
    }
```

---

**错误的示例**

> 详细参见：[协程范式](https://wiki.swoole.com/#/coroutine/notice?id=%e7%bc%96%e7%a8%8b%e8%8c%83%e5%bc%8f)

```php
    // 协程间通信错误示例
    private function _channelErrorDemo()
    {
        $sum = 0;
        for ($i = 10; $i--;) {
            // 虽然这里不会出问题,但是不要引入一个引用类型的变量,因为这样修改
            // 该变量时,可能会存在错误. 全局变量更是不可以
            Coroutine::create(function () use (&$sum) {
                $random = mt_rand(1, 100);
                Log::stdout()->info("随机数为: $random");
                $sum += $random;
            });
        }

        Coroutine::sleep(5);

        Log::stdout()->warning("多个协程修改一个变量结果为:   $sum");

    }
```

## Parallel

```php
    // 主协程等待子协程全部结束,子协程并发执行
    private function _parallel()
    {
        $parallel = new Parallel(5);
        for ($i = 20; $i--;) {
            $parallel->add(function () {
                sleep(1);
                return Coroutine::id();
            });
        }
        try {
            $result = json_encode($parallel->wait(true), 256);
            Log::stdout()->info("协程返回的结果集为: $result");
        } catch (ParallelExecutionException | Exception $e) {
            Log::stdout()->error($e->getTraceAsString());
        }
    }
```

## 协程上下文

::: tip
- 同一个进程内协程间是内存共享的，但协程的执行/切换是非顺序的，对于数据的管理，希望数据在自己对应的协程内进行管理，其实就是
`协程上下文` 的管理。
- 下面的示例，是封装了结果集的封装，很好的使用说明了协程上下文的作用
:::

用法参考: [协程上下文工具类](https://hyperf.wiki/2.2/#/zh-cn/coroutine?id=%e5%8d%8f%e7%a8%8b%e4%b8%8a%e4%b8%8b%e6%96%87)

---

**使用示例**

---

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: Result.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午2:10
 */

namespace App\Lib\_Result;

use Hyperf\Context\Context;

// 协程结果集封装,支持链式调用,可以灵活的拼接出你想要的结果格式
class Result
{
    // 标准结果集
    const RESULT = [
        'code'   => 200,
        'msg'    => 'ok',
        'status' => true,
        'data'   => []
    ];

    // 上下文key
    private string $key = 'ResponseResult';

    // 获取标准的返回格式
    public function getResult(): array
    {
        return Context::getOrSet($this->key, self::RESULT);
    }

    // 重置返回结果对象
    public function resetResult(): Result
    {
        Context::set($this->key, self::RESULT);
        return $this;
    }

    // 设置错误码和错误信息
    public function setErrorInfo($errorCode, $errorInfo): Result
    {
        $isExist = Context::has($this->key);
        if ($isExist) {
            $value = Context::get($this->key);
        } else {
            $value = self::RESULT;
        }
        $value['code'] = $errorCode;
        $value['msg'] = $errorInfo;
        $value['status'] = false;
        Context::set($this->key, $value);

        return $this;
    }

    // 设置数据
    public function setData($data): Result
    {
        $isExist = Context::has($this->key);
        if ($isExist) {
            $value = Context::get($this->key);
        } else {
            $value = self::RESULT;
        }
        $value['data'] = $data;
        Context::set($this->key, $value);

        return $this;
    }

    // 添加额外Key-Value
    public function addKey($key, $values): Result
    {
        $isExist = Context::has($this->key);
        if ($isExist) {
            $value = Context::get($this->key);
        } else {
            $value = self::RESULT;
        }
        $value[$key] = $values;
        Context::set($this->key, $value);

        return $this;
    }
}
```
