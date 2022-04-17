---
sidebar: [
{ text: '返回', link: '/zh/harvest/overview.md' },
{ text: 'Grafana', link: '/zh/harvest/observer/grafana.md' },
{ text: 'Prometheus', link: '/zh/harvest/observer/prometheus.md' },
{ text: 'Alertmanager', link: '/zh/harvest/observer/alertmanager.md' },
{ text: 'Influxdb', link: '/zh/harvest/observer/influxdb.md' },
{ text: 'Node_exporter', link: '/zh/harvest/observer/node_exporter.md' },
]

prev: /zh/harvest/observer/alertmanager.md
next: /zh/harvest/observer/node_exporter.md

---

# Influxdb

::: tip
- 部署在腾讯云 `TX01`。
- 开启 `8086` 端口。
:::

---

## 配置文件

- [配置文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/influxdb/influxdb.conf)
- [docker-compose.yml](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/influxdb/docker-compose.yml)

---

## 创建数据库

- [连接工具](https://macwk.com/soft/dbeaver-ultimate)

```shell
create database prometheus
```
---

***后续写入数据后如图示例：***

![](http://img.tzf-foryou.com/img/20220417135558.png)

---

::: tip
持续施工 :construction:
:::
