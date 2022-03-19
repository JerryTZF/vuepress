---
sidebar: [
{text: '返回', link: '/zh/hyperf/hyperf-component.md'},
{text: '跨域中间件', link: '/zh/hyperf/middleware/cors.md'},
{text: '验证器中间件', link: '/zh/hyperf/middleware/validator.md'},
{text: '自定义全局中间件', link: '/zh/hyperf/middleware/overload.md'},
{text: '自定义校验中间件', link: '/zh/hyperf/middleware/normal.md'},
]
sidebarDepth: 2

prev: /zh/hyperf/middleware/overload.md
next: /zh/hyperf/hyperf-component.md

---

# 自定义校验中间件

---

::: tip
这里是示例了一个在中间件中校验用户个人信息的功能，该用户存在则写入请求该用户的个人信息对象，方便业务逻辑调用。
:::

---

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2021/11/29 5:33 下午
 * Author: JerryTian<tzfforyou@163.com>
 * File: CheckUserIdMiddleware.php
 * Desc:
 */


namespace App\Middleware;

use App\Constants\ErrorCode;
use App\Model\User;
use Hyperf\Context\Context;
use Hyperf\HttpServer\Contract\RequestInterface;
use Hyperf\HttpServer\Contract\ResponseInterface as Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CheckUserIdMiddleware implements MiddlewareInterface
{
    protected RequestInterface $request;

    protected Response $response;

    public function __construct(RequestInterface $request, Response $response)
    {
        [$this->request, $this->response] = [$request, $response];
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $userID = $this->request->input('user_id');
        if ($userID == null) {
            return $this->response->json([
                'code'   => ErrorCode::USERID_EMPTY,
                'msg'    => ErrorCode::getMessage(ErrorCode::USERID_EMPTY),
                'status' => false,
                'data'   => []
            ]);
        }
        /** @var User $user */
        $user = User::where(['unique_code' => $userID])->first();
        if (null === $user) {
            return $this->response->json([
                'code'   => ErrorCode::USERID_EMPTY,
                'msg'    => ErrorCode::getMessage(ErrorCode::USERID_EMPTY),
                'status' => false,
                'data'   => []
            ]);
        } else {
            $request = Context::set(ServerRequestInterface::class, $request->withAttribute('user', $user));
            return $handler->handle($request);
        }
    }
}
```

---

::: danger 【需要关注的几个点】
- 示例中获取请求参数的 `$this->request` 为依赖注入 `ServerRequestInterface $request` 的一个实现，封装了一些额外方法，
这里使用 `$this->request` 只是为了方便读取 `user_id`。
- 这里一定要注意 `Hyperf` 对 `PSR-7` 的请求对象的实现和封装，要注意继承链。
- `ServerRequestInterface $request` 的所有 `withXxx` 方法均是对`$request` 对象的拷贝，所以要写入上下文后，重新注入 `handler` 方法。\
详情参见：[全局更改请求和响应对象](https://hyperf.wiki/2.2/#/zh-cn/middleware/middleware?id=%e5%85%a8%e5%b1%80%e6%9b%b4%e6%94%b9%e8%af%b7%e6%b1%82%e5%92%8c%e5%93%8d%e5%ba%94%e5%af%b9%e8%b1%a1)
:::