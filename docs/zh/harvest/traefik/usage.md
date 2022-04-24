---
sidebar: 'auto'
prev: /zh/harvest/traefik/config.md
next: /zh/harvest/overview.md
---

# 集群使用

::: tip
- 阿里云ECS作为 `Gateway` 所在服务器；两台腾讯云和阿里云作为服务所在服务器。
- 这里以 `yml` 文件作为示例，有对应的解释。 :smile:
- 下面配置中有不明白的，可以在官方文档中搜索对应的关键字即可。像这样：

![](http://img.tzf-foryou.com/img/20220424180518.png)

:::

---

## traefik服务

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

---

## 示例

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