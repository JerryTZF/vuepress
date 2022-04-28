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

prev: /zh/harvest/observer/node_exporter.md
next: /zh/harvest/observer/prometheus.md

---

# Alertmanager

::: tip
- 在阿里云部署。
- 打开 `9093` 端口。
:::

---

## 安装

### 结构

```text
.
├── alertmanager-stack.yml
├── alertmanager.yml
├── storage
└── template
    └── email.tmpl
```

### 编写配置文件

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

### 告警模板

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

### stack文件

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

---

::: danger 【Tip】
告警规则定义需要在 `prometheus` 中定义，详情参见：[server_alert.yml](/zh/harvest/observer/prometheus.md)
:::

---

::: tip
持续施工 :construction:
:::
