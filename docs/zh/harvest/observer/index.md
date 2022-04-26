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

prev: /zh/harvest/overview.md
next: /zh/harvest/observer/mysql_exporter.md

---

# 说明

::: tip 【tips】
- 基于 `Grafana`、`Prometheus`、`Alertmanager`、~~`Influxdb`~~(采用`tsdb`)、`Node_exporter`、`Mysqld_exporter` 
搭建的服务器性能指标监控系统和数据库性能指标监控系统。
- 基于我的一台阿里云。两台腾讯云的 `Docker Swarm` 集群搭建；有图形化界面的走 `Swarm` 集群，其他容器处理。
- 开放端口：`阿里云:alertmanager:9093`、`ALL:node-export:9100`、`TX-01&TX-02:mysqld_exporter:9104`。
- 建议安装顺序 `Node_exporter` -> `Mysqld_exporter` ->`Grafana` -> `Alertmanager` -> `Prometheus`
  :::

---

## 结构

```text
root@Joker:/home/monitoring# tree -L 3
.
├── alertmanager
│   ├── alertmanager-stack.yml
│   ├── alertmanager.yml
│   ├── storage
│   └── template
│       └── email.tmpl
├── grafana
│   ├── grafana.ini
│   └── grafana-stack.yml
├── node-exporter
│   └── docker-compose.yml
└── prometheus
    ├── prometheus
    ├── prometheus-stack.yml
    ├── prometheus.yml
    └── rules
        └── server_alert.yml
```
