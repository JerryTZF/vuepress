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

prev: /zh/harvest/observer/prometheus.md
next: /zh/harvest/overview.md

---

# Grafana

::: tip
- 部署在阿里云。
- `traefik` 代理。
:::

---

## 安装

- [配置文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/grafana/grafana.ini)
- [stack文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/grafana/grafana-stack.yml)

## 配置仪表盘

- 导入数据源，我们选择 `Prometheus`，
- `Grafana` 中导入 [16098](https://grafana.com/grafana/dashboards/16098), 这里我们使用别人做好的仪表盘 :smile:

## 效果

![](http://img.tzf-foryou.com/img/20220417133201.png)

![](http://img.tzf-foryou.com/img/20220417141838.png)

![](http://img.tzf-foryou.com/img/20220417142017.png)

![](http://img.tzf-foryou.com/img/20220417142118.png)

![](http://img.tzf-foryou.com/img/20220426140308.png)

---

::: tip
持续施工 :construction:
:::
