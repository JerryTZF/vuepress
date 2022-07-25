---
sidebar: 'auto'
sidebarDepth: 2

prev: /zh/harvest/overview.md
next: /zh/harvest/traefik.md
---

## 概览

- 目标：监控各个服务器的性能资源占用、对应数据库的健康情况
- 软件建议安装顺序：**Node_exporter** -> **Mysqld_exporter** -> **Grafana** -> **Alertmanager** -> **Prometheus**

---

## 清单列表
- 服务器：阿里云(ALI)、腾讯云1(TX-01)、腾讯云2(TX-02)
- 软件：**Grafana**、**Prometheus**、**Alertmanager**、**Node_exporter**、**Mysqld_exporter**、~~**Influxdb**~~(采用`tsdb`)
- 依赖环境：**Docker Swarm**
- 端口映射：**全量(node-exporter): 9100**、**ALI(alertmanager): 9093**、**TX-01&&TX-02(mysqld-exporter): 9104**

## 目录结构

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

---

## Mysqld_exporter

### 1、安装exporter

> docker 安装

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

::: warning
理论上你应该创建 `exporter` 用户，并且授权，数据抓取使用该用户，我这里偷懒就用 `root` 用户了。 :cry:

```sql
# 创建exporter用户
CREATE USER 'exporter'@'%' IDENTIFIED BY 'password' WITH MAX_USER_CONNECTIONS 5;
# 授权
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';
```
:::


### 2、查看触点数据

```shell
curl http://xx.xx.xx.xx:9104/metrics 
```

***出现如图信息即配置成功***

![](http://img.tzf-foryou.com/img/20220426120855.png)

---

## Node_exporter

### 1、安装exporter

> docker 安装

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

### 2、查看触点数据
```shell
curl http://xx.xx.xx.xx:9100/metrics
```

***出现如图信息即配置成功***

![](http://img.tzf-foryou.com/img/20220426121608.png)

---

## Alertmanager

### 1、配置文件

> alertmanager.yml

```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.163.com:465'
  smtp_from: 'example@163.com'
  smtp_auth_username: 'example@163.com'
  smtp_auth_password: 'JRROCBSXXXAWNSXD' # 邮件授权秘钥
  smtp_require_tls: false

templates:
  - './template/*.tmpl'

# 定义路由树信息
route:
  group_by: ['alertname'] # 报警分组依据
  group_wait: 10s # 最初即第一次等待多久时间发送一组警报的通知
  group_interval: 10s # 在发送新警报前的等待时间
  repeat_interval: 3600s # 发送重复警报的周期 对于email配置中，此项不可以设置过低，否则将会由于邮件发送太多频繁，被smtp服务器拒绝
  receiver: 'mail' # 发送警报的接收者的名称，以下receivers name的名称

# 定义警报接收者信息
receivers:
- name: 'mail'
  email_configs:
    - to: '{{ template "email.to" . }}'
      html: '{{ template "email.to.html" . }}'
      send_resolved: true

# 抑制规则
# 一个inhibition规则是在与另一组匹配器匹配的警报存在的条件下，使匹配一组匹配器的警报失效的规则。两个警报必须具有一组相同的标签。
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']

```

---

### 2、告警模板

> template/email.tmpl

```yaml
{{ define "email.from" }} example@163.com {{ end }}
{{ define "email.to" }} example@163.com {{ end }}
{{ define "email.to.html" }}
{{ range .Alerts }}
告警程序: prometheus_alert <br>
告警级别: {{ .Labels.severity }} <br>
告警类型: {{ .Labels.alertname }} <br>
故障主机: {{ .Labels.instance }} <br>
告警主题: {{ .Annotations.summary }} <br>
告警详情: {{ .Annotations.description }} <br>
查看详情: {{ .Annotations.link }} <br>
触发时间: {{ .StartsAt.Format "2006-01-02 15:04:05" }} <br>
===============================<br>
{{ end }}
{{ end }}

```

---

### 3、部署文件

> alertmanager-stack.yml

```yaml
version: "3.5"

services:
  alertmanager:
    image: prom/alertmanager:latest
    networks:
      - proxy
    ports:
      - "9093:9093"
    deploy:
      mode: global
      placement:
        constraints:
          - "node.role==manager"
    volumes:
      - $PWD/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - $PWD/storage:/data/alertmanager/storage
      - $PWD/template:/etc/alertmanager/template

networks:
  proxy:
    external: true
```

::: danger 【Tips】

:::

---

## Prometheus

### 1、配置文件

> prometheus.yml

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

### 2、告警规则配置文件

> server_alert.yml

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

### 3、部署文件


> prometheus-stack.yml

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

### 4、成功示例

![](http://img.tzf-foryou.com/img/20220426124512.png)

---

## Grafana

### 1、安装

- [配置文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/grafana/grafana.ini)
- [stack文件](https://github.com/JerryTZF/hyperf-demo/blob/main/monitoring/grafana/grafana-stack.yml)

### 2、配置仪表盘

- 导入数据源，我们选择 `Prometheus`，
- `Grafana` 中导入 [16098](https://grafana.com/grafana/dashboards/16098), 这里我们使用别人做好的仪表盘 :smile:

### 3、效果

![](http://img.tzf-foryou.com/img/20220417133201.png)

![](http://img.tzf-foryou.com/img/20220417141838.png)

![](http://img.tzf-foryou.com/img/20220417142017.png)

![](http://img.tzf-foryou.com/img/20220417142118.png)

![](http://img.tzf-foryou.com/img/20220428201858.png)

