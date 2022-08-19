---
slug: mac-usage
---

## Homebrew
:::tip
mac安装软件使用[brew](https://brew.sh/)，安装完brew后注意终端的提示，需要操作两步设置brew的path
node、git等尽量都别手动安装，不然卸载很痛苦～
:::
- brew help
- brew list
- brew install
- brew update
- brew uninstall

## vscode的code命令
- 打开VSCode –> command+shift+p –> 输入shell command –> 点击提示Shell Command: Install ‘code’ command in PATH运行
- 打开终端，cd到要用VSCode打开的文件夹，然后输入命令`code .`即可打开

## 右键打开终端
在文件(夹)上右键--->服务--->新建位于文件夹位置的终端窗口

## 显示（或者隐藏）隐藏的文件
`Shift+Command+(.)`

## 卸载手动安装的node
- 运行如下命令：
`sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/{npm*,node*,man1/node*}`

- 您必须注意，如果您运行此特定命令，您并没有实现完整的卸载 Node 任务。 那是因为主目录或主目录不会受到影响。 因此，通过这种方式，您仍然必须删除在您的主目录中找到的相关文件和文件夹。

- 之后，您必须删除使用 NPM 安装的每个全局包。 为此，请在终端上运行以下命令`rm –rf ~/.npm`。 键入引号中的命令后，您将完成在 Mac 上卸载 Node 和卸载 NPM 的任务。

## 远程连接
- ssh 连接远程服务器
  - 执行 `ssh 服务器用户名@服务器ip`，然后输入密码


- sftp 可以上传文件到远程或者从远程下载文件
  - cd 到本地需要上传到远程服务器的文件(夹)
  - 执行 `sftp 服务器用户名@服务器ip`，然后输入密码
  - cd 到远程服务器要放置该文件(夹)的路径
  - 执行 `put -pr 该文件(夹)名`    要保留修改时间、访问时间以及被传输的文件的模式，请使用 -p 标志；-r 参数允许拷贝子目录和子文件
  - bye：退出 sftp 或者 quit：退出 sftp 或者 exit：退出 sftp

- sftp的一些命令
  - `get remotefile [localfile]` 远程文件传输到本地。
  - `mkdir directory` 创建一个远程目录。
  - `rmdir path` 删除一个远程目录。

:::warn
使用 put 命令，如果目录名称不存在于远程主机上的工作目录中，可能会报错。所以，首先在远程主机上创建一个具有相同名称的目录，然后从本地主机上传它。
:::

## kill端口号
```bash
sudo lsof -i :<PortNumber>

kill -9 <PID>
```