---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-web.md
---

# 队列原子消费

::: tip
这里设置并行消费数为 `1` ，来实现原子性消费消息
:::

---

## 配置

```php
<?php

return [
    // ... 其他队列配置

    // 并行消费为1的特殊队列
    'limit-queue' => [
        // 使用驱动(这里我们使用Redis作为驱动。AMQP等其他自行更换)
        'driver'         => Hyperf\AsyncQueue\Driver\RedisDriver::class,
        // Redis连接信息
        'redis'          => [
            'pool' => 'default'
        ],
        // 队列前缀
        'channel'        => 'limit',
        // pop 消息的超时时间(详见：brPop)
        'timeout'        => 2,
        // 消息重试间隔(秒)
        // [注意]: 真正的重试时间为: retry_seconds + timeout = 7；实验所得
        'retry_seconds'  => 5,
        // 消费消息超时时间
        'handle_timeout' => 10,
        // 消费者进程数
        'processes'      => 1,
        // 并行消费消息数目
        'concurrent'     => [
            'limit' => 1,
        ],
    ],
];
```

## 消费进程配置

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/4/3 18:39
 * Author: JerryTian<tzfforyou@163.com>
 * File: LimitQueueProcess.php
 * Desc: 并行消费为1的队列(防止超卖、原子执行)
 */


namespace App\Process;

use Hyperf\AsyncQueue\Process\ConsumerProcess;
use Hyperf\Process\Annotation\Process;

#[Process(
    nums: 1,
    name: 'LimitQueueProcess',
    enableCoroutine: true,
    redirectStdinStdout: false
)]
class LimitQueueProcess extends ConsumerProcess
{
    protected $queue = 'limit-queue';
}
```

## 消费体

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/4/9 18:55
 * Author: JerryTian<tzfforyou@163.com>
 * File: OversoldJob.php
 * Desc:
 */


namespace App\Job;

// 该任务只能原子执行示例
use App\Constants\ErrorCode;
use App\Lib\_Log\Log;
use App\Model\Good;
use App\Model\SaleRecords;

class OversoldJob extends AbstractJob
{
    public function __construct(string $uniqueId, array $params)
    {
        parent::__construct($uniqueId, $params);
    }

    public function handle(): void
    {
        /** @var Good $dove */
        $dove = Good::query()->where(['g_name' => '德芙巧克力(200g)'])->first();
        if ($dove->g_inventory > 0) {
            (new SaleRecords([
                'gid'      => $dove->id,
                'order_no' => date('YmdHis') . uniqid(),
                'buyer'    => $this->uniqueId,
                'amount'   => $dove->g_price
            ]))->save();

            $dove->g_inventory -= 1;
            $dove->save();
            return;
        }

        Log::stdout()->warning('德芙巧克力(200g) 库存不足!!!');
    }
}
```

## 投递

```php
    #[GetMapping(path: "queue_lock")]
    public function rateLimit(): array
    {
        $driver = DriverFactory::getDriverInstance('limit-queue');
        $driver->push(new OversoldJob(uniqid(), []));
        return $this->result->getResult();
    }
```