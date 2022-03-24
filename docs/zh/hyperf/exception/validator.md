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

prev: /zh/hyperf/exception/register.md
next: /zh/hyperf/exception/data-not-found.md

---

# 验证器异常处理

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: ValidationExceptionHandler.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午2:24
 */

namespace App\Exception\Handler;


use App\Constants\SysErrorCode;
use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Hyperf\Validation\ValidationException;
use Psr\Http\Message\ResponseInterface;
use Throwable;

/**
 * 数据验证异常处理
 * Class ValidationExceptionHandler
 * @package App\Exception\Handler
 */
class ValidationExceptionHandler extends ExceptionHandler
{
    /**
     * 异常接管处理
     * @param Throwable $throwable
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function handle(Throwable $throwable, ResponseInterface $response): ResponseInterface
    {
        // 禁止后续异常管理类接管
        $this->stopPropagation();

        /** @var ValidationException $throwable */
        $httpBody = $throwable->validator->errors()->first();

        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(422)->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::VALIDATE_ERROR,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::VALIDATE_ERROR) . $httpBody,
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }

    /**
     * 是否为数据验证失败类型异常
     * @param Throwable $throwable
     * @return bool
     */
    public function isValid(Throwable $throwable): bool
    {
        return $throwable instanceof ValidationException;
    }
}
```

---

## 抛出该异常的场景

::: tip
中间件中自定义验证器的 `make` 方法会抛出该异常，详见：[重写自定义验证器](/zh/hyperf/middleware/validator#重写自定义验证器) \
返回的状态码为 `422`
:::