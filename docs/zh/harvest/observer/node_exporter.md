---
sidebar: [
{ text: '返回', link: '/zh/harvest/overview.md' },
{ text: 'Index', link: '/zh/harvest/observer/index.md' },
{ text: 'Grafana', link: '/zh/harvest/observer/grafana.md' },
{ text: 'Prometheus', link: '/zh/harvest/observer/prometheus.md' },
{ text: 'Alertmanager', link: '/zh/harvest/observer/alertmanager.md' },
{ text: 'Influxdb', link: '/zh/harvest/observer/influxdb.md' },
{ text: 'Node_exporter', link: '/zh/harvest/observer/node_exporter.md' },
]

prev: /zh/harvest/observer/influxdb.md
next: /zh/harvest/overview.md

---

# Node_exporter

::: tip
- 在阿里云、腾讯云01、腾讯云02 上部署。
- 全部打开 `9100` 端口。
:::

---

## 安装步骤

- wget https://github.com/prometheus/node_exporter/releases/download/v1.1.2/node_exporter-1.1.2.linux-amd64.tar.gz
- tar -zxf node_exporter-1.1.2.linux-amd64.tar.gz
- cd /usr/local/src/node_exporter-1.1.2.linux-amd64
- touch config.yml & vim config.yml

写入：
```yaml
basic_auth_users:
  # 密码加密方式 htpasswd -nBC 12 '' | tr -d ':\n'
  Accoount: Password
```
- nohup ./node_exporter --web.config=./config.yml & `最后的 "&" 使其后台运行`
- ps -aux | grep node_exporter


---

::: tip
持续施工 :construction:
:::
