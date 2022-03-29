---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/redis/queue-warning.md
---

# 异步队列

::: warning 【注意】
- 该组件只是提供异步、延迟能力，并不支持 `ack` 应答机制。
- 角色可以分为：消息体(逻辑实现)、消费者(消费进程)、投递者(这里我单独封装了)
- 重启服务导致消费中的消息执行不完整，请参考：[安全关闭](https://hyperf.wiki/2.2/#/zh-cn/async-queue?id=%e5%ae%89%e5%85%a8%e5%85%b3%e9%97%ad)

具体的问题详见：[FQA](/zh/hyperf/redis/queue-warning.md)
:::


---

## 配置

*config/autoload/async_queue.php*

```php
<?php

return [
    // 自定义队列进程的队列名称
    'redis-queue' => [
        // 使用驱动(这里我们使用Redis作为驱动。AMQP等其他自行更换)
        'driver'         => Hyperf\AsyncQueue\Driver\RedisDriver::class,
        // Redis连接信息
        'redis'          => [
            'pool' => 'default'
        ],
        // 队列前缀
        'channel'        => 'queue',
        // pop 消息的超时时间(详见：brPop)
        'timeout'        => 2,
        // 消息重试间隔(秒)
        // [注意]: 真正的重试时间为: retry_seconds + timeout = 7；实验所得
        'retry_seconds'  => 5,
        // 消费消息超时时间
        'handle_timeout' => 3,
        // 消费者进程数
        'processes'      => 1,
        // 并行消费消息数目
        'concurrent'     => [
            'limit' => 10,
        ],
    ],
];
```


---

## 自定义消费进程

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 16:19
 * Author: JerryTian<tzfforyou@163.com>
 * File: AsyncQueueProcess.php
 * Desc:
 */


namespace App\Process;

use Hyperf\Process\Annotation\Process;

#[Process(
    nums: 1,
    name: 'AsyncQueueProcess',
    enableCoroutine: true,
    redirectStdinStdout: false
)]
class AsyncQueueProcess extends \Hyperf\AsyncQueue\Process\ConsumerProcess
{
    // 这里的队列名称请和配置文件对应的队列名称保持一致
    protected $queue = 'redis-queue';
}
```

---

## 定义消费体

::: danger 【注意】
- 消息体定义了消费者进程执行该任务所应该执行的逻辑。
- 下面示例的`$uniqueId`，是因为入参完全一致的情况下，投递多个会覆盖之前的消息(可以理解为Redis多次set，会覆盖对应的值)。
- 消息体应该实现对应的抽象类，而不是直接声明消息体，可以很好的约束所有消息体都符合对应的规范。
- 消息体不应该包含较大的对象实例，因为会序列化投递Redis，太大可能会失败。
:::

---

*抽象消费体*

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 16:27
 * Author: JerryTian<tzfforyou@163.com>
 * File: AbstractJob.php
 * Desc:
 */


namespace App\Job;

use Hyperf\AsyncQueue\Job;

abstract class AbstractJob extends Job
{
    /**
     * 最大尝试次数(max = $maxAttempts+1)
     * @var int
     */
    public $maxAttempts = 2;

    /**
     * 任务编号(传递编号相同任务会被覆盖!)
     * @var string
     */
    public string $uniqueId;

    /**
     * 消息参数
     * @var array
     */
    public array $params;

    public function __construct(string $uniqueId, array $params)
    {
        [$this->uniqueId, $this->params] = [$uniqueId, $params];
    }

    // 子类去实现逻辑
    public function handle()
    {
    }
}
```

---

*具体实现消费体*

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 16:31
 * Author: JerryTian<tzfforyou@163.com>
 * File: ConsumerJob.php
 * Desc:
 */


namespace App\Job;

use App\Lib\_Log\Log;
use Hyperf\Utils\Coroutine;

// 自定义消息体
class ConsumerJob extends AbstractJob
{
    public function __construct(string $uniqueId, array $params)
    {
        parent::__construct($uniqueId, $params);
    }

    // 模拟消息体消费超时
    public function handle()
    {
        // 模拟任务耗时3秒
        // 当配置中的 handle_timeout = 3 时，可以看到我们的消息体需要执行4秒，所以该消息一定会超时，
        // 被放入timeout队列，但是看控制台可以看到开始、进行中、结束，所以：超时不一定是失败！！！
        Coroutine::sleep(1);
        Log::stdout()->info("任务ID:{$this->uniqueId}--开始");
        Coroutine::sleep(2);
        Log::stdout()->info("任务ID:{$this->uniqueId}--进行中");
        Coroutine::sleep(1);
        Log::stdout()->info("任务ID:{$this->uniqueId}--结束");
    }
}
```

---

## 封装投递类

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 16:25
 * Author: JerryTian<tzfforyou@163.com>
 * File: DriverFactory.php
 * Desc:
 */


namespace App\Lib\_RedisQueue;

use Hyperf\AsyncQueue\Driver\DriverInterface;
use Hyperf\Utils\ApplicationContext;
use Hyperf\AsyncQueue\Driver\DriverFactory as HyperfDriverFactory;

class DriverFactory
{
    /**
     * 获取指定队列实例
     * @param string $queueName
     * @return DriverInterface
     */
    public static function getDriverInstance(string $queueName): DriverInterface
    {
        return ApplicationContext::getContainer()->get(HyperfDriverFactory::class)->get($queueName);
    }
}
```

