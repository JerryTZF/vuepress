---
sidebarDepth: 2,
sidebar: [
{ text: '项目文档', link: '/zh/project/overview' },
{ text: '积分有礼', collapsible: true, children : [
{ text: '数据库设计' ,link : '/zh/project/gift_point/gift-point-db'},
{ text: '缓存设计' , link: '/zh/project/gift_point/gift-point-cache'},
{ text: '配置及依赖', link: '/zh/project/gift_point/gift-point-config'},
{ text: '其他' , link: '/zh/project/gift_point/gift-point-others'},
{ text: '接口文档', link: '/zh/project/gift_point/gift-point-api'}
]},
{ text: '运营商', collapsible: true, children: [
{ text: '数据库设计' ,link : '/zh/project/operator/operator-db'},
{ text: '缓存设计' , link: '/zh/project/operator/operator-cache'},
{ text: '配置及依赖', link: '/zh/project/operator/operator-config'},
{ text: '其他' , link: '/zh/project/operator/operator-others'},
{ text: '接口文档', link: '/zh/project/operator/operator-api'}
]},
{ text: '银行申卡', collapsible: true, children: [
{ text: '数据库设计' ,link : '/zh/project/bank/bank-db'},
{ text: '缓存设计' , link: '/zh/project/bank/bank-cache'},
{ text: '配置及依赖', link: '/zh/project/bank/bank-config'},
{ text: '其他' , link: '/zh/project/bank/bank-others'},
{ text: '接口文档', link: '/zh/project/bank/bank-api'}
]}
]

prev: /zh/project/gift_point/gift-point-cache
next: /zh/project/gift_point/gift-point-others

---
# 积分有礼配置及依赖

## 数据库

### 连接信息 `.env`
```ini
########################
# 集群环境
########################
DB_DRIVER=mysql
DB_HOST=x.x.x.x
DB_PORT=33061
DB_DATABASE=gift_point_v2
DB_USERNAME=root
DB_PASSWORD=xxxxxxx
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
DB_PREFIX=

REDIS_HOST=x.x.x.x
REDIS_AUTH=xxxxxxx
REDIS_PORT=6371
REDIS_DB=14

```

---

::: tip 【说明】
数据库和项目不在同一个集群内
:::


## 支付宝

### 所需支付宝能力列表(Open API)

- 获取访问令牌 `alipay.system.oauth.token`
- 获取会员卡投放链接 `alipay.marketing.card.activateurl.apply`
- 更新会员卡信息 `alipay.marketing.card.update`
- 下发集分宝 `alipay.user.alipaypoint.send`
- 解密数据(手机号、运动步数)
- B2C单笔转账(现金红包) `alipay.fund.trans.uni.transfer`

### SDK配置(公钥证书)

- AES秘钥
- 应用私钥
- 支付宝公钥证书
  - alipayCertPublicKey_RSA2.crt
  - alipayRootCert.crt
  - appCertPublicKey_{$this->appId}.crt

::: danger 【说明】
支付宝公钥证书配置见 `其他`
:::

### 发放集分宝令牌

```ini
###########
# alipay
###########
BUDGET_CODE=033******258

```

---

## 积分底层

### 底层API  `.env`

```ini
#####################
# core-point (集群环境)
#####################

# 查询用户积分
QUERY_USER_POINTS=https://core.xxxx.cn/core/user/balance.json
# 增加/扣减 用户积分
UPDATE_USER_POINTS=https://core.xxxx.cn/core/point/update.json
# 查询用户积分变更记录
QUERY_USER_HISTORY=https://core.xxxx.cn/core/user/records.json
# 查询用户积分失效记录
QUERY_USER_EXPIRED=https://core.xxxx.cn/core/point/expired.json
# 查询用户最近即将失效积分
QUERY_USER_RECENT_EXPIRED=https://core.xxxx.cn/core/recent/expired.json

```

::: danger 【底层能力】
- 积分有礼依赖于积分底层的一些能力，由于模块较少，这里服务与服务之间采用 `HTTP` 协议通信，没有使用 `微服务`
- API见: [积分底层API文档](/zh/project/gift_point/api/core-query-points.md)
:::
