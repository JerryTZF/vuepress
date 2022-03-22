---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/process/process.md

---

# 定时任务

::: tip

- `Hyperf` 定时任务本质上是 `Swoole` 拉起的一个进程，并且随着 `Hyperf` 服务启动而启动(可以配置)
- 集群模式下请保证不会重复执行，一般情况下，集群模式，定时任务或消息队列会统一管理 :smile:
- 这里采用 `多进程` 模式，协程模式暂未使用，不好总结
:::

## 配置开启

*config/autoload/crontab.php*

```php
<?php

return [
    // 是否开启定时任务(随着服务启动而启动)
    'enable' => true,
];
```

---

## 定时任务进程

*config/autoload/processes.php*

```php
<?php

return [
    Hyperf\Crontab\Process\CrontabDispatcherProcess::class,
];
```

---

## 定义任务

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/1/5 2:30 下午
 * Author: JerryTian<tzfforyou@163.com>
 * File: demoCrontab.php
 * Desc:
 */


namespace App\Crontab;

use App\Lib\_Log\Log;
use Hyperf\Crontab\Annotation\Crontab;

#[Crontab(
    name: "HeartBeatCheck",
    rule: "0 * * * *",
    callback: "execute",
    memo: "测试任务",
    enable: false // 当时字符串时，例如: 'isEnable',会执行当前类对应方法,判断是否执行该定时任务
)]
class demoCrontab
{
    public function execute(): void
    {
        Log::stdout()->info('crontab process is running :)');
    }
    
    public function isEnable(): bool
    {
        return (env('app_env', 'dev') === 'pro');
    }
}
```

---
::: warning

- 注解字段请参考：[任务属性](https://hyperf.wiki/2.2/#/zh-cn/crontab?id=%e4%bb%bb%e5%8a%a1%e5%b1%9e%e6%80%a7)
- 注意在注解定义时，规则存在 `\` 符号时，需要进行转义处理，即填写 `*\/5 * * * * *`
:::

---

## 执行失败

> 组件提供了 `FailToExecute` 事件，编写对应的监听器即可。

```php
<?php

declare(strict_types=1);

namespace App\Listener;

use Hyperf\Crontab\Event\FailToExecute;
use Hyperf\Event\Annotation\Listener;
use Hyperf\Event\Contract\ListenerInterface;
use Psr\Container\ContainerInterface;

#[Listener]
class FailToExecuteCrontabListener implements ListenerInterface
{
    public function listen(): array
    {
        return [
            FailToExecute::class,
        ];
    }

    /**
     * @param FailToExecute $event
     */
    public function process(object $event)
    {
        var_dump($event->crontab->getName());
        var_dump($event->throwable->getMessage());
    }
}

```