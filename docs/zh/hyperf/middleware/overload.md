---
sidebar: [
{text: '返回', link: '/zh/hyperf/hyperf-component.md'},
{text: '跨域中间件', link: '/zh/hyperf/middleware/cors.md'},
{text: '验证器中间件', link: '/zh/hyperf/middleware/validator.md'},
{text: '自定义全局中间件', link: '/zh/hyperf/middleware/overload.md'},
{text: '自定义校验中间件', link: '/zh/hyperf/middleware/normal.md'},
]
sidebarDepth: 2

prev: /zh/hyperf/middleware/validator.md
next: /zh/hyperf/middleware/normal.md

---

# 自定义全局中间件

::: danger 【注意】
1、作为服务端对外统一返回`json`是正常和常规的操作，所以对于 `5xx` 、 `404` 、 `405` 、 `422` 等非业务异常返回数据，应该也封装成`json`
返回。 \
2、这里是重写了 `Hyperf` 的核心中间件的 `handleNotFound`(404) 、 `handleMethodNotAllowed`(405) 方法。 \
3、因为是重写 `Hyperf` 核心中间件，所以需要在核心类替换的声明配置中，显示声明替换关系。
:::

---

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: CoreMiddleware.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午2:01
 */

namespace App\Middleware;

use App\Constants\SysErrorCode;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class CoreMiddleware
 * @package App\Middleware
 * 自定义全局中间件
 */
class CoreMiddleware extends \Hyperf\HttpServer\CoreMiddleware
{
    /**
     * 404自定义
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     */
    protected function handleNotFound(ServerRequestInterface $request): ResponseInterface
    {
        return $this->response()->withHeader('Content-Type', 'application/json')
            ->withStatus(404)->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::ROUTE_NOT_FOUND,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::ROUTE_NOT_FOUND),
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }

    /**
     * 405自定义
     * @param array $methods
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     */
    protected function handleMethodNotAllowed(array $methods, ServerRequestInterface $request): ResponseInterface
    {
        return $this->response()->withHeader('Content-Type', 'application/json')
            ->withStatus(405)->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::HTTP_METHOD_ERR,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::HTTP_METHOD_ERR),
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }
}
```

---

*显示声明替换关系*

*config/autoload/dependencies.php*

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
    Hyperf\HttpServer\CoreMiddleware::class => App\Middleware\CoreMiddleware::class
];

```