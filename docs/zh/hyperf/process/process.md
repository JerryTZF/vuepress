---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/redis/queue.md
---

# 自定义进程


::: tip
- 抛出异常会退出进程，会被Server重新拉起。建议所有的 `Exception` 全部捕获操作。
- 定时任务本质上也是自定义进程操作，但是它会对异常处理(需要监听异常事件)
:::

---

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2021/10/21 23:13
 * Author: JerryTian<tzfforyou@163.com>
 * File: ConsumerProcess.php
 * Desc:
 */

namespace App\Process;

use Hyperf\Contract\StdoutLoggerInterface;
use Hyperf\Process\AbstractProcess;
use Hyperf\Process\Annotation\Process;
use Hyperf\Process\ProcessManager;
use Hyperf\Utils\ApplicationContext;
use Swoole\Coroutine;

#[Process(
    nums: 1, // 进程数目
    name: 'ConsumerProcess',
    redirectStdinStdout: false,
    pipeType: 2,
    enableCoroutine: true // 进程内是否启用协程
)]
class ConsumerProcess extends AbstractProcess
{
    public function handle(): void
    {
        $index = 0;
        while (ProcessManager::isRunning()) {
            Coroutine::sleep(1);
            $index += 1;
            if ($index === 10) {
                throw new \Exception('主动抛出异常');
            }
        }
    }

    // 是否随着服务一起启动
    public function isEnable($server): bool
    {
        return true;
    }
}
```