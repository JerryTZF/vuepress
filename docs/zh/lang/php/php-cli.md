# 2、CLI模式常用命令


## 示例

```shell
$ php -h
Usage: php [options] [-f] <file> [--] [args...]
   php [options] -r <code> [--] [args...]
   php [options] [-B <begin_code>] -R <code> [-E <end_code>] [--] [args...]
   php [options] [-B <begin_code>] -F <file> [-E <end_code>] [--] [args...]
   php [options] -S <addr>:<port> [-t docroot] [router]
   php [options] -- [args...]
   php [options] -a

  -a               以交互shell模式运行
  -c <path>|<file> 指定php.ini文件所在的目录
  -n               指定不使用php.ini文件
  -d foo[=bar]     定义一个INI实体，key为foo，value为'bar'
  -e               为调试和分析生成扩展信息
  -f <file>        解释和执行文件<file>
  -h               打印帮助信息
  -i               显示PHP的基本信息
  -l               进行语法检查(lint)
  -m               显示编译到内核的模块
  -r <code>        运行PHP代码<code>，不需要使用标签<?..?>
  -B <begin_code>  在处理输入之前先执行PHP代码<begin_code>
  -R <code>        对输入的每一行作为PHP代码<code>运行       
  -F <file>        对输入的每一行解析和执行<file>
  -E <end_code>    在处理所有输入的行之后执行PHP代码<end_code>
  -H               隐藏任何来自外部工具传递的参数
  -S <addr>:<port> 运行内置的web服务器
  -t <docroot>     指定用于内置web服务器的文档根目录<docroot>
  -s               输出HTML语法高亮的源码
  -v               输出PHP的版本号
  -w               输出去掉注释和空格的源码
  -z <file>        载入Zend扩展文件<file>
                   

  args...          传递给要运行的脚本的参数。当第一个参数以'-'开始或者是脚本是从标准输入读取的时候，使用'--'参数
  --ini            显示PHP的配置文件名
  --rf <name>      显示关于函数<name>的信息
  --rc <name>      显示关于类<name>的信息
  --re <name>      显示关于扩展<name>的信息
  --rz <name>      显示关于Zend扩展<name>的信息
  --ri <name>      显示扩展<name>的配置信息
```


