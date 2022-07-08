---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md
next: /zh/hyperf/listen/listen.md

---

# 日志处理

## 日志配置

::: tip
- 日志处理的 `Handler` 有 `Monolog\Handler\StreamHandler` 、 `Monolog\Handler\RotatingFileHandler`，这里的配置
是 `按照日期轮转` 的处理器。
- `INFO` 及以上级别的日志会写入info日志，`ERROR` 及以上级别的日志会写入error日志。按照每天进行分割。
- `Hyperf` 是参考了 `monolog` 的一些内容，详见：[Monolog](https://github.com/Seldaek/monolog)。
:::

---

*config/autoload/log.php*

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
    'default' => [
        'handlers' => [
            // 记录INFO级别及以上等级日志
            [
                'class'       => Monolog\Handler\RotatingFileHandler::class,
                'constructor' => [
                    'filename' => BASE_PATH . '/runtime/logs/info.log',
                    'level'    => Monolog\Logger::INFO
                ],
                'formatter'   => [
                    'class'       => Monolog\Formatter\LineFormatter::class,
                    'constructor' => [
                        'format'                => "[%datetime%]|[%channel%]|[%level_name%]|[%message%]|[%context%]\n",
                        'dateFormat'            => 'Y-m-d H:i:s',
                        'allowInlineLineBreaks' => true,
                    ]
                ]
            ],
            // 记录ERROR及以上日志
            [
                'class'       => Monolog\Handler\RotatingFileHandler::class,
                'constructor' => [
                    'filename' => BASE_PATH . '/runtime/logs/error.log',
                    'level'    => Monolog\Logger::ERROR
                ],
                'formatter'   => [
                    'class'       => Monolog\Formatter\LineFormatter::class,
                    'constructor' => [
                        'format'                => "[%datetime%]|[%channel%]|[%level_name%]|[%message%]|[%context%]\n",
                        'dateFormat'            => 'Y-m-d H:i:s',
                        'allowInlineLineBreaks' => true,
                    ]
                ]
            ],
        ]
    ],
];

```

### 示例

![示例](http://img.tzf-foryou.com/img/20220320181530.png)

---

## 日志封装

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
namespace App\Lib\_Log;

use Carbon\Carbon;
use Hyperf\Contract\StdoutLoggerInterface;
use Hyperf\Logger\LoggerFactory;
use Hyperf\Utils\ApplicationContext;
use Psr\Log\LoggerInterface;

/**
 * @method static void info(string $msg, array $content = [])
 * @method static void warning(string $msg, array $content = [])
 * @method static void error(string $msg, array $content = [])
 * @method static void alert(string $msg, array $content = [])
 * @method static void critical(string $msg, array $content = [])
 * @method static void emergency(string $msg, array $content = [])
 * @method static void notice(string $msg, array $content = [])
 */
class Log
{
    public static function __callStatic(string $level, array $args = []): void
    {
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        $trace = array_pop($trace);

        [$now, $caller, $message] = [
            Carbon::now()->toDateTimeString(),
            "{$trace['class']}@{$trace['function']}",
            $args[0],
        ];

        $msg = "[time: {$now}]|[caller: {$caller}]|[message: {$message}]";

        // CLI输出(没有$content)
        static::stdout()->{$level}($msg);
        // DISK输出
        static::get($caller)->{$level}($msg, $args[1] ?? []);
    }

    /**
     * 获取Logger实例.
     */
    public static function get(string $channel = ''): LoggerInterface
    {
        return ApplicationContext::getContainer()->get(LoggerFactory::class)->get($channel);
    }

    /**
     * CLI 日志实例.
     */
    public static function stdout(): StdoutLoggerInterface
    {
        return ApplicationContext::getContainer()->get(StdoutLoggerInterface::class);
    }
}
```

---

### 调用示例

参见：[全局异常处理器](/zh/hyperf/exception/global.md)