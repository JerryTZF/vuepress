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

prev: /zh/project/gift_point/gift-point-config
next: /zh/project/gift_point/gift-point-api

---
# 其他声明

## 支付宝SDK配置

::: tip
- 使用支付宝官方 [easy-sdk](https://github.com/alipay/alipay-easysdk/tree/master/php)
- `easy-sdk` 中的 `API` 均为 `OpenAPI`，前端的 `my.xxx` 为前端调用功能API，不是开放能力中的API
- 详细的支付宝使用见对应文档
:::

---

::: danger
- 单个服务(Server)对多个小程序提供服务，即：不同的小程序请求服务，动态的进行配置装载。在并发较高时，后者的配置会覆盖前者的配置，导致发生错误，
因为`easy-sdk`内部是单例实现，所以这里需要保证一个请求所装载的配置均在对应的协程内。 
- 上传文件相关API，在 `PHP8` 中无法使用，SDK的一个BUG :cry:
:::

### 初始化配置

*SDK初始化代码*

> 将底层的初始化过程单独拉出来，目的是：每次请求都是一个协程，那么在协程内单独初始化该条请求

---

```php
<?php

namespace App\Lib\_Alipay;

use Alipay\EasySDK\Base\Image\Client as imageClient;
use Alipay\EasySDK\Base\OAuth\Client as oauthClient;
use Alipay\EasySDK\Base\Qrcode\Client as qrcodeClient;
use Alipay\EasySDK\Base\Video\Client as videoClient;
use Alipay\EasySDK\Kernel\CertEnvironment;
use Alipay\EasySDK\Kernel\Config;
use Alipay\EasySDK\Kernel\EasySDKKernel;
use Alipay\EasySDK\Marketing\OpenLife\Client as openLifeClient;
use Alipay\EasySDK\Marketing\Pass\Client as passClient;
use Alipay\EasySDK\Marketing\TemplateMessage\Client as templateMessageClient;
use Alipay\EasySDK\Member\Identification\Client as identificationClient;
use Alipay\EasySDK\Payment\App\Client as appClient;
use Alipay\EasySDK\Payment\Common\Client as commonClient;
use Alipay\EasySDK\Payment\FaceToFace\Client as faceToFaceClient;
use Alipay\EasySDK\Payment\Huabei\Client as huabeiClient;
use Alipay\EasySDK\Payment\Page\Client as pageClient;
use Alipay\EasySDK\Payment\Wap\Client as wapClient;
use Alipay\EasySDK\Security\TextRisk\Client as textRiskClient;
use Alipay\EasySDK\Util\AES\Client as aesClient;
use Alipay\EasySDK\Util\Generic\Client as genericClient;

/**
 * AlipaySDK 封装
 */
final class AlipaySDK
{
    public array $config = [];
    public EasySDKKernel $kernel;
    protected Base $base;
    protected Marketing $marketing;
    protected Member $member;
    protected Payment $payment;
    protected Security $security;
    protected Util $util;

    private function __construct(Config $config)
    {
        if (!empty($config->alipayCertPath)) {
            $certEnvironment = new CertEnvironment();
            $certEnvironment->certEnvironment(
                $config->merchantCertPath,
                $config->alipayCertPath,
                $config->alipayRootCertPath
            );
            $config->merchantCertSN = $certEnvironment->getMerchantCertSN();
            $config->alipayRootCertSN = $certEnvironment->getRootCertSN();
            $config->alipayPublicKey = $certEnvironment->getCachedAlipayPublicKey();
        }

        $kernel = new EasySDKKernel($config);
        $this->base = new Base($kernel);
        $this->marketing = new Marketing($kernel);
        $this->member = new Member($kernel);
        $this->payment = new Payment($kernel);
        $this->security = new Security($kernel);
        $this->util = new Util($kernel);
    }

    /**
     * 使用原始配置初始化 AlipaySDK
     *
     * @param Config $config
     * @return AlipaySDK
     */
    public static function setOptions(Config $config): AlipaySDK
    {
        return new self($config);
    }

    public function base(): Base
    {
        return $this->base;
    }

    public function marketing(): Marketing
    {
        return $this->marketing;
    }

    public function member(): Member
    {
        return $this->member;
    }

    public function payment(): Payment
    {
        return $this->payment;
    }

    public function security(): Security
    {
        return $this->security;
    }

    public function util(): Util
    {
        return $this->util;
    }
}


class Base
{
    private $kernel;

    public function __construct($kernel)
    {
        $this->kernel = $kernel;
    }

    public function image(): imageClient
    {
        return new imageClient($this->kernel);
    }

    public function oauth(): oauthClient
    {
        return new oauthClient($this->kernel);
    }

    public function qrcode(): qrcodeClient
    {
        return new qrcodeClient($this->kernel);
    }

    public function video(): videoClient
    {
        return new videoClient($this->kernel);
    }
}

class Marketing
{
    private $kernel;

    public function __construct($kernel)
    {
        $this->kernel = $kernel;
    }

    public function openLife(): openLifeClient
    {
        return new openLifeClient($this->kernel);
    }

    public function pass(): passClient
    {
        return new passClient($this->kernel);
    }

    public function templateMessage(): templateMessageClient
    {
        return new templateMessageClient($this->kernel);
    }
}

class Member
{
    private $kernel;

    public function __construct($kernel)
    {
        $this->kernel = $kernel;
    }

    public function identification(): identificationClient
    {
        return new identificationClient($this->kernel);
    }
}

class Payment
{
    private $kernel;

    public function __construct($kernel)
    {
        $this->kernel = $kernel;
    }

    public function app(): appClient
    {
        return new appClient($this->kernel);
    }

    public function common(): commonClient
    {
        return new commonClient($this->kernel);
    }

    public function faceToFace(): faceToFaceClient
    {
        return new faceToFaceClient($this->kernel);
    }

    public function huabei(): huabeiClient
    {
        return new huabeiClient($this->kernel);
    }

    public function page(): pageClient
    {
        return new pageClient($this->kernel);
    }

    public function wap(): wapClient
    {
        return new wapClient($this->kernel);
    }
}

class Security
{
    private $kernel;

    public function __construct($kernel)
    {
        $this->kernel = $kernel;
    }

    public function textRisk(): textRiskClient
    {
        return new textRiskClient($this->kernel);
    }
}

class Util
{
    private $kernel;

    public function __construct($kernel)
    {
        $this->kernel = $kernel;
    }

    public function generic(): genericClient
    {
        return new genericClient($this->kernel);
    }

    public function aes(): aesClient
    {
        return new aesClient($this->kernel);
    }
}


```

---

*构建客户端*

```php
    /**
     * 初始化 SDK
     * @return AlipaySDK
     * @throws Exception
     */
    private function getSDK(): AlipaySDK
    {
        $base = [
            'protocol'    => 'https',
            'gatewayHost' => 'openapi.alipay.com',
            'signType'    => 'RSA2',
            'notifyUrl'   => $this->options['callback'] ?? '',
            'appId'       => $this->appId,
        ];

        // 设置证书目录
        if (isset($this->options['cert_path'])) {
            $path = BASE_PATH . DIRECTORY_SEPARATOR . trim($this->options['cert'], DIRECTORY_SEPARATOR);
            if (!is_dir($path)) {
                throw new Exception("证书目录错误");
            }
            $this->baseCertPath = $path;
        }

        // 设置应用私钥
        if (isset($this->options['private_key'])) {
            $base['merchantPrivateKey'] = $this->options['private_key'];
        } else {
            $privateKey = file_get_contents($this->pathJoinWithCheck($this->appId, 'private.key'));
            if ($privateKey === false) {
                throw new Exception('私钥文件读取失败');
            }
            $base['merchantPrivateKey'] = trim($privateKey);
        }

        // 设置支付宝公钥或证书
        if (isset($this->options['public_key'])) {
            // 普通公钥模式
            $base['alipayPublicKey'] = $this->options['public_key'];
        } elseif (is_file($this->pathJoin($this->appId, 'public.key'))) {
            // 普通公钥模式
            $base['alipayPublicKey'] = file_get_contents($this->pathJoinWithCheck($this->appId, 'public.key'));
        } else {
            // 公钥证书模式
            $base['alipayCertPath'] = $this->pathJoinWithCheck($this->appId, 'alipayCertPublicKey_RSA2.crt');
            $base['alipayRootCertPath'] = $this->pathJoinWithCheck($this->appId, 'alipayRootCert.crt');
            $base['merchantCertPath'] = $this->pathJoinWithCheck($this->appId, "appCertPublicKey_$this->appId.crt");
        }

        // aes 密钥 可选
        if (isset($this->options['aes'])) {
            $base['encryptKey'] = $this->options['aes'];
        } else {
            $aesKeyPath = $this->pathJoin($this->appId, 'aes.key');
            if (is_file($aesKeyPath)) {
                $base['encryptKey'] = trim(file_get_contents($aesKeyPath));
            }
        }

        // 是否是ISV调用
        // 有些API(alipay.open.auth.token.app)不需要ISV参数，有一些又必须要(ISV角色调用支付宝API时)
        if (isset($this->options['isv_token'])) {
            $this->ISV = $this->options['isv_token'];
        } elseif (isset($this->options['isv_must']) && $this->options['isv_must'] === false) {
            $this->ISV = '';
        } else {
            $isvToken = $this->pathJoin($this->appId, 'isv.token');
            if (is_file($isvToken)) {
                $this->ISV = trim(file_get_contents($isvToken));
            }
        }

        $config = new Config($base);
        return AlipaySDK::setOptions($config);
    }
```

---



## 集群配置

::: danger 【注意】
- `.env` 配置文件写入镜像中，原因：① 镜像仓库为私有仓库；② 集群映射配置文件比较麻烦
- 采用 `Docker Swarm` 集群模式，`K8S` 有些过于庞大不适合
- Gateway 使用 `Traefik` 进行反代
:::

*stack文件*

```yaml
version: "3.5"

services:
  gift-point-server:
    image: registry.images.com/Repositories/gift-point-server-v2:v1.7.3
    networks:
      - proxy
    volumes:
      - type: volume
        source: gift_point_server_logs
        target: /opt/www/runtime/logs
      - type: volume
        source: gift_point_server_cert
        target: /opt/www/app/Cert
    deploy:
      mode: global
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.gift-point-server.rule=Host(`point.xxxx.com`) || Host(`point.yyyy.cn`)"
        - "traefik.http.routers.gift-point-server.entrypoints=websecure"
        - "traefik.http.routers.gift-point-server.tls.certresolver=le"
        - "traefik.http.services.gift-point-server.loadbalancer.server.port=9501"

networks:
  proxy:
    external: true

volumes:
  gift_point_server_logs:
  gift_point_server_cert:
```
---

*启动命令*

- `docker stack deploy --with-registry-auth -c point-gift-server-stack.yml gift-point-v2`