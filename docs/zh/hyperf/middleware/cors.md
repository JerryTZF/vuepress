---
sidebar: [
{text: '返回', link: '/zh/hyperf/hyperf-component.md'},
{text: '跨域中间件', link: '/zh/hyperf/middleware/cors.md'},
{text: '验证器中间件', link: '/zh/hyperf/middleware/validator.md'},
{text: '自定义全局中间件', link: '/zh/hyperf/middleware/overload.md'},
{text: '示例中间件', link: '/zh/hyperf/middleware/normal.md'},
]
sidebarDepth: 2

prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/middleware/validator.md

---


# 跨域中间件

::: tip
- 全局生效(HTTP服务)
- 全局中间件只可通过配置文件的方式来配置
:::

---

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: CorsMiddleware.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午2:52
 */

namespace App\Middleware;


use Hyperf\Context\Context;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * 跨域中间件
 * Class CorsMiddleware
 * @package App\Middleware
 */
class CorsMiddleware implements MiddlewareInterface
{
    /**
     * 跨域设置
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = Context::get(ResponseInterface::class);
        $response = $response->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Credential', 'true')
            ->withHeader('Access-Control-Allow-Headers', 'DNT,Keep-Alive,User-Agent,Cache-Control,Content-Type,Authorization');
        Context::set(ResponseInterface::class, $response);

        if ($request->getMethod() == 'OPTIONS') {
            return $response;
        }
        return $handler->handle($request);
    }
}
```

---

*挂载配置*

*config/autoload/middleware.php*

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
    'http' => [
        // 跨域中间件
        App\Middleware\CorsMiddleware::class,
        // 验证器中间件
        Hyperf\Validation\Middleware\ValidationMiddleware::class,
    ],
];

```
