---
sidebar: [
{ text: '返回', link: '/zh/harvest/overview.md' },
{ text: 'Grafana', link: '/zh/harvest/observer/grafana.md' },
{ text: 'Prometheus', link: '/zh/harvest/observer/prometheus.md' },
{ text: 'Alertmanager', link: '/zh/harvest/observer/alertmanager.md' },
{ text: 'Influxdb', link: '/zh/harvest/observer/influxdb.md' },
{ text: 'Node_exporter', link: '/zh/harvest/observer/node_exporter.md' },
]

prev: /zh/harvest/observer/prometheus.md
next: /zh/harvest/observer/influxdb.md

---

# Alertmanager

::: tip
- 在阿里云部署。
- 打开 `9093` 端口。
:::

---

## 配置文件

- [配置文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/alertmanager/alertmanager.yml)
- [stack文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/alertmanager/alertmanager-stack.yml)
- [告警模板](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/alertmanager/template/email.tmpl)

---

## 目录结构

```text
.
├── alertmanager-stack.yml
├── alertmanager.yml
├── storage
└── template
    └── email.tmpl
```

---

::: tip
持续施工 :construction:
:::
