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

prev: /zh/hyperf/exception/data-not-found.md
next: /zh/hyperf/exception/http.md

---

# 限流异常处理器

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2021/12/21 11:39 上午
 * Author: JerryTian<tzfforyou@163.com>
 * File: RateLimitExceptionHandler.php
 * Desc:
 */


namespace App\Exception\Handler;

use App\Constants\SysErrorCode;
use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Hyperf\RateLimit\Exception\RateLimitException;
use Psr\Http\Message\ResponseInterface;
use Throwable;

/**
 * 限流异常处理器
 * Class RateLimitExceptionHandler
 * @package App\Exception\Handler
 */
class RateLimitExceptionHandler extends ExceptionHandler
{
    public function handle(Throwable $throwable, ResponseInterface $response): ResponseInterface
    {
        // 禁止异常冒泡
        $this->stopPropagation();

        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(200)->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::BUSY,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::BUSY),
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }

    public function isValid(Throwable $throwable): bool
    {
        return $throwable instanceof RateLimitException;
    }
}
```

---

## 抛出该异常的场景

```php
// 完成任务
    #[PostMapping(path: "finish.json")]
    #[Middleware(CheckUserIdMiddleware::class)]
    #[RateLimit(create: 10, consume: 2, capacity: 60)]
    public function finish(): array
    {
        $appID = $this->request->input('app_id');
        $userID = $this->request->input('user_id');
        $taskID = $this->request->input('id');
        /** @var User $userInfo */
        $userInfo = $this->request->getAttribute('user');

        return $this->service->finish($appID, $userID, $taskID, $userInfo);
    }
```

---

::: tip
当限流被触发时, 默认会抛出 `Hyperf\RateLimit\Exception\RateLimitException` 异常
:::