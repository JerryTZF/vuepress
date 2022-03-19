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
prev: /zh/hyperf/exception/http.md
next: /zh/hyperf/hyperf-component.md

---

# 全局异常处理器

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

namespace App\Exception\Handler;

use App\Constants\SysErrorCode;
use App\Lib\_Log\Log;
use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Psr\Http\Message\ResponseInterface;
use Throwable;

class AppExceptionHandler extends ExceptionHandler
{
    public function handle(Throwable $throwable, ResponseInterface $response): ResponseInterface
    {
        // CLI异常输出
        Log::stdout()->error(sprintf('%s[%s] in %s', $throwable->getMessage(), $throwable->getLine(), $throwable->getFile()));
        Log::stdout()->error($throwable->getTraceAsString());

        // DISK异常记录
        $errorInfo = sprintf('发生系统异常:%s;行号为:[%s];文件为:[%s]', $throwable->getMessage(), $throwable->getLine(), $throwable->getFile());
        Log::get('AppExceptionHandler@handle')->error($errorInfo);

        return $response->withHeader('Content-Type', 'application/json')
            ->withHeader('Server', 'Hyperf')
            ->withStatus(500)
            ->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::SYSTEM_ERROR,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::SYSTEM_ERROR),
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }

    public function isValid(Throwable $throwable): bool
    {
        return true;
    }
}

```

---

::: danger
所有的异常处理器均未捕获异常时，此异常处理器会捕获异常，此时为 `不可控` 异常，需要打印日志进行记录分析！！！
:::