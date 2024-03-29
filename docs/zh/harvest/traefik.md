---
sidebar: 'auto'
sidebarDepth: 3

prev: /zh/harvest/overview.md
next: /zh/harvest/mysql.md
---

# traefik

## 概览

> **traefik** 与 **nginx** 一样，是一款优秀的反向代理工具，或者叫 `Edge Router`，这里我把它当做 `Gateway`。

***Traefik对比Nginx优势：***

- 支持服务动态发现，无需对每一个服务进行配置重启后生效。
- 自动装载 `SSL`，无需手动申请证书进行配置。:smile:
- `Provider` 完美支持 `Docker`,容器间通信格外方便。
- 动态调整自身负载均衡配置，无需手动配置。
- `Traefik` 提供的自身详细的metrics数据，对服务监控支持友好。
- 多种中间件可以对流量、路由等进行拦截处理。

## 为什么选择traefik

***演变过程：***

- `NGINX` + `PHP-FPM` + `模板引擎`
- ↓
- `Traefik` + `Docker Compose` + `Hyperf`
- ↓
- `Traefik` + `Docker Swarm` + `Hyperf`

---

*刚来公司的时候，使用的传统的 `NGINX` + `PHP-FPM`的方式，又因为公司项目性质是 ***小程序*** (多而小)，部分项目采用的还是
`模板引擎`，后面接手后，架构打算更换为 `Docker Compose` + `前后端分离`。此时 `Traefik` 的优势就非常适合我们此时的需求。*

---

## 配置相关

::: warning 【说明】
动态配置、静态配置：
- 静态配置：在traefik启动时加载的配置(无论是供traefik本身使用，还是用于服务发现)；在traefik启动后无法动态加载的配置选项。
- 动态配置：traefik启动后可以动态的修改配置而不用重启traefik可以加载到的配置。

