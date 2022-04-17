---
sidebar: 'auto'

---

# 杂谈

## 系统监控及告警

::: tip 【说明】
- 基于 `Grafana`、`Prometheus`、`Alertmanager`、`Influxdb`、`Node_exporter` 搭建的服务器性能指标监控系统。
- 建议安装顺序 `Grafana` -> `Influxdb` -> `Node_exporter` -> `Alertmanager` -> `Prometheus`
- 基于我的一台阿里云。两台腾讯云的 `Docker Swarm` 集群搭建，有个别软件没有走 `Docker` 后续会尝试全量 `Docker`。 :cry:
- 别忘记开启对应服务所需的端口：`alertmanager: 9093` 、`node-export: 9100` 、 `influxdb: 8086`
:::

---

```text
root@Joker:/home/swarm# tree -L 2
.
├── alertmanager
│   ├── alertmanager-stack.yml
│   ├── alertmanager.yml
│   ├── storage
│   └── template
├── grafana
│   ├── grafana.ini
│   └── grafana-stack.yml
├── portainer
│   ├── portainer-stack.yml
│   └── public
├── prometheus
│   ├── prometheus-stack.yml
│   ├── prometheus.yml
│   └── rules
├── traefik
    └── traefik-stack.yml
```

---
- [Grafana](/zh/harvest/observer/grafana.md)
- [Prometheus](/zh/harvest/observer/prometheus.md)
- [Alertmanager](/zh/harvest/observer/alertmanager.md)
- [Influxdb](/zh/harvest/observer/influxdb.md)
- [Node_exporter](/zh/harvest/observer/node_exporter.md)

---

::: tip
持续施工 :construction:
:::
