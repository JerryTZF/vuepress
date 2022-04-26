---
sidebar: [
{ text: '返回', link: '/zh/harvest/overview.md' },
{ text: 'Index', link: '/zh/harvest/observer/index.md' },
{ text: 'Mysqld_exporter', link: '/zh/harvest/observer/mysql_exporter.md' },
{ text: 'Node_exporter', link: '/zh/harvest/observer/node_exporter.md' },
{ text: 'Alertmanager', link: '/zh/harvest/observer/alertmanager.md' },
{ text: 'Prometheus', link: '/zh/harvest/observer/prometheus.md' },
{ text: 'Grafana', link: '/zh/harvest/observer/grafana.md' },
]

prev: /zh/harvest/observer/mysql_exporter.md
next: /zh/harvest/observer/alertmanager.md

---

# Node_exporter

::: tip
- 在阿里云、腾讯云01、腾讯云02 上部署。
- 全部打开 `9100` 端口。
- 采用 `docker` 安装。
:::

---

## ~~安装步骤~~

- ~~wget https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz~~
- ~~tar -zxf node_exporter-1.1.2.linux-amd64.tar.gz~~
- ~~cd /usr/local/src/node_exporter-1.1.2.linux-amd64~~
- ~~touch config.yml & vim config.yml~~

~~写入：~~
```yaml
basic_auth_users:
  # 密码加密方式 htpasswd -nBC 12 '' | tr -d ':\n'
  Accoount: Password
```
- ~~nohup ./node_exporter --web.config=./config.yml & `最后的 "&" 使其后台运行`~~
- ~~ps -aux | grep node_exporter~~

---

## 在Aliyun、TX-01、TX-02上安装

> docker-compose.yml

---

```yaml
version: '3.5'

services:
  node-exporter:
    image: prom/node-exporter
    container_name: node-exporter
    hostname: 'TX-01' # 不同的主机写不同的名字
    ports:
      - "9100:9100"
    restart: always
    volumes:
      - /usr/share/zoneinfo/Asia/Shanghai:/etc/localtime:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
```

---

## 查看触点暴露信息

```shell
curl http://xx.xx.xx.xx:9100/metrics
```

***出现如图信息即配置成功***

![](http://img.tzf-foryou.com/img/20220426121608.png)

---

::: tip
持续施工 :construction:
:::
