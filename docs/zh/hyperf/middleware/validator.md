---
sidebar: [
{text: '返回', link: '/zh/hyperf/hyperf-component.md'},
{text: '跨域中间件', link: '/zh/hyperf/middleware/cors.md'},
{text: '验证器中间件', link: '/zh/hyperf/middleware/validator.md'},
{text: '自定义全局中间件', link: '/zh/hyperf/middleware/overload.md'},
{text: '示例中间件', link: '/zh/hyperf/middleware/normal.md'},
]
sidebarDepth: 2

prev: /zh/hyperf/middleware/cors.md
next: /zh/hyperf/middleware/overload.md

---

# 验证器中间件

[[TOC]]

---

::: tip
这里的验证器中间件是我自己封装的一些内容 \
实现逻辑是：\
① 重写验证器(`App\Lib\_Validator\BaseValidator.php`)，里面包含了自定义验证规则。 \
② 定义自定义规则接口(`App\Lib\_Validator\Rules\RuleInterface`)，将实现了该接口的规则实体类注入到上面重写的验证器中，可以丰富扩展规则。 \
③ 验证不通过时，通过定义对应的异常类(`ValidationExceptionHandler`)，捕获后返回对应的异常信息。
:::

---

## 挂载配置

*config/autoload/middleware.php*

*该中间件是全局中间件*

```php
<?php

declare(strict_types=1);
/**
 * This file is part of Hyperf.
 *
 * @link     https://www.hyperf.io
 * @document https://hyperf.wiki
 * @contact  group@hyperf.io
 * @license  https://github.com/hyperf/hyperf/blob/master/LICENSE
 */
return [
    'http' => [
        // 跨域中间件
        App\Middleware\CorsMiddleware::class,
        // 验证器中间件(官方)
        Hyperf\Validation\Middleware\ValidationMiddleware::class,
    ],
];

```

---

## 重写自定义验证器

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: BaseValidator.php
 * User: tianzhaofan
 * Date: 2020/9/1
 * Time: 10:22 上午
 */

namespace App\Lib\_Validator;


use App\Lib\_Validator\Rules\CharactersRule;
use App\Lib\_Validator\Rules\IdCardRule;
use App\Lib\_Validator\Rules\PhoneRule;
use App\Lib\_Validator\Rules\RuleInterface;
use Hyperf\Utils\ApplicationContext;
use Hyperf\Validation\Contract\ValidatorFactoryInterface;
use Hyperf\Validation\ValidationException;

class BaseValidator
{
    /**
     * @var array
     */
    protected static array $extends = [];

    /**
     * 进行验证
     * @param array $data
     * @param array $rules
     * @param array $messages
     * @param bool $firstError
     * @return bool
     */
    public static function make(array $data, array $rules, array $messages = [], bool $firstError = true): bool
    {
        $validator = self::getValidator();
        if (empty($messages)) {
            $messages = self::messages();
        }

        $valid = $validator->make($data, $rules, $messages);
        if ($valid->fails()) {
            $errors = $valid->errors();
            $error = $firstError ? $errors->first() : $errors;
            throw new ValidationException($valid);
        }

        return true;
    }

    /**
     * 获取验证器
     * @return ValidatorFactoryInterface
     */
    public static function getValidator(): ValidatorFactoryInterface
    {
        static $validator = null;
        if (is_null($validator)) {
            // 容器中获取验证器
            $validator = ApplicationContext::getContainer()->get(ValidatorFactoryInterface::class);
            // 初始化扩展
            self::initExtends();
            // 注册扩展
            self::registerExtends($validator, self::$extends);
        }
        return $validator;
    }

    /**
     * 初始化自定义规则
     */
    protected static function initExtends(): void
    {
        self::$extends = [
            PhoneRule::NAME      => new PhoneRule(),
            CharactersRule::NAME => new CharactersRule(),
            IdCardRule::NAME     => new IdCardRule()
        ];
    }

    /**
     * 注册验证器扩展
     * @param ValidatorFactoryInterface $validator
     * @param array $extends
     */
    protected static function registerExtends(ValidatorFactoryInterface $validator, array $extends)
    {
        foreach ($extends as $key => $extend) {
            if ($extend instanceof RuleInterface) {

                $validator->extend($key, function (...$args) use ($extend) {
                    return call_user_func_array([$extend, RuleInterface::PASSES_NAME], $args);
                });

                $validator->replacer($key, function (...$args) use ($extend) {
                    return call_user_func_array([$extend, RuleInterface::MESSAGE_NAME], $args);
                });
            }
        }
    }

