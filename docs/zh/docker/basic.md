---
sidebar: 'auto'

---

# Docker

::: warning 【注意】
在使用 `Docker` 前，我们应该知道我们的诉求和痛点是什么，然后去了解 `Docker` 是否可以解决我们的痛点；

---

以我为例：

- `Swoole` 无法跑在 `Windows` 上( 现在可以了:smile: )，但是Docker虚拟化出对应的环境可以解决。
- 多个项目依赖的 `PHP` 版本不一致，并且需要在 `Nginx` 上配置多个虚拟主机。
- 代码维护起来非常麻烦，多个环境，多个版本，有时要具体看代码才能区分出来，而且有时还要关注下代码细节。:cry:
- 对于不熟悉我的项目的同事要跑起来项目，需要配置很多配置，有时他们只是想看下效果，我需要花费一些时间进行沟通。

:::

---

## 1、docker是什么

docker是一种**虚拟化环境技术**，例如`vmware`，`virtualbox`等，本质上是环境隔离的作用。将项目与项目之间做到相对的独立、层次更加分明。

---

## 2、docker的优势

- 交付方便快捷
- 将项目和环境一起打包运行，具有很好的隔离性
- 降低维护成本

---

## 3、原则

::: tip 【提示】
在你了解 `docker` 的之前，可以先随意看下这些原则，因为这些原则在熟练使用 `docker` 以后，可以让你很好的理解为什么要这样。
当你熟练使用 `docker` 后，仍让可以帮助你更好、更优雅的使用 `docker`。

---

后面可能会有补充。。。
:::
 
- 一个容器原则上推荐只部署一个应用，应用之间需要通信的要通过容器间通信的方式通信。
- 构建自定义镜像时，建议使用最精简的基础镜像(减少镜像大小)。
- 当有多个容器(服务)可以归类时，建议使用自定义网络，将这些容器放入自定义网络，而其他的不允许访问自定义网络。
- 当多个容器需要共享数据时，建议使用公共卷而不是公共容器。

---

## 4、镜像

- 基于宿主机内核的、可叠加的、用来打包软件运行环境和基于运行环境开发的文件系统。
- **静态只读分层结构**；静态：就像代码不运行起来永远只是没有执行的字母文字一样；只读：当一个镜像构建时，相当于在构建文件系统，在未被运行时，文件内容是不会被写入的；分层结构：任何一个镜像都是基于一个基础镜像，即在基础镜像之上被重新构建。
- 我们的项目或者环境都是基于一个基础镜像，然后来编写环境、项目代码等内容。

::: tip
- 对于自定义镜像，我们需要定义 `Dockerfile` 来在基础镜像的基础上，丰富我们自己的需要的功能。
- 一些官方镜像，镜像内部开放了很多对应的启动工具或者其他工具，在使用官方镜像时，请尽量去 `dockerhub` 阅读文档。
:::

***构建自己的PHP***

```dockerfile
FROM php:latest
MAINTAINER zhaofantian

# 更换国内镜像源
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
COPY ./sources.list /etc/apt/sources.list

# 安装无需指定配置环境的扩展
RUN docker-php-ext-install -j$(nproc) iconv calendar

# 安装GD(脚本工具安装)
RUN apt-get update && apt-get install -y \
		libfreetype6-dev \
		libjpeg62-turbo-dev \
      libpng-dev \
		&& docker-php-ext-configure gd --with-freetype --with-jpeg \
		&& docker-php-ext-install -j$(nproc) gd
		
# Memcached 扩展(PECL安装)
RUN apt-get update --fix-missing && apt-get install -y libmemcached-dev zlib1g-dev \
        && rm -r /var/lib/apt/lists/* \
        && pecl install memcached-3.1.3 \
        && docker-php-ext-enable memcached

# 安装zip(脚本工具安装)
RUN apt-get update --fix-missing && apt-get install -y libzip-dev \
        && rm -r /var/lib/apt/lists/* \
        && docker-php-ext-install -j$(nproc) zip

# mcrypt 扩展(PECL安装)
RUN apt-get update --fix-missing && apt-get install -y libmcrypt-dev \
        && rm -r /var/lib/apt/lists/* \
        && pecl install mcrypt-1.0.2 \
        && docker-php-ext-enable mcrypt
        
# redis 扩展(PECL安装)
RUN pecl install redis-5.0.0 && docker-php-ext-enable redis

# swoole 扩展(PECL扩展)
RUN pecl install swoole && docker-php-ext-enable swoole

# 安装vim
RUN apt-get update --fix-missing && apt-get install -y vim

# 安装composer
RUN set -ex \
    # install composer
    && cd /tmp \
    && wget https://mirrors.aliyun.com/composer/composer.phar \
    && chmod u+x composer.phar \
    && mv composer.phar /usr/local/bin/composer \
    && composer config -g repo.packagist composer https://mirrors.aliyun.com/composer

# 修改时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 暴露9000端口
EXPOSE 9000
```

