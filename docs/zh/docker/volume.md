---
sidebar: 'auto'
sidebarDepth: 3

---


# 卷的使用

---

::: tip 【说明】
我自己的使用场景更多聚焦于 `容器编排(docker compose)` 和 `集群模式(docker swarm)` 下的使用，
所以示例会偏向于上面两种模式 ，对于单个容器的创建过程中卷的声明
，你可以参考 [volume](https://docs.docker.com/storage/volumes/)。 \
另外，我对于`卷`会更多的偏向于解决什么问题，不会面面俱到的列出所有内容 :sunglasses:
:::

---

![docker文件系统](http://img.tzf-foryou.com/img/20220410204852.png)

***数据持久化使我们使用卷最重要的需求!!!***

---

## bind mount 和 volume 区别


```yaml
version: "3.5"

services:
  web:
    image: nginx:alpine
    container_name: nginx
    restart: always
    ports:
      - "8081:80"
      - "4433:443"
    volumes:
      # 卷模式:当启动时,docker会自动创建名为"nginx_log"的卷且由docker自己管理
      # Linux下,目录为:/var/lib/docker/volumes
      - type: volume
        source: nginx_log
        target: /var/log/nginx
      # 挂载模式:当使用绑定挂载时,主机上的文件或目录会挂载到容器中
      # 外部目录需要自己管理
      - type: bind
        source: nginx.conf
        target: /etc/nginx/nginx.conf
      - type: bind
        source: $PWD/html
        target: /usr/share/nginx/html

  web2:
    image: nginx:alpine
    container_name: nginx2
    restart: always
    ports:
      - "8082:80"
      - "4434:443"
    volumes:
      # 全部为挂载模式
      - $PWD/nginx_log:/var/log/nginx
      - $PWD/html:/usr/share/nginx/html
      - $PWD/nginx.conf:/etc/nginx/nginx.conf

volumes:
  nginx_log:


# 请注意web1和web2的区别
```

::: warning 【注意】
`volume` 和 `bind mount` 区别
- bind mount 需要你自己声明好宿主机对应的目录 `挂载` 至 容器内的指定目录，而 volume 是docker自己进行管理，只需要你声明对应的卷即可。
- 不同的系统(`Mac`、`Windows`、`Linux`)对应的文件系统的目录不一致，bind mount需要自己管理，并且对应的权限也是只有root才可以，volume 则不需要。
- 当需要共享目录时，请使用 `volume` ，尽量不要用 `volume_from` 关键字了。
:::

---

## 共享目录

[详情](https://docs.docker.com/compose/compose-file/compose-file-v3/#volume-configuration-reference)

```yaml
version: "3.9"

services:
  db:
    image: db
    volumes:
      - data-volume:/var/lib/db
  backup:
    image: backup-service
    volumes:
      - data-volume:/var/lib/backup/data

volumes:
  data-volume:
```

---

## 集群模式




---

::: tip
持续施工 :construction:
:::