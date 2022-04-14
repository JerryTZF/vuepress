---
sidebar: 'auto'
sidebarDepth: 3
---

# websocket和http合并

::: tip 【需求】
- 在 `Http` 服务中使用 `Websocket` 服务。
- 使用同一个域名同一个端口。通过路由进行区分不同服务。
- 详情参见：[websocket](https://github.com/JerryTZF/hyperf-demo/blob/main/app/Controller/WebSocketController.php)
:::

## 安装依赖

```shell
composer require hyperf/websocket-server
```

## 添加配置

```php
<?php

declare(strict_types=1);

use Hyperf\Server\Event;
use Hyperf\Server\ServerInterface;
use Swoole\Constant;

return [
    'mode'      => SWOOLE_PROCESS,
    'servers'   => [
        [
            'name'      => 'http',
            'type'      => ServerInterface::SERVER_HTTP,
            'host'      => '0.0.0.0',
            'port'      => 9501,
            'sock_type' => SWOOLE_SOCK_TCP,
            'callbacks' => [
                Event::ON_REQUEST => [Hyperf\HttpServer\Server::class, 'onRequest'],
            ],
        ],
        [
            'name'      => 'ws',
            'type'      => ServerInterface::SERVER_WEBSOCKET,
            'host'      => '0.0.0.0',
            'port'      => 9502,
            'sock_type' => SWOOLE_SOCK_TCP,
            'callbacks'  => [
                Event::ON_HAND_SHAKE => [Hyperf\WebSocketServer\Server::class, 'onHandShake'],
                Event::ON_MESSAGE    => [Hyperf\WebSocketServer\Server::class, 'onMessage'],
                Event::ON_CLOSE      => [Hyperf\WebSocketServer\Server::class, 'onClose']
            ]
        ]
    ],
    'settings'  => [...],
    'callbacks' => [...],
];

```

## 添加路由

```php
<?php

declare(strict_types=1);

use Hyperf\HttpServer\Router\Router;

// 首页
Router::addRoute(['GET', 'POST', 'HEAD'], '/', 'App\Controller\IndexController@index');

// WS服务
Router::addServer('ws', function () {
    Router::get('/ws', 'App\Controller\WebSocketController');
});
Router::get('/favicon.ico', function () {
    return '';
});

```

## 回调

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2022/4/14 14:17
 * Author: JerryTian<tzfforyou@163.com>
 * File: WebSocketController.php
 * Desc:
 */


namespace App\Controller;

use App\Lib\_Log\Log;
use Hyperf\Contract\OnCloseInterface;
use Hyperf\Contract\OnMessageInterface;
use Hyperf\Contract\OnOpenInterface;
use Hyperf\Utils\Arr;
use Swoole\Http\Request;
use Swoole\Websocket\Frame;

class WebSocketController implements OnMessageInterface, OnOpenInterface, OnCloseInterface
{

    public function onClose($server, int $fd, int $reactorId): void
    {
        Log::stdout()->warning("fd:{$fd};reactorId:{$reactorId} 已经关闭");
    }

    public function onMessage($server, Frame $frame): void
    {
        Log::stdout()->info("已收到{$frame->fd}号请求,发送数据为: {$frame->data}");
        $server->push($frame->fd, "已收到{$frame->fd}号请求,发送数据为: {$frame->data}");
    }

    public function onOpen($server, Request $request): void
    {
        $token = Arr::get($request->get, 'token', '');
        // 添加你自己的校验 【注意】本应该在handshake里面实现,这里偷一下懒 :(
        if ($token === 'joker') {
            $server->push($request->fd, "{$request->fd}号已经连接成功");
        } else {
            $server->close($request->fd);
        }
    }
}
```

## 更改Dockerfile

```dockerfile
# 暴露WS端口,其他内容无需修改
EXPOSE 9502
```

## 编写stack.yml

```yaml
version: "3.5"

services:
  hyperf:
    image: registry.cn-shenzhen.aliyuncs.com/xxx/hyperf-demo:v1.0.0
    networks:
      - proxy
    deploy:
      mode: global
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      placement:
        constraints:
          - "node.role==manager"
      labels:
        # 请注意这里的HTTP和WS服务是如何定义的,会影响traefik的发现.
        - "traefik.enable=true"
        - "traefik.http.routers.hyperf.rule=Host(`hyperf.xxxx.xyz`)"
        - "traefik.http.routers.hyperf.entrypoints=websecure"
        - "traefik.http.routers.hyperf.tls.certresolver=le"
        - "traefik.http.services.hyperf.loadbalancer.server.port=9501"
        - "traefik.ws.routers.hyperf-ws.rule=Host(`hyperf.xxxx.xyz`)"
        - "traefik.ws.routers.hyperf-ws.entrypoints=ws"
        - "traefik.ws.routers.hyperf-ws.tls.certresolver=le"
        - "traefik.ws.services.hyperf-ws.loadbalancer.server.port=9502"

networks:
  proxy:
    external: true
```

---

::: danger 【注意】
这里使用 `Traefik` 对服务进行反代，关于 `Traefki` 细节晚些我会写一个专题进行介绍，这里贴一下我的 `Traefik` 服务配置。:sunglasses:

---

```yaml
version: "3.5"

services:
  traefik-proxy:
    image: traefik:v2.3.4
    command:
      - "--api"
      - "--accesslog=true"
      # Docker swarm configuration
      - "--providers.docker.endpoint=unix:///var/run/docker.sock"
      - "--providers.docker.swarmMode=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=proxy"
      # Configure entrypoint
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      # SSL configuration
      - "--certificatesresolvers.le.acme.httpchallenge=true"
      - "--certificatesresolvers.le.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.le.acme.email=tzfforyou@gamil.com"
      - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
      # Global HTTP -> HTTPS
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
    networks:
      - proxy
    ports:
      - target: 80
        published: 80
        protocol: tcp
        mode: host
      - target: 443
        published: 443
        protocol: tcp
        mode: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-certificates:/letsencrypt
    deploy:
      mode: global
      update_config:
        parallelism: 1 # 更新时将会一个一个更新
        failure_action: rollback # 更新失败将会回滚
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      placement:
        constraints:
          - "node.role==manager"
      labels:
        - "traefik.enable=true"
        # http -> https
        - "traefik.http.routers.http2https.rule=HostRegexp(`{any:.+}`)"
        - "traefik.http.routers.http2https.entrypoints=web"
        - "traefik.http.routers.http2https.middlewares=https-redirect"
        - "traefik.http.middlewares.https-redirect.redirectscheme.scheme=https"
        - "traefik.http.middlewares.https-redirect.redirectscheme.permanent=true"
        # dashboard
        - "traefik.http.routers.api.rule=Host(`traefik.xxxx.com`)"
        - "traefik.http.routers.api.entrypoints=websecure"
        - "traefik.http.routers.api.tls.certresolver=le"
        - "traefik.http.routers.api.service=api@internal"
        # auth middleware
        - "traefik.http.routers.api.middlewares=api-auth"
        - "traefik.http.middlewares.api-auth.basicauth.users=admin:$$apr1$$4dF14.8m$$tmj/UCiirgX6q9mao05uD1"
        - "traefik.http.services.api.loadbalancer.server.port=80"

networks:
  proxy:
    external: true

volumes:
  traefik-certificates:
```

:::

## 效果展示

![](http://img.tzf-foryou.com/img/20220414161821.png)

![](http://img.tzf-foryou.com/img/20220414161909.png)