详细请参考：[静态配置](https://traefik.tech/reference/static-configuration/file/)、[动态配置](https://traefik.tech/reference/dynamic-configuration/file/)
:::

---

::: tip 静态配置一些例子(yml格式、以顶级配置项说明)
:::

---

### global

```yaml
global: # 全局配置，一般全部设置为false
  checkNewVersion: true
  sendAnonymousUsage: true
```

### serversTransport

```yaml
serversTransport: # 配置Traefik与您的服务器之间的传输,一般不配置(我没用过)
  insecureSkipVerify: true
  rootCAs:
  - foobar
  - foobar
  maxIdleConnsPerHost: 42
  forwardingTimeouts:
    dialTimeout: 42
    responseHeaderTimeout: 42
    idleConnTimeout: 42
```

### entryPoints

```yaml
entryPoints:  # EntryPoints是Traefik的网络入口点。它们定义了将接收数据包的端口，以及侦听TCP还是UDP
  web:  # 入口点名称
    address: :80   # 入口点监听的端口
    transport:     # 入口点的传输的相关时间配置
      lifeCycle:   # 在关闭阶段控制Traefik的行为
        requestAcceptGraceTimeout: 42  # 可选。此选项旨在给下游负载均衡器足够的时间以使Traefik停止旋转
        graceTimeOut: 42  # 可选。在Traefik停止之前，给予主动请求的机会完成的时间
      respondingTimeouts: # Traefik实例的传入请求的超时。设置它们对UDP entryPoints无效。
        readTimeout: 42   # 可选。读取整个请求（包括正文）的最大持续时间。默认0；0则不设置超时时间
        writeTimeout: 42  # 可选。默认0。超时写入响应之前的最大持续时间
        idleTimeout: 42   # 可选。默认180S。空闲（保持活动）连接在关闭自身之前将保持空闲的最长时间
    proxyProtocol:  # 指定代理协议
      insecure: true  # 使用不安全模式（仅测试环境） 和下面互斥
      trustedIPs:     # 使用受信任的IP启用代理协议
      - "127.0.0.1/32"
      - "192.168.1.7"
    forwardedHeaders:  # 将Traefik配置为信任转发的标头信息(traefik将信任转发的请求)
      insecure: true   # 不安全模式（始终信任转发的报头）。
      trustedIPs:      # 信任来自特定IP的转发的报头。
      - "127.0.0.1/32"
      - "192.168.1.7"
```

### providers

> traefik支持多种服务提供者，这里以docker为例，其他请移步官网文档[服务提供者](https://doc.traefik.io/traefik/providers/overview/#supported-providers)

```yaml
providers:   # 服务提供者顶级配置
  providersThrottleDuration: 10s  # Traefik在重新加载配置之后，在考虑任何新的配置刷新事件之前等待的持续时间,默认2s
  docker:    #  docker提供的服务配置选项
    constraints: "Label(`a.label.name`,`foo`)" # 可选，默认值=""。 约束是Traefik与容器标签匹配的表达式，以确定是否为该容器创建任何路线。也就是说，如果容器的标签都不匹配表达式，则不会为该容器创建路由
    watch: true  # 可选，默认= true。监听Docker Swarm事件
    endpoint: "unix:///var/run/docker.sock"  # 必需，默认="unix：///var/run/docker.sock"。提供商配置
    defaultRule: foobar  # 可选，默认=Host(`{{ normalize .Name }}`) 对于给定的容器，如果标签未定义任何路由规则，则由此defaultRule定义。建议docker-compose.yml的label添加
    tls:   # 证书相关
      ca: path/to/ca.crt  # 可选的。用于安全连接到Docker的证书颁发机构
      caOptional: true    # 遵循与TLS客户端身份验证到Docker的安全连接的策略
      cert: path/to/foo.cert        # 用于安全连接到Docker的公共证书
      key: path/to/foo.key          # 用于安全连接到Docker的私有证书
      insecureSkipVerify: true      # 用于与Docker的连接的TLS接受服务器提供的任何证书以及该证书中的任何主机名
    exposedByDefault: false   # 默认情况下，通过Traefik公开容器。如果设置为false，则没有traefik.enable=true标签的容器将从生成的路由配置中忽略
    useBindPortIP: true  # Traefik将请求路由到匹配容器的IP/端口；详见:https://doc.traefik.io/traefik/providers/docker/#usebindportip
    swarmMode: true  # 可选，默认= false。 激活Swarm模式（而不是独立的Docker）
    network: foobar  # 可选，默认=空。定义用于连接所有容器的默认docker网络。可以在容器上使用traefik.docker.network标签覆盖此选项。
    swarmModeRefreshSeconds: 15  # 可选，默认= 15。 定义“群集”模式下的轮询间隔（以秒为单位）

```

### api

```yaml
api:  # 仪表盘相关
  dashboard: true  # 启用仪表盘
  debug: true      # 启用debug模式
```

### log

```yaml
log:      # 日志相关
  level: DEBUG   # 日志级别
  filePath: /path/to/log-file.log   # 日志路径
  format: json    # 日志格式
```

### accessLog

> 详见：[accessLog](https://doc.traefik.io/traefik/observability/access-logs/)

```yaml
accessLog:   # 访问日志配置
  filePath: "/path/to/access.log" # 默认情况下，访问日志将写入标准输出。要将日志写入日志文件，请使用该filePath选项
  format: CLF  # 默认情况下，使用通用日志格式（CLF）写入日志。要使用JSON写入日志，请json在format选项中使用
  filters:  # 日志筛选配置
    statusCodes:  # 以将访问日志限制为状态码在指定范围内的请求
    - "200"
    - "300-302"
    retryAttempts: true  # 以便至少发生一次重试后保留访问日志
    minDuration: 42    # 以在请求花费的时间超过指定的持续时间时保留访问日志（以秒为单位或以有效的持续时间格式提供
  fields:   # 限制字段/包括标题
    defaultMode: drop # keep 保持价值;drop 降低价值;redact 将值替换为“已编辑”
    names:
      User-Agent: redact
      Authorization: drop
    headers:
      defaultMode: foobar
      names:
        name0: foobar
        name1: foobar
  bufferingSize: 42
```

### tracing

> 详见：[tracing](https://doc.traefik.io/traefik/observability/tracing/overview/)

```yaml
tracing:
  serviceName: foobar
  spanNameLimit: 42
  ...
```

### hostResolver

> 启用CNAME拼合相关

```yaml
hostResolver:
  cnameFlattening: true
  resolvConfig: foobar
  resolvDepth: 42
```

### certificatesResolvers

> 证书配置相关。详见：[证书相关](https://doc.traefik.io/traefik/https/acme/)

```yaml
certificatesResolvers:   # 证书相关顶级配置
  yourresolver :    # 你自定义配置名称
    acme:             # 检索证书服务器，不能修改为其他
      email: example@163.com # your email address
      caServer: foobar # 必需，默认=“ https://acme-v02.api.letsencrypt.org/directory”。要使用的CA服务器
      storage: foobar # 必需，默认=“ acme.json”。该storage选项设置ACME证书的保存位置 
      keyType: foobar # 可选，默认值=“ RSA4096”。 用于生成证书私钥的KeyType。允许值'EC256'，'EC384'，'RSA2048'，'RSA4096'，'RSA8192'
      dnsChallenge:  # DNS-01通过配置DNS记录来使用质询来生成和更新ACME证书
        provider: foobar # 必填。DNS-01通过配置DNS记录来使用质询来生成和更新ACME证书
        delayBeforeCheck: 42 # 默认情况下，在让ACME进行验证之前，先provider验证TXT记录。您可以通过指定一个延迟（以秒为单位）（值必须大于零）来延迟此操作。当内部网络阻止外部DNS查询时，此选项很有用。delayBeforeCheck
        resolvers:  # 使用自定义DNS服务器来解析FQDN权限。
        - "1.1.1.1:53"
        - "8.8.8.8:53"
        disablePropagationCheck: true
      httpChallenge: # 通过在HTTP众所周知的URI下配置HTTP资源，使用质询来生成和更新ACME证书
        entryPoint: web # 必须让“Let's Encrytype”通过端口80到达
      tlsChallenge: {}
```
---

### 静态配置示例

```yaml
api:
  dashboard: true
entryPoints:
  web:
    address: :80
    http:
      redirections:
        entryPoint:
          to: websecure
  websecure:
    address: :443
    http:
      middlewares:
        - secureHeaders@file # 使用中间件(在文件中声明)
      tls:
        certResolver: letsencrypt
providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    filename: /configurations/dynamic.yml  # 动态配置文件(动态修改不用重启服务即可生效,且配置的是具体服务相关内容,后面我们使用docker的label标签进行配置)
certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@tzf-foryou.com
      storage: acme.json
      keyType: EC384
      httpChallenge:
        entryPoint: web
  buypass:
    acme:
      email: admin@example.com
      storage: acme.json
      caServer: https://api.buypass.com/acme/directory
      keyType: EC256
      httpChallenge:
        entryPoint: web
```

---

### 动态配置示例

```yaml
http:
  middlewares:
    secureHeaders:
      headers:
        sslRedirect: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 31536000
    bw-stripPrefix:
      stripPrefix:
        prefixes:
          - "/notifications/hub"
        forceSlash: false
    user-auth:
      basicAuth:
        users:
          - "admin:$apr1$tm53ra6x$FntXd6jcvxYM/YH0P2hcc1"
tls:
  options:
    default:
      cipherSuites:
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
        - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
      minVersion: VersionTLS12
```

::: danger 【注意】
- 我们后续的示例和说明，均以 `docker-compose.yml` 中的 `label` 标签进行配置，也就是我们的 `provider` 均以 `Docker` 提供，
  上面的示例是为了演示都有哪些关键 `Key-Value`
- 还有许多其他内容，但是我这里并未演示说明，因为我只会列举我用过或者比较重要的内容，全量的内容，请参看[官方文档](https://doc.traefik.io/traefik/)
:::

---

## 集群使用

::: tip
- 阿里云ECS作为 `Gateway` 所在服务器；两台腾讯云和阿里云作为服务所在服务器。
- 这里以 `yml` 文件作为示例，有对应的解释。 :smile:
- 下面配置中有不明白的，可以在官方文档中搜索对应的关键字即可。像这样：

![](http://img.tzf-foryou.com/img/20220424180518.png)

:::

### traefik服务

```yaml
version: "3.5"

services:
  traefik-proxy:
    image: traefik:v2.3.4
    command:
      # These configs are static configs
      # Open dashboard
      - "--api"
      # Docker swarm configuration
      - "--providers.docker.endpoint=unix:///var/run/docker.sock"
      - "--providers.docker.swarmMode=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=proxy" # Make sure you have created Docker Swarm networks named proxy
      # Configure entrypoint
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      # SSL configuration
      - "--certificatesresolvers.le.acme.httpchallenge=true"
      - "--certificatesresolvers.le.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.le.acme.email=example@gamil.com"
      - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
      # Global HTTP -> HTTPS
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      # Open AccessLog && set it
      - "--accesslog=true"
      - "--accesslog.filepath=/letsencrypt/access.log"
      - "--accesslog.bufferingsize=100"
      # To enable the prometheus
      - "--metrics.prometheus=true"
      - "--metrics.prometheus.buckets=0.100000,0.300000,1.200000,5.000000"
      - "--metrics.prometheus.entryPoint=traefik"
      - "--metrics.prometheus.addServicesLabels=true"
      - "--metrics.prometheus.addEntryPointsLabels=true"
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
        parallelism: 1 # Updates will be made one by one
        failure_action: rollback # Update failure will be rolled back
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
        - "traefik.http.routers.api.rule=Host(`traefik.example.com`)"
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
---

***配合sh脚本清除日志和移动日志至方便观察的目录***

```shell
#! /bin/bash
#-----------------------------------------------------------------------
#    crontab跑脚本任务    每天00:00点打包traefik的访问日志并清理15天前日志文件 
#    EXP: 00 00 * * * bash /home/sys/traefik/logs/clear_traefik_log.sh
#-----------------------------------------------------------------------
log_file=/var/lib/docker/volumes/traefik_traefik-certificates/_data/access.log
logs_path=/home/sys/traefik/logs
save_days=15

# 复制traefik的访问日志，按天切割
cp ${log_file} ${logs_path}/access-$(date -d "yesterday" +"%Y%m%d").log
# 清空原来的访问日志
cat /dev/null > ${log_file}
# 定期清理x天前的访问日志文件
find ${logs_path} -mtime +${save_days} -type f -wholename /*.log | xargs rm -f
```

### 示例

::: tip
- 通过 `label` 标签(相当于动态配置, `traefik` 会自动发现该服务)进行配置。
- `label` 标签是在 `deploy` 下面，如果同级，则不是 `Docker Swarm` 模式。
  :::

```yaml
version: "3.5"

services:
  nginx-test:
    image: nginx
    networks:
      - proxy
    deploy:
      mode: global
      placement:
        constraints:
          - "node.role==worker"
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.nginx.rule=Host(`nginx.example.com`)"
        - "traefik.http.routers.nginx.entrypoints=websecure"
        - "traefik.http.routers.nginx.tls.certresolver=le"
        - "traefik.http.services.nginx.loadbalancer.server.port=80"
    configs:
      - source: index
        target: /usr/share/nginx/html/index.html


networks:
  proxy:
    external: true

configs:
  index:
    file: /nfsroot/nginx/index.html
```

---

::: danger 【注意】
当请求被 `Traefik` 命中，会反代向对应的服务，又因为我们用的是 `Docker Swarm` 集群模式，所以会根据 `Docker Swarm` 的负载均衡
规则进行服务转发，所以这里需要格外注意，负载均衡并不是走的 `Traefik` :warning: :warning: :warning: 。
当然我们也可以走 `Traefik` 的负载均衡~
:::