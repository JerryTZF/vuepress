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
prev: /zh/hyperf/exception/validator.md
next: /zh/hyperf/exception/rate-limit.md

---

# 数据库未找到异常处理器

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: ModelNotFoundExceptionHandler.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午2:33
 */

namespace App\Exception\Handler;


use App\Constants\SysErrorCode;
use Hyperf\Database\Model\ModelNotFoundException;
use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Psr\Http\Message\ResponseInterface;
use Throwable;

/**
 * 模型(数据库)未找到异常
 * Class ModelNotFoundExceptionHandler
 * @package App\Exception\Handler
 */
class ModelNotFoundExceptionHandler extends ExceptionHandler
{
    /**
     * 异常接管处理
     * @param Throwable $throwable
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function handle(Throwable $throwable, ResponseInterface $response): ResponseInterface
    {
        // 禁止异常冒泡
        $this->stopPropagation();

        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(200)->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::MODEL_NOT_FOUND,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::MODEL_NOT_FOUND),
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }

    /**
     * 是否为数据数据未找到类型异常
     * @param Throwable $throwable
     * @return bool
     */
    public function isValid(Throwable $throwable): bool
    {
        return $throwable instanceof ModelNotFoundException;
    }
}
```

---

## 抛出该异常场景

::: tip
`$userInfo = Model::query()->where(['user_name' => 'Jerry'])->firstOrFail();` 当未找到对应数据行时，会抛出 `ModelNotFoundException` 异常。
:::