---

## 自定义监听器

::: danger
组件提供了一些关键的事件，用于监听，这里我们封装一下自己的事件监听器 :smile:
:::

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 16:56
 * Author: JerryTian<tzfforyou@163.com>
 * File: AsyncRedisQueueListener.php
 * Desc:
 */


namespace App\Listener;

use App\Lib\_Log\Log;
use Hyperf\AsyncQueue\Event\FailedHandle;
use Hyperf\AsyncQueue\Event\QueueLength;
use Hyperf\AsyncQueue\Event\RetryHandle;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;

#[Listener]
class AsyncRedisQueueListener implements ListenerInterface
{
    public function listen(): array
    {
        return [
            // 队列长度信息事件
            QueueLength::class,
            // 消费失败事件
            FailedHandle::class,
            // 重试消息事件
            RetryHandle::class
        ];

        // 任务如果符合"幂等性"，那么可以开启
        // "Hyperf\AsyncQueue\Listener\ReloadChannelListener::class" 监听器
        // 作用是：自动将 timeout 队列中消息移动到 waiting 队列中，等待下次消费
    }


    public function process(object $event)
    {
        switch (get_class($event)) {
            case "Hyperf\AsyncQueue\Event\QueueLength":
                $message = sprintf('队列:%s;长度:%s', $event->key, $event->length);
                foreach (['debug' => 10, 'info' => 50, 'warning' => 500] as $lv => $value) {
                    if ($event->length < $value) {
                        Log::stdout()->{$lv}($message);
                        Log::get('AsyncRedisQueueListener@QueueLength')->{$lv}($message);
                        break;
                    }
                }

                if ($event->length >= $value) {
                    Log::get('AsyncRedisQueueListener@QueueLength')->error($message);
                }
                break;
            case "Hyperf\AsyncQueue\Event\FailedHandle":
                [$msg, $trace] = ['消息最终消费失败,原因为:' . $event->getThrowable()->getMessage(), $event->getThrowable()->getTrace()];
                Log::get('AsyncRedisQueueListener@FailedHandle')->error($msg, $trace);
                Log::stdout()->error($msg);
                break;
            case "Hyperf\AsyncQueue\Event\RetryHandle":
                [$msg, $trace] = ['消息正在重试,原因为:' . $event->getThrowable()->getMessage(), $event->getThrowable()->getTrace(),];
                Log::get('AsyncRedisQueueListener@RetryHandle')->warning($msg, $trace);
                Log::stdout()->warning($msg);
                break;
            default:
                var_dump($event);
        }
    }
}
```

## 调用示例

> 这里示例的是在另一个自定义进程中向队列中投递，当然常见的是 `HttpServer` 中

---

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 14:24
 * Author: JerryTian<tzfforyou@163.com>
 * File: ConsumerProcess.php
 * Desc:
 */


namespace App\Process;

use App\Exception\ProcessException;
use App\Hook\ConsumerProcessFailEvent;
use App\Job\ConsumerJob;
use App\Job\ErrorDemoJob;
use App\Lib\_RedisQueue\DriverFactory;
use Hyperf\Di\Annotation\Inject;
use Hyperf\Process\AbstractProcess;
use Hyperf\Process\Annotation\Process;
use Hyperf\Process\ProcessManager;
use Hyperf\Utils\Coroutine;
use Psr\EventDispatcher\EventDispatcherInterface;

#[Process(
    nums: 1,
    name: 'ConsumerProcess',
    enableCoroutine: true,
    redirectStdinStdout: false
)]
class ConsumerProcess extends AbstractProcess
{
    #[Inject]
    protected EventDispatcherInterface $dispatcher;

    public function handle(): void
    {
        $index = 0;
        try {
            while (ProcessManager::isRunning()) {
                $index += 1;
                Coroutine::sleep(1);
                if ($index > 300000) {
                    throw new ProcessException(500, '自定义进程异常抛出测试');
                }
                if ($index === 1) {
                    for ($i = 100; $i--;) {
                        // 向异步队列中投递消息
                        $driver = DriverFactory::getDriverInstance('redis-queue');
                        $driver->push(new ConsumerJob((string)$i, [$i]));
                    }
                }
            }
        } catch (ProcessException $e) {
            $this->dispatcher->dispatch(new ConsumerProcessFailEvent($e, 'ConsumerProcess'));
        } catch (\Exception $e) {
            var_dump($e->getMessage());
        }
    }

    public function isEnable($server): bool
    {
        return env('APP_ENV', 'dev') === 'dev';
    }
}
```

---

::: tip
- 超时不意味着失败
    - 在消费的过程中，只要是超过了配置的超时时间，该消息就会被投递至timeout队列，但是会依然执行，直到异常退出或者正常退出
    - 如果能够保证消息的幂等性(多次调用和单次调用不会影响业务逻辑处理)，那么可以开启ReloadChannelListener监听器，该监听器会将timeout队列内的消息重新放回waiting队列，等待再次被执行。(默认不开启ReloadChannelListener监听器，即：超时任务需要自己处理)
- 先超时后失败，则不会触发重试机制(已经投递至超时队列，失败队列没哟消息，所以无法重试)
- 先失败后超时，会触发重试机制
- 并不是说是个队列就可以做类似秒杀等场景，因为队列也可以同时消费多个消息
- 集群模式下，请一定注意不要别的消费者消费走，最好集群模式使用专业MQ
:::
