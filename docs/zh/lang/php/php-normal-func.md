# 3、常用函数

## 时间函数

```php
<?php
# 1、设置时区
date_default_timezone_set('Asia/Shanghai');
# 2、获取当前时间戳
time()
# 3、获取当前格式化时间
date('Y-m-d H:i:s',$timestamp);
# 4、获取当前微妙数
function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}
# 5、指定日期转换时间戳
mktime(int $hour,int $minute,int $second,int $month,int $day,int $year);
# 6、指定字符串格式日期转换时间戳
strtotime(string $time,[int now()]);
# 7、获取指定时间点的时间戳
strtotime('2020-01-31 12:00:00');
# 8、不知具体时间点 获取指定时间长度区间的时间戳、格式化日期
strtotime('+1 week 2 days 4 hours 2 seconds');
strtotime('next Monday');
date('Y-m-d H:i:s',strtotime('+1 day'));// 明天这个时间的日期,会随着时间变化而变化
// 明天下午4点23分的时间戳
date('Y-m-d 14:23:00',strtotime('+1 day'));
# 9、结合redis的失效时间的适用场景
// 到指定时间点的秒数 到明天下午4点23分的秒数
strtotime(date('Y-m-d 14:23:00',strtotime('+1 day'))) - time();
```

---

## 文件相关函数

```php
<?php

// 系统路径相关
# 1 返回路径中的文件名部分
basename( string $path [, string $suffix ]):string
# 2 相反的 返回路径中的目录部分
dirname( string $path ):string
# 3 指向当前脚本所在的目录
__DIR__
# 4 指向当前脚本
__FILE__
# 5 获取路径的基础信息
print_r( pathinfo('/ab/cd/e.php') );
Array(
　　[dirname] => /ab/cd
　　[basename] => e.php
　　[extension] => php
　　[filename] => e
)
# 6 返回规范化的绝对路径名
realpath( string $path ):string

// 文件系统相关函数
# 文件权限相关
// 改变文件的所有者
chown( string $filename , mixed $user ):bool
// 改变文件所属的组
chgrp( string $filename , mixed $group ):bool
// 用于改变文件读写模式
chmod( string $filename , int $mode ):bool
// 复制文件至指定位置
copy( string $source, string destination):bool
# 目录空间相关
// 指定目录的可用空间(字节数)
disk_free_space( string $directory ):float
// 指定目录的总空间大小(字节数)
disk_total_space( string $directory ):float
# 文件读写相关
// 打开文件
fopen( string $filename , string $mode [, bool $use_include_path = false [, resource $context ]] ):resource
$mdoe = [
    'r'  => '只读方式打开，将文件指针指向文件头',
    'r+' => '读写方式打开，将文件指针指向文件头',
    'w'  => '写入方式打开，将文件指针指向文件头并将文件大小截为零。如果文件不存在则尝试创建之',
    'w+' => '读写方式打开，将文件指针指向文件头并将文件大小截为零。如果文件不存在则尝试创建之',
    'a'  => '写入方式打开，将文件指针指向文件末尾。如果文件不存在则尝试创建之',
    'a+' => '读写方式打开，将文件指针指向文件末尾。如果文件不存在则尝试创建之',//
    'x'  => '创建并以写入方式打开，将文件指针指向文件头。如果文件已存在，则 fopen() 调用失败并返回 FALSE'
];
// 关闭文件
fclose( resource $handle ):bool
// 检测指针是否到了末尾或者EOF[遍历文件内容有奇效]
feof( resource $handle ):bool
// 从文件指针中读取一个字符
fgetc( resource $handle ):string
// 从文件指针中读入一行并解析 CSV 字段
fgetcsv( resource $handle , int $length = 0 , string $delimiter = ',' , string $enclosure = '"' ):array
// 将行格式化为 CSV 并写入一个打开的文件中
fputcsv( resource $handle , array $fields , string $delimiter = ',' , string $enclosure = '"' ):int
// 从文件中读出一行
fgets( resource $handle [, int $length ] ):string
// 从打开的文件中读取一行并过滤掉 HTML 和 PHP 标记
fgetss( resource $handle [, int $length [, string $allowable_tags ]] ):string
// 把整个文件读入一个数组中
file( string $filename [, int $flags = 0 [, resource $context ]] ):array
// 检查文件或目录是否存在
file_exists( string $filename ):bool
// 将整个文件读入一个字符串
file_get_contents(string $filename,bool $use_include_path = false,resource $context,int $offset = -1,int $maxlen):string
// 将一个字符串写入文件;和依次调用 fopen()，fwrite() 以及 fclose() 功能一样。
file_put_contents( string $filename , mixed $data [, int $flags = 0 [, resource $context ]] ):int (字节数)
// 返回文件大小
filesize( string $filename ):int
// 取得文件类型
filetype( string $filename ):string
// 轻便的咨询文件锁定(文件锁)
flock( resource $handle , int $operation [, int &$wouldblock ] ):bool
operation = ['LOCK_SH取得共享锁定（读取的程序)','LOCK_EX 取得独占锁定（写入的程序)','LOCK_UN 释放锁定(无论共享或独占)']
// 从文件指针 handle 读取最多 length 个字节
fread( resource $handle , int $length ):string
// 删除文件
unlink(realpath ( string $path )):bool
```

