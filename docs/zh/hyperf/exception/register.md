---
sidebarDepth: 2
sidebar: [
{text: '返回', link: '/zh/hyperf/hyperf-component.md'},
{text: '注册异常处理器', link: '/zh/hyperf/exception/register.md'},
{text: '验证器异常处理', link: '/zh/hyperf/exception/validator.md'},
{text: '数据库未找到异常处理', link: '/zh/hyperf/exception/data-not-found.md'},
{text: '限流异常处理', link: '/zh/hyperf/exception/rate-limit.md'},
{text: 'HTTP异常处理', link: '/zh/hyperf/exception/http.md'},
{text: '全局异常处理', link: '/zh/hyperf/exception/global.md'},
]

prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/exception/validator.md

---

# 注册异常处理器

::: tip
最好按照`业务->系统`的顺序注册。
:::

---

::: danger
这里列举的异常处理器只能catch住 `http` 模块的异常，像 `定时任务`、`自定义进程`、`redis异步队列`等，
Hyperf 是通过触发事件的形式来进行通知！ 建议自己写监听器监听异常事件，可以做到心中有数 :smile:
:::


```php
<?php

declare(strict_types=1);
/**
 * This file is part of Hyperf.
 *
 * @link     https://www.hyperf.io
 * @document https://hyperf.wiki
 * @contact  group@hyperf.io
 * @license  https://github.com/hyperf/hyperf/blob/master/LICENSE
 */
return [
    'handler' => [
        'http' => [
            // 验证器类型错误处理
            App\Exception\Handler\ValidationExceptionHandler::class,
            // 数据库未找到数据异常处理
            App\Exception\Handler\ModelNotFoundExceptionHandler::class,
            // 全局HTTP异常处理
            Hyperf\HttpServer\Exception\Handler\HttpExceptionHandler::class,
            // 限流异常处理器
            App\Exception\Handler\RateLimitExceptionHandler::class,
            // 全局(框架)异常处理
            App\Exception\Handler\AppExceptionHandler::class,
        ],
    ],
];

```

## 编写自定义异常

::: tip
自定义异常可以更加方便直观的看出异常种类和定位问题！
:::

---

## 示例

*1、自定义进程异常退出时主动抛出*

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 14:26
 * Author: JerryTian<tzfforyou@163.com>
 * File: ProcessException.php
 * Desc:
 */


namespace App\Exception;

use Hyperf\Server\Exception\ServerException;
use Throwable;

class ProcessException extends ServerException
{
    public function __construct(int $code = 0, string $message = null, Throwable $previous = null)
    {
        if (is_null($message)) {
            $message = '当前进程发生异常';
        }

        parent::__construct($message, $code, $previous);
    }
}
```

---

*2、自定义定时任务异常时主动抛出*

::: tip
因为该组件底层捕获 `Exception` 异常，所以自定义异常也会被触发，从而触发 `FailToExecute` 事件
:::

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/3/22 15:53
 * Author: JerryTian<tzfforyou@163.com>
 * File: SchedulerException.php
 * Desc:
 */


namespace App\Exception;

use Hyperf\Server\Exception\ServerException;
use Throwable;

class SchedulerException extends ServerException
{
    public function __construct(int $code = 0, string $message = null, Throwable $previous = null)
    {
        if (is_null($message)) {
            $message = '定时任务发生异常';
        }

        parent::__construct($message, $code, $previous);
    }
}
```