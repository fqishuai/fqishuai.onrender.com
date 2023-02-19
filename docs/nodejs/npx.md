### npx是啥
npx 是 npm5.2.0版本新增的一个工具包，定义为npm包的执行者，相比 npm，npx 会自动安装依赖包并执行某个命令。

npm自带npx，可以直接使用，如果没有可以手动安装一下：`npm i -g npx`

### npx和npm的区别
- npx侧重于执行命令的，执行某个模块命令。虽然会自动安装模块，但是重在执行某个命令。
- npm侧重于安装或者卸载某个模块的。重在安装，并不具备执行某个模块的功能。

假如我们要用 create-react-app 脚手架创建一个 react 项目，常规的做法是先安装 create-react-app，然后才能使用 create-react-app 执行命令进行项目创建。
```bash
npm i -g create-react-app
create-react-app my-react-app
```

有了 npx 后，我们可以省略安装 create-react-app 这一步。
```bash
npx create-react-app my-react-app
```

### npx工作方式
npx 会在当前目录下的`./node_modules/.bin`里去查找是否有可执行的命令，没有找到的话再从全局里查找是否有安装对应的模块，全局也没有的话就会自动下载对应的模块，如上面的 create-react-app，npx 会将 create-react-app 下载到一个临时目录，用完即删，不会占用本地资源。

### npx命令参数
- `--no-install`：不要自动下载，也就意味着如果本地没有该模块则无法执行后续的命令。
```bash
npx --no-install create-react-app my-react-app

## not found: create-react-app
```

- `--ignore-existing`：忽略本地已经存在的模块，每次都去执行下载操作，也就是每次都会下载安装临时模块并在用完后删除。

- `-p`：可以指定某一个版本进行安装。`-p` 还可以用于同时安装多个模块。
```bash
# 指定某一个版本进行安装
npx -p node@12.0.0 node index.js

# 同时安装多个模块
npx -p lolcatjs -p cowsay [command]
```

- `-c`：所有命令都用npx解释。
```bash
npx -p lolcatjs -p cowsay 'cowsay hello | lolcatjs'

# 上面这样运行会报错
# 因为第一项命令cowsay hello默认有npx解释，但第二项命令localcatjs会有shell解释，
# 此时lolcatjs并没有全局安装，所有就报错了。
# 这时候可以用-c参数来解决
npx -p lolcatjs -p cowsay -c 'cowsay hello | lolcatjs'
```