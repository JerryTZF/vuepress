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

prev: /zh/harvest/observer/index.md
next: /zh/harvest/observer/node_exporter.md

---

# Mysqld_exporter

::: tip
- 我有两台 `MySQL` 分别在 `TX-01` 和 `TX-02` 两台机器上，触点(exporter)就安装在对应的机器上了，当然触点和数据库不必在同一台机器。 :smile:
- 理论上你应该创建 `exporter` 用户，并且授权，数据抓取使用该用户，我这里偷懒就用 `root` 用户了。 :cry:

```sql
# 创建exporter用户
CREATE USER 'exporter'@'%' IDENTIFIED BY 'password' WITH MAX_USER_CONNECTIONS 5;
# 授权
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';
```

:::

---

## 在TX-01、TX-02上安装

> docker-compose.yml

---

```yaml
version: '3.5'

services:
  mysql-exporter:
    image: prom/mysqld-exporter
    container_name: mysqld-exporter
    ports:
      - "9104:9104"
    restart: always
    environment:
      - DATA_SOURCE_NAME=exporter:password@(xx.xx.xx.xx:3306)/
```

## 查看触点暴露信息

```shell
curl http://xx.xx.xx.xx:9104/metrics 
```

---

***出现如图信息即配置成功***

![](http://img.tzf-foryou.com/img/20220426120855.png)