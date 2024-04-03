---
tags: [api]
---

:::tip
[API documentation](https://nodejs.org/en/docs/)
:::

## File system
### 1. 校验是否是目录---statSync/isDirectory
```js
try {
  let stat = fs.statSync(path);
  if (!stat.isDirectory()) {
    throw new Error('the path expected to be a Directory');
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    fs.mkdirSync(path);
  } else {
    throw err;
  }
}
```
### 2. 检查文件是否存在---existsSync/access/accessSync
```js
// existsSync校验文件或文件夹是否存在
if (fs.existsSync(path)) {
  console.log('==========The path exists.');
} else {
  console.log('------The path does not exists.');
}

// access
// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// accessSync
try {
  fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```
### 3. 获取内容---readFileSync/readdirSync
```js
// 获取文件的内容
const fileContent = fs.readFileSync(path, 'utf-8');

// 获取目录下的内容
fs.readdirSync(dirPath).forEach(filePath => {

})
```

## Crypto
### 1. createCipheriv
```js
/**
 * 3DES加密/解密
 */
const cryptoInstance = require('crypto');

const ENCODING = 'utf-8';
const IV = 'xxx';
const SECRET_KEY = 'yyy';

function encode(plainText: string): string {
 if (!plainText) return plainText;
 const cipher = cryptoInstance.createCipheriv('des-ede3-cbc', SECRET_KEY, IV);
 const encrypted = cipher.update(plainText, ENCODING, 'base64');
 return encrypted + cipher.final('base64');
}
function decode(encryptText: string): string {
if (!encryptText) return encryptText;
const decipher = cryptoInstance.createDecipheriv('des-ede3-cbc', SECRET_KEY, IV);
const decrypted = decipher.update(encryptText, 'base64', ENCODING);
return decrypted + decipher.final(ENCODING);
}

export default {
 encode,
 decode,
};
```

## Child process
`child_process.spawn()` 方法异步衍生子进程，不会阻塞 Node.js 事件循环。

## [node-redis](https://github.com/redis/node-redis)
A high-performance Node.js Redis client.

## winston
> 除了【v3对比v2】中提到的v2，其他描述均基于v3

### 传输通道（[Winston Transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md#winston-transports)）
:::tip
- winston 收到日志后，会把日志作为消息传输到不同的通道（transport）中去，我们常用的控制台打印和文件存储都是一种传输通道。
- 默认会把日志打印到控制台(Console transport)中。
- 内置的传输通道有：Console Transport、File Transport、Http Transport、Stream Transport
:::

#### File Transport
```js
logger.add(new winston.transports.File(options));
```
- level: Level of messages that this transport should log (default: level set on parent logger).
- silent: Boolean flag indicating whether to suppress output (default false).
- eol: Line-ending character to use. (default: os.EOL).
- filename: The filename of the logfile to write output to.
- maxsize: Max size in bytes of the logfile, if the size is exceeded then a new file is created, a counter will become a suffix of the log file.
- maxFiles: Limit the number of files created when the size of the logfile is exceeded.
- tailable: If true, log files will be rolled based on maxsize and maxfiles, but in ascending order. The filename will always have the most recent log lines. The larger the appended number, the older the log file. This option requires maxFiles to be set, or it will be ignored.
- maxRetries: The number of stream creation retry attempts before entering a failed state. In a failed state the - transport stays active but performs a NOOP on it's log function. (default 2)
- zippedArchive: If true, all log files but the current one will be zipped.
- options: options passed to fs.createWriteStream (default {flags: 'a'}).
- stream: DEPRECATED The WriteableStream to write output to.

### v3对比v2
> 可以直接使用winston实例，也可以实例化自己的Logger。v2和v3创建winston实例的方式不同。

#### v2
1. 可以通过 add() 和 remove() 方法添加或删除传输，或者通过一次调用 configure() 来指定传输通道
```js
// add remove
winston.add(winston.transports.File, { filename: 'somefile.log' });
winston.remove(winston.transports.Console);

// configure
winston.configure({
  transports: [
    new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});
```
- filename: The filename of the logfile to write output to.
- level: Level of messages that this transport should log.
- maxsize: Max size in bytes of the logfile, if the size is exceeded then a new file is created, a counter will become a suffix of the log file.日志文件的最大字节大小，如果超过大小则创建一个新文件，计数器将成为日志文件的后缀。
- maxFiles: Limit the number of files created when the size of the logfile is exceeded.限制超过日志文件大小时创建的文件数。
- json: If true, messages will be logged as JSON (default true).
- tailable: If true, log files will be rolled based on maxsize and maxfiles, but in ascending order. The filename will always have the most recent log lines. The larger the appended number, the older the log file. This option requires maxFiles to be set, or it will be ignored. 如果为 true，日志文件将根据 maxsize 和 maxfiles 滚动，但按升序排列。文件名将始终包含最新的日志行。附加的数字越大，日志文件越旧。此选项需要设置 maxFiles，否则将被忽略。
- formatter: If function is specified and json is set to false, its return value will be used instead of default output. (default undefined)

2. 实例化自己的 Logger
```js
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});

// Logging
logger.log('info', 'Hello distributed log files!');
logger.info('Hello again distributed logs');

// Adding / Removing Transports (Yes It's chainable)
logger
 .add(winston.transports.File)
 .remove(winston.transports.Console);

// 可以使用configure()重新设置logger实例的配置项
  var logger = new winston.Logger({
    level: 'info',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

  // Replaces the previous transports with those in the new configuration wholesale.
  logger.configure({
    level: 'verbose',
    transports: [
      new (require('winston-daily-rotate-file'))(opts)
    ]
  });
```

3. 创建多个具有不同设置的记录器实例，可以使用以下两种方式：
- winston.loggers
> 实际上，winston.loggers 只是 winston.Container 的预定义实例

```js
var winston = require('winston');

// Configure the logger for `category1`
winston.loggers.add('category1', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'category one'
  },
  file: {
    filename: '/path/to/some/file'
  }
});

// Configure the logger for `category2`
winston.loggers.add('category2', {
  couchdb: {
    host: '127.0.0.1',
    port: 5984
  }
});

// Grab your preconfigured logger 获取您预先配置的记录器
var category1 = winston.loggers.get('category1');

category1.info('logging from your IoC container-based logger');
```

- instances of winston.Container
```js
var winston = require('winston'),
  container = new winston.Container();

container.add('category1', {
  console: {
    level: 'silly',
    colorize: true
  },
  file: {
    filename: '/path/to/some/file'
  }
});
```