---

## 字符串相关函数

```php
<?php
// 正则匹配
$str = '2019-09-09 00:00:00';
$rex = '/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/';
preg_match($rex, $str, $matches); // return 0 or 1
print_r($matches);

// 判断一个字符串中是否存在指定的字符串
$haystack = 'dasdadasdqweqwe';
$needle = 'qwe';
$res = strpos($haystack ,$needle); // 匹配返回offset(9) 反之false , 判断必须 ===

// 去掉字符串末尾特殊字符; 去掉字符串开头的特殊字符
rtrim($str); 
ltrim($str);

// 把一个字符串用指定分隔符分成几段
$delimiter = '#';
$string = 'qqq#eee#rrr';
explode( string $delimiter , string $string [, int $limit ] ) : array 
// $limit 是返回的数组的元素个数;负数则是除了|$limit|个的剩下的个数

// 数组按照指定分隔符合成字符串
$glue = '#';
$pieces = ['qqq','eee','rrr'];
implode( string $glue , array $pieces ) : string

lcfirst(); ucfirst(); strtolower(); strtoupper(); ucwords();

// 使用另一个字符串填充字符串为指定长度
str_pad(string $input , int $pad_length [, string $pad_string = " " [, int $pad_type = STR_PAD_RIGHT ]] ) : string
$input = 'joker';
$len = 10;
$str = '*';
$res = str_pad($input,$len,$str,STR_PAD_BOTH); // $res = '**joker***'

// 重复字符串
$input = 'joker';
$times = 3;
$res = str_repeat($input,$times);
str_repeat( string $input , int $multiplier ) : string

// 字符串替换
str_replace($needle,$replace,$haystack);
// Exp:1
$haystack = 'aaabbbccc$$$';
$needle = 'a';
$replace = '*';
str_replace($needle,$replace,$haystack); // ***bbbccc$$$
// Exp:2
$needle = ['aaa','ccc','$$'];
str_replace($needle,$replace,$haystack); // *bbb**$
// Exp:3
$needle = ['aaa','ccc'];
$replace = ['<','>'];
str_replace($needle,$replace,$haystack); // <bbb>$$$

// 字符串转为数组
str_split( string $string [, int $split_length = 1 每一段的长度] ) : array

// 切割字符串
strstr( string $haystack , mixed $needle [, bool $before_needle = FALSE ] ) : string
$haystack = 'aaa|bbb|ccc|';
$needle = '|';
$res = strstr($haystack,$needle); // |bbb|ccc|

// 计算字符串出现的次数
substr_count($haystack,$needle[$offset,$length]):int
$haystack = 'aabbccdd';
$needle = 'bb';
$offset = 3;
$length = 5;
substr_count($haystack,$needle,$offset,$length);

// 字符串替换
// 在$haystack中的偏移量和长度的内容替换为$needle
$haystack = 'aabbccdd';
$needle = '**';
$offset = 2;
$length = 2;
substr_replace($haystack,$needle,$offset,$length);

// 返回字符串的子串
$string = 'aassddffgg';
$start = 2;
$length = 2;
substr($string,$start,$length);
substr(string $string , int $start [, int $length ] ) : string
```