---

## 5、容器

- 容器是运行时(Runtime)的，它包含了项目的所有运行环境(系统、代码、依赖包、语言环境等)。
- 容器与容器之间相互隔离的(沙箱机制)，相互不会影响。
- 所有对容器的改动 - 无论添加、删除、还是修改文件都只会发生在容器层中。只有容器层是可写的，容器层下面的所有镜像。层都是只读的，也就是说容器修改内容是不会影响依赖于该镜像的其他容器。

![容器镜像结构](http://img.tzf-foryou.com/img/20220331193418.png)

---

***自定义启动脚本***

```dockerfile
FROM php:latest
MAINTAINER zhaofantian

# 复制启动脚本
COPY ./entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# 暴露9000端口
EXPOSE 9000

# 启动
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
```

---

```shell
#!/bin/bash
# 启动 crontab(添加"&"以守护进程运行)
/etc/init.d/cron restart &
# 启动 php-fpm
docker-php-entrypoint php-fpm
exec "$@"
```

---

::: tip
简单理解，镜像和容器可以理解为类(Class)和对象(Object)的关系，实例化类之前，类只是声明了环境、依赖等关系，只有当实例化对象后，才可以对对象进行操作，但是类本身是没有变化的，再次实例化一个新的对象是不会看到之前对象修改的变化。
:::

---

## 6、网络

> docker的网络基本分为四种模式：

- **Host**：主机模式；启动容器的时候使用host模式，那么这个容器将不会获得一个独立的 `Network Namespace`，
而是和宿主机共用一个 `Network Namespace` 。容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的IP和端口

- **Container**：容器模式；这个模式指定新创建的容器和已经存在的一个容器共享一个 `Network Namespace`，
而不是和宿主机共享。新创建的容器不会创建自己的网卡，配置自己的IP，而是和一个指定的容器共享IP、端口范围等

- **None**: 没有网络模式；这种模式下，Docker容器拥有自己的 `Network Namespace`，但是，并不为 `Docker` 容器进行任何网络配置。
也就是说，这个 `Docker` 容器没有网卡、IP、路由等信息。需要我们自己为 `Docker` 容器添加网卡、配置IP等

- **Bridge**: 网桥模式；bridge模式是 `Docker` 默认的网络设置，此模式会为每一个容器分配 `Network Namespace`、设置IP等，
并将一个主机上的 `Docker` 容器连接到一个虚拟网桥上。

![docker网络](http://img.tzf-foryou.com/img/20220331194017.png)

---

::: warning 【注意】
- 多个容器间通信请务必保证在同一网络下
- 不同功能的服务(servers)集，尽量保证在不同的网络下，举例：前端的server1、server2…等在一个网络下，后端server1、server2…等在另一个网络下
- 同一网络下的不同服务没有必要编排在一个docker-compose.yml内
:::

---

## 7、数据卷

**作用**：

- 数据持久化：当容器删除时，容器产生的数据依旧可以在磁盘保存。
- 数据共享：容器间数据可以共享。
- 动态修改：一些配置文件会映射出来

---

**数据卷的三种映射方式**：

1. bind mount

> 绑定容器指定目录至宿主机指定目录。

```yaml
version: "3.5"
services:
  rabbitmq:
    image: rabbitmq:3.8.3-management
    container_name: rabbitmq
    volumes:
      - $PWD/data:/var/lib/rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: root
      RABBITMQ_DEFAULT_PASS: root
      TZ: Asia/Shanghai
    ports:
      - "5672:5672"
      - "15672:15672"
```

---

::: tip
可以通过以下方式查看数据卷映射的类型.
```shell
# docker inspect dddfd27a73a5
"Mounts": [
         {
             "Type": "bind",
             "Source": "/home/www/docker-servers/rabbitmq/data",
             "Destination": "/var/lib/rabbitmq",
             "Mode": "rw",
             "RW": true,
             "Propagation": "rprivate"
         }
     ],
```
:::

---

2. volume

> 绑定容器指定目录至docker管理的卷路径。

```yaml
version: "3.9"
services:
  frontend:
    image: node:lts
    volumes:
      - myapp:/home/node/app
  backend:
  	image: sss
  	volumes:
  	  - myapp:/home/node/app
volumes:
  myapp:
``` 

---

```yaml
version: "3.9"
services:
  frontend:
    image: node:lts
    volumes:
      - myapp:/home/node/app
volumes:
  myapp:
    external: true
```
---

::: tip
docker管理的卷在下面目录中
```shell
ls /var/lib/docker/volumes/
```
:::

---

3. tmpfs mount

存入内存，基本不用，不做过多介绍。 :stuck_out_tongue:

---

## 8、安装

- [ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [centos](https://docs.docker.com/engine/install/centos/)
- [windows desktop](https://docs.docker.com/desktop/windows/install/)
- [mac desktop](https://docs.docker.com/desktop/mac/install/)
- [docker compose](https://docs.docker.com/compose/install/)

## 9、换源

- 获取加速地址：前往 => `https://cr.console.aliyun.com/cn-shenzhen/instances/mirrors` => `镜像加速器`
- 编辑配置：编辑(不存在则新建) `/etc/docker/daemon.json` ，添加：

```json
{"registry-mirrors": ["https://xxxxxxx.mirror.aliyuncs.com"]}
```
- 重启：`systemctl daemon-reload` + `systemctl restart docker`


---

## 10、编排和构建

::: tip
- 用于构建自定义镜像时需要使用Dockerfile来build我们的镜像。
- `Dockerfile` 一般由 ***基础镜像信息*** 、 ***维护者信息***、***镜像指令*** 、 ***启动执行指令*** 四部分组成。
- 详情参考：[容器编排](/zh/docker/docker-compose.md)
:::

---

## 11、自动化构建(CI/CD)

- 1、构建工作流文件

```shell
# 目录结构
.github
	|- workflows
		|- main.yml
Dockerfile
```

---

```yaml
name: Build and Publish Docker
on: [push]
jobs: 
  build:
	runs-on: ubuntu-latest
  	name: Build image job
	steps:
  	  - name: Checkout master
      uses: actions/checkout@master
      - name: Build and publish image
      # 这里的工具是Actions广场查找使用的,如果你想更换,在广场搜索即可
      # https://github.com/marketplace/actions
      uses: ilteoood/docker_buildx@master
      with:
    	repository: meta-houselai/admin-server # 命名空间/镜像名称
        registry: registry.cn-shenzhen.aliyuncs.com # 仓库地址
        username: "xxx" # 仓库用户
        password: "xxx" # 仓库密码
        auto_tag: true
        
# 这里推荐几个好用的Action构建镜像的Action工具
# https://github.com/marketplace/actions/customizable-docker-buildx
# https://github.com/marketplace/actions/push-to-registry
# https://github.com/marketplace/actions/publish-docker-action
```

- 2、阿里云镜像管理触发器(暂未使用)
- 3、触发器详情请参考：[阿里云镜像仓库触发器](https://help.aliyun.com/document_detail/60949.html)

---

::: tip
- 可以实现一个 `web server` 接收阿里云的 `webhook` 然后主动拉取更新镜像
- `watchTower` 容器也可以实现监听所有容器的镜像是否为最新版，是则拉取更新
- 流程可以抽象为：`local` -> `github` -> `build Image` -> `push Registry` -> `pull` -> `pro Env` -> `docker restart`
:::


---


::: tip
持续施工 :construction:
:::