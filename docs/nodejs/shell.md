---
tags: [shell]
---

## Shell知识
### 1. if else-if else
```bash
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi
```

- if else 的 `[...]` 判断语句中大于使用 `-gt`，小于使用 `-lt`。
```bash
if [ "$a" -gt "$b" ]; then
    ...
fi
```

- 如果使用 `((...))` 作为判断语句，大于和小于可以直接使用 `>` 和 `<`。
```bash
if (( a > b )); then
    ...
fi
```

### 2. shell条件判断if中的-a到-z的意思
- `[ -a FILE ]` 如果 FILE 存在则为真。

- `[ -b FILE ]` 如果 FILE 存在且是一个块特殊文件则为真。

- `[ -c FILE ]` 如果 FILE 存在且是一个字特殊文件则为真。

- `[ -d FILE ]` 如果 FILE 存在且是一个目录则为真。

- `[ -e FILE ]` 如果 FILE 存在则为真。

- `[ -f FILE ]` 如果 FILE 存在且是一个普通文件则为真。

- `[ -g FILE ]` 如果 FILE 存在且已经设置了SGID则为真。

- `[ -h FILE ]` 如果 FILE 存在且是一个符号连接则为真。

- `[ -k FILE ]` 如果 FILE 存在且已经设置了粘制位则为真。

- `[ -p FILE ]` 如果 FILE 存在且是一个名字管道(F如果O)则为真。

- `[ -r FILE ]` 如果 FILE 存在且是可读的则为真。

- `[ -s FILE ]` 如果 FILE 存在且大小不为0则为真。

- `[ -t FD ]` 如果文件描述符 FD 打开且指向一个终端则为真。

- `[ -u FILE ]` 如果 FILE 存在且设置了SUID (set user ID)则为真。

- `[ -w FILE ]` 如果 FILE 如果 FILE 存在且是可写的则为真。

- `[ -x FILE ]` 如果 FILE 存在且是可执行的则为真。

- `[ -O FILE ]` 如果 FILE 存在且属有效用户ID则为真。

- `[ -G FILE ]` 如果 FILE 存在且属有效用户组则为真。

- `[ -L FILE ]` 如果 FILE 存在且是一个符号连接则为真。

- `[ -N FILE ]` 如果 FILE 存在 and has been mod如果ied since it was last read则为真。

- `[ -S FILE ]` 如果 FILE 存在且是一个套接字则为真。

- `[ FILE1 -nt FILE2 ]` 如果 FILE1 has been changed more recently than FILE2, or 如果 FILE1 exists and FILE2 does not则为真。

- `[ FILE1 -ot FILE2 ]` 如果 FILE1 比 FILE2 要老, 或者 FILE2 存在且 FILE1 不存在则为真。

- `[ FILE1 -ef FILE2 ]` 如果 FILE1 和 FILE2 指向相同的设备和节点号则为真。

- `[ -o OPTIONNAME ]` 如果 shell选项 “OPTIONNAME” 开启则为真。

- `[ -z STRING ]` “STRING” 的长度为零则为真。

- `[ -n STRING ]` or `[ STRING ]` “STRING” 的长度为非零 non-zero则为真。

- `[ STRING1 == STRING2 ]` 如果2个字符串相同。 “=” may be used instead of “==” for strict POSIX compliance则为真。

- `[ STRING1 != STRING2 ]` 如果字符串不相等则为真。

- `[ STRING1 < STRING2 ]` 如果 “STRING1” sorts before “STRING2” lexicographically in the current locale则为真。

- `[ STRING1 > STRING2 ]` 如果 “STRING1” sorts after “STRING2” lexicographically in the current locale则为真。

- `[ ARG1 OP ARG2 ]“OP”` is one of -eq, -ne, -lt, -le, -gt or -ge. These arithmetic binary operators return true if “ARG1” is equal to, not equal to, less than, less than or equal to, greater than, or greater than or equal to “ARG2”, respectively. “ARG1” and “ARG2” are integers.

### 3. echo 用于字符串的输出
- 显示普通字符串 `echo "It is a test"` 或者 `echo It is a test`

- 显示转义字符 `echo "\"It is a test\""`

- 显示变量 `echo "$name It is a test"`

- 显示换行
```bash
echo -e "OK! \n" # -e 开启转义
echo "It is a test"
```
结果：
```text
OK!

It is a test
```

### 4. 函数
- 定义一个函数并进行调用
```bash
#!/bin/bash

demoFun(){
    echo "这是我的第一个 shell 函数!"
}
echo "-----函数开始执行-----"
demoFun
echo "-----函数执行完毕-----"

## 结果：
-----函数开始执行-----
这是我的第一个 shell 函数!
-----函数执行完毕-----
```

- 定义一个带有return语句的函数
```bash
#!/bin/bash

funWithReturn(){
    echo "这个函数会对输入的两个数字进行相加运算..."
    echo "输入第一个数字: "
    read aNum
    echo "输入第二个数字: "
    read anotherNum
    echo "两个数字分别为 $aNum 和 $anotherNum !"
    return $(($aNum+$anotherNum))
}
funWithReturn
echo "输入的两个数字之和为 $? !"

## 结果：
这个函数会对输入的两个数字进行相加运算...
输入第一个数字: 
1
输入第二个数字: 
2
两个数字分别为 1 和 2 !
输入的两个数字之和为 3 !
```

### 5. ps 用于显示当前进程的状态

## JS Shell
- zx