---

## 数组常用函数

```php
<?php

// 将数组中的所有键名修改为全大写或小写
array_change_key_case( array $array [, int $case = CASE_LOWER|CASE_UPPER ] ) : array

// 将数组分割为多个
array_chunk(array $arr, int $step, bool $isKeepKey);
$res = array_chunk(['a'=>'b','c'=>'d','d'=>'e','e'=>'f','f'=>'g'],2,true);
// result
$res = [
  ['a'=>'c','c'=>'d'],
  ['d'=>'e','e'=>'f'],
  ['f'=>'g']
];

// 返回数组指定一列
array_column($array, $colume_key, $index_key);
$array = [
  ['id'=>111,'name'=>'s','sex'],
  ['id'=>122,'name'=>'d','sex'],
  ['id'=>133,'name'=>'c','sex'],
];
$res = array_column($array,'name','id');
// result
$res = [111=>'s',122=>'d',133=>'c'];

// 创建一个数组，用一个数组的值作为其键名，另一个数组的值作为其值
array_combine( array $keys , array $values ) : array

// 统计数组中所有的值的次数
array_count_values( array $array ) : array

// 用回调函数过滤数组中的单元
$res = array_filter($records,function ($value,$key) {
    if ($value['id'] == 3245) {
        return false;
    }
    return true;
}, ARRAY_FILTER_USE_BOTH);

// 数组键值互换
array_flip( array $array ) : array

// 检查数组里是否有指定的键名或索引
array_key_exists( mixed $key , array $array ) : bool

// 返回数组中部分的或所有的键名
array_keys( array $array [, mixed $search_value = null [, bool $strict = false ]] ) : array

// 为数组的每个元素应用回调函数
// 单个数组参数 *只能对数组的value进行操作*
$res = array_map(function ($records) {
    return $records['first_name'].$records['last_name'];
},$records);
// 多个数组作为参数 *1、闭包的参数必须和数组个数想等;2、依旧是对多个函数的value进行操作*
// $res = [0=>[2135=>'JohnDoe'],1=>[3245=>'SallySmith'],2=>[5342=>'JaneJones'],3=>[5623=>'PeterDoe']] ; 并没有如愿key为id,value为全称
$res = array_map(function ($arr1,$arr2) {
    $s = [];
    $s[$arr2] = $arr1['first_name'].$arr1['last_name'];
    return $s;
},$records,array_column($records,'id'));

// 合并一个或多个数组
array_merge( array $array1 [, array $... ] ):array

// 弹出数组最后一个单元（出栈）
array_pop(array $array):array
array_push(array $array,$value):array

// 在数组中搜索给定的值，如果成功则返回首个相应的键名
array_search($needle,$haystack):mixed

// 从数组中取出一段(分页可以用)
array_slice( array $array , int $offset [, int $length = NULL [, bool $preserve_keys = false ]] )：array
$res = array_slice(['1','2','e','4','y','z'],0,2);
// result
['1','2']

// 去掉数组的一部分，用其他值取代
array_splice(array &$input , int $offset [, int $length = count($input) [, mixed $replacement = array() ]]):array
$input = ['a','b','c','d'];
array_splice($input,1,2,['B','C']);
// RESULT
$input = ['a','B','C','d']

// 二维数组按照键值排序
$arr=[
    ['name'=>'小坏龙a','age'=>28],
    ['name'=>'小坏龙b','age'=>38],
    ['name'=>'小坏龙c','age'=>8],
    ['name'=>'小坏龙d','age'=>6],
    ['name'=>'小坏龙e','age'=>31],
    ['name'=>'小坏龙f','age'=>999],
];
array_multisort(array_column($arr,'age'),SORT_DESC,$arr);
var_dump($arr);
```
