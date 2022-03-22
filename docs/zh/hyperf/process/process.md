---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/redis/queue.md
---

# 自定义进程

::: warning 【规范】
系统(框架)提供的进程，如果不需要继承修改，请尽量放在配置文件中进行声明。我们应当遵循：
- 1、组件已提供对应进程且不需要自定义的，请在 `config/autoload/process.php` 中声明
- 2、自定义组件(业务需要)，应当在 `app` 目录下创建 `Process` 目录，且所有自定义进程文件放入其中，
  自定义进程使用 `注解` 方式声明。

即：系统(框架)进程在配置文件中声明；自定义进程使用 **注解** 声明。
:::



::: tip
- 抛出异常会退出进程，会被Server重新拉起。建议在自定义进程中，使用 `try-catch-finally` , 并且抛出自己定义的异常。
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