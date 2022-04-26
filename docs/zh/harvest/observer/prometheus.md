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

prev: /zh/harvest/observer/alertmanager.md
next: /zh/harvest/observer/grafana.md

---

# Prometheus

::: tip
- 在阿里云部署。
- `traefik` 代理
:::

---

## 安装

### 结构

```text
.
├── prometheus (目录)
├── prometheus-stack.yml
├── prometheus.yml
└── rules
    └── server_alert.yml
```

### 配置文件

> prometheus.yml

---

```yaml
# Prometheus全局配置项
global:
  scrape_interval: 15s # 默认抓取周期，可用单位ms、smhdwy #设置每15s采集数据一次，默认1分钟
  evaluation_interval: 15s # 估算规则的默认周期 # 每15秒计算一次规则。默认1分钟

# influxdb配置；需在influxdb中创建好db
# 我们Prometheus采用本地tsdb存储，这里就不使用Influxdb进行数据存储了 :cry:
#remote_write:
#  - url: "http://xx.xx.xx.xx:8086/api/v1/prom/write?db=prometheus&u=user&p=password"
#remote_read:
#  - url: "http://xx.xx.xx.xx:8086/api/v1/prom/read?db=prometheus&u=user&p=password"

# 告警规则
rule_files:
  - "./rules/*.yml"

# 告警配置
alerting:
  alertmanagers:
    - static_configs:
        - targets: [ 'xx.xx.xx.xx:9093' ] # Alertmanager所在服务器

# 配置抓取
scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: [ 'localhost:9090' ]
        labels:
          appname: 'prometheus'
  - job_name: 'agent'
    metrics_path: /metrics
    static_configs:
      # node_exporter 所在服务器
      - targets: [ 'xx.xx.xx.xx:9100', 'xx.xx.xx.xx:9100','xx.xx.xx.xx:9100' ]
  - job_name: 'mysql'
    metrics_path: /metrics
    static_configs:
      # mysqld_exporter 所在服务器
      - targets: [ 'xx.xx.xx.xx:9104','xx.xx.xx.xx:9104' ]

```

---

### 告警规则配置文件

> server_alert.yml

---

```yaml
groups:
# 该规则(node_usage_record_rules)参见: https://grafana.com/grafana/dashboards/16098
- name: node_usage_record_rules
  interval: 1m
  rules:
  - record: cpu:usage:rate1m
    expr: (1 - avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) by (job,instance)) * 100
  - record: mem:usage:rate1m
    expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
- name: hostStatsAlert
  rules:
  - alert: 服务器CPU告警
    expr: (100 - avg (rate(node_cpu_seconds_total{job="agent",mode="idle"}[5m])) by (instance) * 100) > 80
    for: 50s
    labels:
      severity: warning
    annotations:
      summary: "服务器实例：{{ $labels.instance }} CPU使用率过高"
      description: "服务器 {{ $labels.instance }} CPU使用率五分钟负载超过80% (当前值为: {{ $value }})"
      username: "Jerry"

  - alert: 服务器内存告警
    expr: ((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)/node_memory_MemTotal_bytes)*100 > 80
    for: 50s
    labels:
      severity: warning
    annotations:
      summary: "服务器实例：{{ $labels.instance }} 内存使用率过高"
      description: "服务器 {{ $labels.instance }} 内存使用率超过 80% (当前值为: {{ $value }})"
      username: "Jerry"

  - alert: 服务器磁盘告警
    expr: (node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100 > 80
    for: 50s
    labels:
      severity: warning
    annotations:
      summary: "服务器实例：{{ $labels.instance }} 分区使用率过高"
      description: "服务器 {{ $labels.instance }} 磁盘分区使用率超过 80% (当前值为: {{ $value }})"
      username: "Jerry"
```

---

### stack文件

> prometheus-stack.yml

---

```yaml
version: '3.5'

services:
  prometheus:
    image: prom/prometheus:v2.28.0
    networks:
      - proxy
    deploy:
      mode: global
      placement:
        constraints:
          - "node.role==manager"
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.prometheus.rule=Host(`prometheus.example.xyz`)"
        - "traefik.http.routers.prometheus.entrypoints=websecure"
        - "traefik.http.routers.prometheus.tls.certresolver=le"
        - "traefik.http.services.prometheus.loadbalancer.server.port=9090"
    configs:
      - source: prometheus
        target: /etc/prometheus/prometheus.yml
    volumes:
      - $PWD/rules:/etc/prometheus/rules

networks:
  proxy:
    external: true

configs:
  prometheus:
    file: /home/monitoring/prometheus/prometheus.yml
```

---

## 示例

![](http://img.tzf-foryou.com/img/20220426124512.png)

::: tip
持续施工 :construction:
:::
