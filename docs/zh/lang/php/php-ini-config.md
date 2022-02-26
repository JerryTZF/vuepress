# 1、配置相关

## 全局配置

```text
# 是否使用短标签，On表示支持写法：<? and ?>，否则不支持，推荐默认On
short_open_tag = Off
# 显示PHP出错信息，默认“Off”
display_errors = On
# PHP启动错误显示
display_startup_errors = On
# 允许PHP接收最大的数据，默认“200M”
post_max_size = 8M
# 默认编码，默认为空，不设置，一般根据实际情况，可以设置为“GBK”或“UTF-8”
default_charset = "UTF-8"
# 是否允许HTTP上传文件，默认“On”表示允许
file_uploads = On
# 上传文件最大上限
upload_max_filesize = 2M
# 禁用的PHP库函数，这个是比较重要的安全选项;不写则不禁用
disable_functions
# 运行 PHP 时需要关心每个 PHP 进程要使用多少内存
memory_limit = 256M
# 用于设置单个 PHP 进程在终止之前最长可运行时间 s
max_execution_time = 30
# 使用open_basedir选项能够控制PHP脚本只能访问指定的目录，这样能够避免PHP脚本访问不应该访问的文件，一定程度上限制了phpshell的危害
open_basedir = /home/www/wwwroot/
# 设置PHP错误日志存放的目录
error_log = /usr/local/php/log/
# GC垃圾回收
zend.enable_gc = On
```

## php-fpm.conf

```text
######### 全局配置段##########
# 错误日志，默认在安装目录中的var/log/php-fpm.log 如果设置为syslog，log就会发送给syslogd服务而不会写进文件里。
error_log = log/php-fpm.log

# 系统日志标示，如果跑了多个fpm进程，需要用这个来区分日志是谁的
syslog.ident = php-fpm
# 设置子进程接受主进程复用信号的超时时间。可用单位：s（秒），m（分），h（小时）或者 d（天）。默认单位：s（秒）。默认值：0（关闭）
process_control_timeout = 0
# Fork 的最大 FPM 进程数
process.max = 128
# 设置 FPM 使用的事件机制。 可用以下选项：select、pool、epoll、kqueue (*BSD)、port (Solaris)。 默认值：不设置（自动检测）
events.mechanism
# 设置 FPM 在后台运行。设置“no”将 FPM 保持在前台运行用于调试。默认值：yes。
daemonize = yes

######### 运行时配置段##########
# fpm监听端口，即nginx中php处理的地址，一般默认值即可。可用格式为: 'ip:port', 'port', '/path/to/unix/socket'. 每个进程池都需要设置.
listen = 127.0.0.1:9000
# 启动进程的帐户和组
user = www
group = www
# 允许访问FastCGI进程的IP，设置any为不限制IP，如果要设置其他主机的nginx也能访问这台FPM进程，listen处要设置成本地可被访问的IP。默认值是any。每个地址是用逗号分隔. 如果没有设置或者为空，则允许任何服务器请求连接
listen.allowed_clients = 127.0.0.1
# 设置进程管理器如何管理子进程 可用值：static，ondemand，dynamic。必须设置
pm = dynamic
# pm 设置为 static 时表示创建的子进程的数量，pm 设置为 dynamic 时表示最大可创建的子进程的数量。必须设置
pm.max_children = 5
# 动态方式下的起始php-fpm进程数量
pm.start_servers = 2
# 动态方式下的最小php-fpm进程数量
pm.min_spare_servers = 1
# 动态方式下的最大php-fpm进程数量
pm.max_spare_servers = 3
```

## 编译安装参数

> 查看编译参数 ` php -i | grep configure`

```text
# 目录等按照自己的实际情况填写
./configure --prefix=/usr/local/php --with-fpm-user=www --with-fpm-group=www --with-curl --with-freetype-dir --with-gd --with-gettext --with-iconv-dir --with-kerberos --with-libdir=lib64 --with-libxml-dir --with-mysqli --with-openssl --with-pcre-regex --with-pdo-mysql --with-pdo-sqlite --with-pear --with-png-dir --with-jpeg-dir --with-xmlrpc --with-xsl --with-zlib --with-bz2 --with-mhash --enable-bcmath --enable-libxml --enable-inline-optimization --enable-mbregex --enable-mbstring --enable-opcache --enable-pcntl --enable-shmop --enable-soap --enable-sockets --enable-sysvsem --enable-sysvshm --enable-xml --enable-zip --enable-fpm --disable-fileinfo --with-config-file-path=/usr/local/php/etc
```

## 编译安装参数说明


```text
# SAPI modules(PHP SAPI接口模块的选项)
--enable-fpm // 开启fpm模式(nginx等服务用的)
--with-fpm-user=www // fpm运行的用户
--with-fpm-group=www  // fpm运行的组

# General settings(综合设置):
--prefix=/usr/local/php // 指定安装目录
--with-config-file-path=/usr/local/php/etc // 指定php.ini位置
--with-libdir=lib64 // 指定Uxin系统库文件目录用于构建PHP。 对于64位系统, 需要指定lib64目录,比如--with-libdir=lib64
--enable-inline-optimization // 线程优化
--disable-fileinfo // 关闭fileinfo支持

# Extensions(扩展):
--enable-pcntl // Enable pcntl support (CLI/CGI only)
--with-curl // 启用cURL支持
--with-gd // 开启GD图像处理库
--with-freetype-dir // GD库; 指定FreeType2的安装目录
--with-gettext // 包含GNU gettext支持
--with-iconv-dir //XML; XMLRPC-EPI: iconv dir for XMLRPC-EPI
--with-kerberos // IMAP; 启用kerberos支持并指定其目录
--with-libxml-dir // LIBXML安装目录
--with-mysqli // 包含MySQLi支持。参数为mysql_config的位置
--with-openssl // 启用openssl支持 (OpenSSL版本号必须大于等于 0.9.6)
--with-pcre-regex // 引用pear兼容的正则表达式库
--with-pdo-mysql // PDO: MySQL support. DIR is the MySQL base directory If no value or mysqlnd is passed as DIR
--with-pdo-sqlite // PDO; 支持PDO
--with-pear // 打开pear命令的支持，PHP扩展用的
--with-png-dir // GD: 指定libpng的安装目录
--with-jpeg-dir // GD: 指定libjpeg的安装目录
--with-xmlrpc // Include XMLRPC-EPI support
--with-xsl // Include XSL support
--with-zlib // 开启ZLIB支持 (ZLIB版本号必须大于等于 1.0.9)
--with-bz2 // 开启BZip2
--enable-mbstring // 启用多字节字符串的支持
```
