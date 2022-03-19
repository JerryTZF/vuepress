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