    /**
     * 默认异常信息
     * @return array
     */
    public static function messages(): array
    {
        return [];
    }
}
```

---

## 定义自定义规则 `interface` 接口

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: RuleInterface.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午3:33
 */

namespace App\Lib\_Validator\Rules;


use Hyperf\Validation\Validator;

interface RuleInterface
{
    const PASSES_NAME = 'passes';

    const MESSAGE_NAME = 'message';

    public function passes($attribute, $value, $parameters, Validator $validator): bool;

    public function message($message, $attribute, $rule, $parameters, Validator $validator): string;
}
```

---

*列举几个自定义规则实现类*

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: PhoneRule.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午3:34
 */

namespace App\Lib\_Validator\Rules;


use Hyperf\Validation\Validator;

/**
 * 手机号号码校验规则
 * Class PhoneRule
 * @package App\Lib\_Validator\Rules
 */
class PhoneRule implements RuleInterface
{
    const NAME = 'mobile';

    public function passes($attribute, $value, $parameters, Validator $validator): bool
    {
        return (bool)preg_match("/^1[234578]\d{9}$/", (string)$value);
    }

    public function message($message, $attribute, $rule, $parameters, Validator $validator): string
    {
        return '手机号错误,请检查 :(';
    }
}
```

---

## 自定义异常捕获器

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Name: ValidationExceptionHandler.php
 * User: JerryTian<tzfforyou@163.com>
 * Date: 2021/6/30
 * Time: 下午2:24
 */

namespace App\Exception\Handler;


use App\Constants\SysErrorCode;
use Hyperf\ExceptionHandler\ExceptionHandler;
use Hyperf\HttpMessage\Stream\SwooleStream;
use Hyperf\Validation\ValidationException;
use Psr\Http\Message\ResponseInterface;
use Throwable;

/**
 * 数据验证异常处理
 * Class ValidationExceptionHandler
 * @package App\Exception\Handler
 */
class ValidationExceptionHandler extends ExceptionHandler
{
    /**
     * 异常接管处理
     * @param Throwable $throwable
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function handle(Throwable $throwable, ResponseInterface $response): ResponseInterface
    {
        // 禁止后续异常管理类接管
        $this->stopPropagation();

        /** @var ValidationException $throwable */
        $httpBody = $throwable->validator->errors()->first();

        return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(422)->withBody(new SwooleStream(json_encode([
                'code'   => SysErrorCode::VALIDATE_ERROR,
                'msg'    => SysErrorCode::getMessage(SysErrorCode::VALIDATE_ERROR) . $httpBody,
                'status' => false,
                'data'   => []
            ], JSON_UNESCAPED_UNICODE)));
    }

    /**
     * 是否为数据验证失败类型异常
     * @param Throwable $throwable
     * @return bool
     */
    public function isValid(Throwable $throwable): bool
    {
        return $throwable instanceof ValidationException;
    }
}
```

---

## 数据验证类封装

```php
<?php

declare(strict_types=1);

/**
 * Created by PhpStorm
 * Time: 2021/11/29 6:01 下午
 * Author: JerryTian<tzfforyou@163.com>
 * File: Validator.php
 * Desc:
 */


namespace App\Lib\_Validator;

use App\Controller\CommonController;
use Hyperf\Validation\Rule;

class Validator extends BaseValidator
{
    public static function walkConfig(array $data, $message = []): bool
    {
        $rules = [
            'cover_image' => ['required', 'url'],
            'rate'        => ['required', 'numeric']
        ];

        $message = empty($message) ? [
            'cover_image.required' => '封面图必传',
            'cover_image.url'      => '封面图地址非法',
            'rate.required'        => '兑换比例必填',
            'rate.numeric'         => '兑换比例必须为整型'
        ] : [];

        return self::make($data, $rules, $message);
    }
}
```


---


## 使用验证器

```php
    // 设置配置
    #[PostMapping(path: "config.json")]
    public function config(): array
    {
        $action = $this->request->input('action');
        $redis = Redis::getRedisInstance();
        if ($action == 'get') {
            $data = $redis->hGetAll(CacheKeys::WALK_CONFIG);
            return $this->result->setData($data)->getResult();
        }

        $data = [
            'cover_image' => $this->request->input('cover_image'),
            'rate'        => $this->request->input('rate'),
            'remark'      => $this->request->input('remark')
        ];

        // 验证器验证
        Validator::walkConfig($data);
        (Redis::getRedisInstance())->hMSet(CacheKeys::WALK_CONFIG, $data);
        return $this->result->getResult();
    }
```