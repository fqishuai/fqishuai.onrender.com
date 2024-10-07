---
tags: [nodejs, redis]
---

## `ioredis`
在使用 `ioredis` 进行 Redis 操作时，设置键的过期时间是一个常见的需求。你可以使用 Redis 的 `SET` 命令和 `EX` 参数来设置键值对的同时指定过期时间，或者使用 `EXPIRE` 命令来设置现有键的过期时间。

下面是如何使用 `ioredis` 设置键的过期时间的示例：

首先，确保你已经安装了 `ioredis`：

```sh
npm install ioredis
```

### 使用 SET 命令和 EX 参数

你可以在设置键值对的同时指定过期时间（以秒为单位）：

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 设置键值对，并指定过期时间为10秒
redis.set('mykey', 'value', 'EX', 10)
  .then(result => {
    console.log(result); // 输出 "OK"
  })
  .catch(err => {
    console.error(err);
  });
```

### 使用 EXPIRE 命令

如果你已经有一个键，并且想要设置或更新它的过期时间，可以使用 `EXPIRE` 命令：

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 设置键值对
redis.set('mykey', 'value')
  .then(() => {
    // 设置过期时间为10秒
    return redis.expire('mykey', 10);
  })
  .then(result => {
    console.log(result); // 输出 1 表示成功
  })
  .catch(err => {
    console.error(err);
  });
```

### 使用 SETEX 命令

`SETEX` 是 `SET` 和 `EXPIRE` 的组合，可以同时设置键值和过期时间：

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 使用 SETEX 设置键值对，并指定过期时间为10秒
redis.setex('mykey', 10, 'value')
  .then(result => {
    console.log(result); // 输出 "OK"
  })
  .catch(err => {
    console.error(err);
  });
```

### 使用 PEXPIRE 命令

如果你需要以毫秒为单位设置过期时间，可以使用 `PEXPIRE` 命令：

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 设置键值对
redis.set('mykey', 'value')
  .then(() => {
    // 设置过期时间为10000毫秒（即10秒）
    return redis.pexpire('mykey', 10000);
  })
  .then(result => {
    console.log(result); // 输出 1 表示成功
  })
  .catch(err => {
    console.error(err);
  });
```

总结:
- 使用 `SET` 命令和 `EX` 参数可以在设置键值对的同时指定过期时间。
- 使用 `EXPIRE` 命令可以为现有键设置或更新过期时间。
- 使用 `SETEX` 命令可以同时设置键值和过期时间。
- 使用 `PEXPIRE` 命令可以以毫秒为单位设置过期时间。

通过这些方法，你可以灵活地在 `ioredis` 中设置 Redis 键的过期时间。

## `ioredis` 和 `node-redis` 对比
`ioredis` 和 `node-redis` 是两个流行的 Node.js Redis 客户端库。它们各有优缺点，适用于不同的使用场景。以下是它们的对比：

### 功能特性

#### ioredis
- **支持集群**：原生支持 Redis 集群模式，可以自动处理节点的重新分配。
- **支持哨兵**：支持 Redis Sentinel，用于高可用性。
- **高级数据结构**：支持 Redis 的高级数据结构，如 HyperLogLog、Geo、Streams 等。
- **事务**：支持多种事务模式，包括 pipeline 和 multi。
- **Lua 脚本**：支持 Lua 脚本的执行。
- **自动重连**：提供自动重连机制，连接断开后会自动尝试重新连接。
- **Promise 支持**：内置 Promise 支持，适合现代异步编程风格。

#### node-redis
- **简单易用**：API 简单直观，适合初学者和简单的使用场景。
- **高性能**：性能较高，适合高并发场景。
- **事务**：支持基本的事务操作。
- **Lua 脚本**：支持 Lua 脚本的执行。
- **事件驱动**：基于事件驱动模型，适合实时应用。

### 性能

- **ioredis**：由于支持更多高级特性，性能可能稍逊于 `node-redis`，但在大多数场景下性能仍然足够。
- **node-redis**：性能较高，适合需要高吞吐量的应用。

### 易用性

- **ioredis**：API 设计现代化，支持 Promise 和 async/await，适合现代 JavaScript 开发。
- **node-redis**：API 简单直观，但主要基于回调函数，可能不如 Promise 友好。

### 社区和维护

- **ioredis**：社区活跃，更新频繁，文档详细。
- **node-redis**：社区也很活跃，更新较频繁，文档较为详细。

### 示例代码

#### ioredis
```javascript
const Redis = require('ioredis');
const redis = new Redis();

redis.set('foo', 'bar');
redis.get('foo', (err, result) => {
  console.log(result); // 'bar'
});

// 使用 Promise
redis.get('foo').then(result => {
  console.log(result); // 'bar'
});
```

#### node-redis
```javascript
const redis = require('redis');
const client = redis.createClient();

client.set('foo', 'bar', redis.print);
client.get('foo', (err, result) => {
  console.log(result); // 'bar'
});

// 使用 Promise (需要额外的库，如 util.promisify)
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);

getAsync('foo').then(result => {
  console.log(result); // 'bar'
});
```

### 选择建议

- 如果你需要使用 Redis 集群或 Sentinel，或者需要使用 Redis 的高级特性，推荐使用 `ioredis`。
- 如果你需要一个简单、高性能的 Redis 客户端，并且你的应用场景不需要集群或高级特性，`node-redis` 是一个不错的选择。

总之，选择哪个库取决于你的具体需求和使用场景。

## redis使用记录
### `(error) NOAUTH Authentication required.`
Redis 报错 `(error) NOAUTH Authentication required` 表示在执行命令之前需要进行身份验证。这个错误通常发生在 Redis 服务器配置了密码保护的情况下。要解决这个问题，你需要在连接 Redis 服务器时提供正确的密码。

以下是如何在不同的 Redis 客户端中进行身份验证的示例：

#### ioredis
```javascript
const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost', // Redis 服务器地址
  port: 6379,        // Redis 服务器端口
  password: 'your_password' // Redis 密码
});

redis.set('foo', 'bar').then(() => {
  return redis.get('foo');
}).then(result => {
  console.log(result); // 'bar'
}).catch(err => {
  console.error(err);
});
```

#### node-redis
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost', // Redis 服务器地址
  port: 6379,        // Redis 服务器端口
  password: 'your_password' // Redis 密码
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.set('foo', 'bar', redis.print);
client.get('foo', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // 'bar'
  }
});
```

#### redis-cli
如果你使用的是 `redis-cli` 命令行工具，可以通过以下方式进行身份验证：
```sh
redis-cli -a your_password
```
或者在连接后手动进行身份验证：
```sh
redis-cli
> AUTH your_password
> SET foo bar
> GET foo
```

#### 配置文件
如果你需要在 Redis 配置文件中设置密码，可以在 `redis.conf` 文件中找到以下行并取消注释或添加：
```conf
requirepass your_password
```
然后重启 Redis 服务器使配置生效。

#### 总结
确保在连接 Redis 服务器时提供正确的密码，以避免 `(error) NOAUTH Authentication required` 错误。根据你使用的客户端库，按照相应的方式进行身份验证即可。

### `(error) ERR unknown command exists(123), with args beginning with:`
Redis 报错 `(error) ERR unknown command 'exists(123)', with args beginning with:` 表示你尝试执行的命令格式不正确。具体来说，`exists(123)` 不是一个有效的 Redis 命令。

在 Redis 中，`EXISTS` 命令用于检查一个或多个键是否存在。正确的用法是 `EXISTS key`，而不是 `exists(key)`。以下是一些正确的示例：

#### 正确的用法

##### redis-cli
```sh
# 检查单个键是否存在
EXISTS mykey

# 检查多个键是否存在
EXISTS key1 key2 key3
```

##### ioredis
```javascript
const Redis = require('ioredis');
const redis = new Redis();

redis.exists('mykey').then(result => {
  console.log(result); // 1 表示存在，0 表示不存在
}).catch(err => {
  console.error(err);
});

// 检查多个键
redis.exists('key1', 'key2', 'key3').then(result => {
  console.log(result); // 返回存在的键的数量
}).catch(err => {
  console.error(err);
});
```

##### node-redis
```javascript
const redis = require('redis');
const client = redis.createClient();

client.exists('mykey', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // 1 表示存在，0 表示不存在
  }
});

// 检查多个键
client.exists('key1', 'key2', 'key3', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // 返回存在的键的数量
  }
});
```

#### 常见错误原因
1. **命令格式错误**：确保命令格式正确，不要使用类似 `exists(key)` 这样的格式。
2. **拼写错误**：检查命令和键名的拼写是否正确。
3. **客户端库使用错误**：确保使用客户端库的正确方法来执行命令。

通过确保命令格式正确，可以避免 `(error) ERR unknown command` 错误。

### `(integer) 0`
在 Redis 中，`(integer) 0` 表示一个整数值为 0 的响应。具体含义取决于你执行的命令。以下是一些常见命令及其返回 `(integer) 0` 的情况：

1. EXISTS 命令
   如果你执行 `EXISTS mykey`，返回 `(integer) 0` 表示键 `mykey` 不存在。
   ```sh
   EXISTS mykey
   # (integer) 0
   ```

2. DEL 命令
   如果你执行 `DEL mykey`，返回 `(integer) 0` 表示键 `mykey` 不存在，因此没有删除任何键。
   ```sh
   DEL mykey
   # (integer) 0
   ```

3. SETNX 命令
   如果你执行 `SETNX mykey value`，返回 `(integer) 0` 表示键 `mykey` 已经存在，因此没有设置新值。
   ```sh
   SETNX mykey value
   # (integer) 0
   ```

4. INCR 命令
   如果你执行 `INCR mykey`，并且 `mykey` 的值为 0 或者键不存在（Redis 会将不存在的键初始化为 0），那么返回的值将是 1，而不是 0。
   ```sh
   INCR mykey
   # (integer) 1
   ```

5. 其他可能的情况
   - **SISMEMBER**：检查成员是否在集合中，如果成员不在集合中，返回 `(integer) 0`。
   - **HEXISTS**：检查字段是否在哈希表中，如果字段不在哈希表中，返回 `(integer) 0`。


### 关闭`info`命令
使用Access Proxy的方式连接内部redis时报错：`ERR data connection don't process admin command.`

网上查找解决方案是需要关闭`info`命令，也就是不能执行`readyCheck`，使用`ioredis`的话就是不执行`_readyCheck`

在 `ioredis` 中，`_readyCheck` 是一个内部方法，用于在客户端连接到 Redis 服务器时执行一些检查，以确保连接已经准备好接受命令。通常情况下，你不需要也不应该直接调用或禁用这个内部方法，因为它是确保客户端正常工作的关键部分。

然而，如果你确实有特殊需求，需要跳过或自定义这个检查，可以考虑以下几种方法：

#### 方法一：自定义 Redis 客户端

你可以通过继承 `ioredis` 的 `Redis` 类并覆盖 `_readyCheck` 方法来实现自定义行为。

```javascript
const Redis = require('ioredis');

class CustomRedis extends Redis {
  constructor(options) {
    super(options);
  }

  // 覆盖 _readyCheck 方法
  _readyCheck(callback) {
    // 直接调用回调函数，跳过默认的 ready check
    callback(null, 'OK');
  }
}

const redis = new CustomRedis({
  host: 'localhost',
  port: 6379,
  // 如果需要身份验证，请添加密码
  // password: 'your_password'
});

redis.on('ready', () => {
  console.log('Redis client is ready to receive commands.');

  // 在 ready 事件触发后执行命令
  redis.set('foo', 'bar').then(() => {
    return redis.get('foo');
  }).then(result => {
    console.log(result); // 'bar'
  }).catch(err => {
    console.error(err);
  });
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
```

#### 方法二：使用低级别的连接选项

如果你不想覆盖内部方法，可以尝试使用低级别的连接选项来控制连接行为。不过，这种方法可能不如直接覆盖 `_readyCheck` 方法来得直接和有效。

```javascript
const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // 如果需要身份验证，请添加密码
  // password: 'your_password',
  enableReadyCheck: false // 禁用 ready check
});

redis.on('ready', () => {
  console.log('Redis client is ready to receive commands.');

  // 在 ready 事件触发后执行命令
  redis.set('foo', 'bar').then(() => {
    return redis.get('foo');
  }).then(result => {
    console.log(result); // 'bar'
  }).catch(err => {
    console.error(err);
  });
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});
```

注意事项：
1. **风险**：禁用或跳过 `_readyCheck` 方法可能会导致客户端在连接尚未完全准备好时执行命令，从而引发错误或不稳定的行为。
2. **调试**：确保在开发和测试环境中充分测试自定义行为，以避免在生产环境中出现意外问题。
3. **文档**：参考 `ioredis` 的官方文档和源码，了解更多关于内部方法和连接选项的信息。

虽然可以通过覆盖 `_readyCheck` 方法或使用低级别的连接选项来跳过默认的 ready check，但这通常不是推荐的做法。确保在充分了解潜在风险的情况下进行自定义，以避免引发不必要的问题。

### 查询所有的键
在 Redis 中，如果你想查询所有的键（keys），可以使用以下命令：

```plaintext
KEYS *
```

然而，这个命令在生产环境中不推荐使用，因为它会扫描整个数据库，可能会导致性能问题，尤其是在有大量键的情况下。

更好的方式是使用 `SCAN` 命令，它可以渐进式地遍历键空间，减少对 Redis 性能的影响。以下是 `SCAN` 命令的基本用法：

```plaintext
SCAN 0
```

这将从数据库的开头开始扫描，并返回一部分键。你需要持续调用 `SCAN` 命令，直到游标返回到 0 为止。每次调用 `SCAN` 都会返回一个新的游标和一部分键。例如：

```plaintext
127.0.0.1:6379> SCAN 0
1) "10"
2) 1) "key1"
   2) "key2"
   3) "key3"
127.0.0.1:6379> SCAN 10
1) "20"
2) 1) "key4"
   2) "key5"
127.0.0.1:6379> SCAN 20
1) "0"
2) (empty list or set)
```

在实际使用中，你可以使用以下代码来遍历所有键：

```python
import redis

r = redis.Redis(host='localhost', port=6379, db=0)
cursor = '0'
while cursor != 0:
    cursor, keys = r.scan(cursor=cursor)
    for key in keys:
        print(key)
```

这样，你可以安全且高效地遍历 Redis 中的所有键，而不会对 Redis 服务器造成过大的负载。

### 设置键的过期时间
在 Redis 中，设置键的过期时间是一个常见的操作，可以通过多种命令实现，包括 `EXPIRE`、`PEXPIRE`、`SETEX`、`PSETEX` 和 `SET` 命令与过期时间选项。下面是详细的说明和示例：

#### EXPIRE 命令

`EXPIRE` 命令用于为一个键设置过期时间（以秒为单位）。

```sh
EXPIRE key seconds
```

示例：

```sh
EXPIRE mykey 10
```

这将设置 `mykey` 在 10 秒后过期。

#### PEXPIRE 命令

`PEXPIRE` 命令用于为一个键设置过期时间（以毫秒为单位）。

```sh
PEXPIRE key milliseconds
```

示例：

```sh
PEXPIRE mykey 10000
```

这将设置 `mykey` 在 10000 毫秒（即 10 秒）后过期。

#### SETEX 命令

`SETEX` 命令用于设置键的值及其过期时间（以秒为单位）。

```sh
SETEX key seconds value
```

示例：

```sh
SETEX mykey 10 "value"
```

这将设置 `mykey` 的值为 `"value"`，并在 10 秒后过期。

#### PSETEX 命令

`PSETEX` 命令用于设置键的值及其过期时间（以毫秒为单位）。

```sh
PSETEX key milliseconds value
```

示例：

```sh
PSETEX mykey 10000 "value"
```

这将设置 `mykey` 的值为 `"value"`，并在 10000 毫秒（即 10 秒）后过期。

#### SET 命令与过期时间选项

`SET` 命令可以使用 `EX` 或 `PX` 参数来设置过期时间。

- `EX` 参数：过期时间以秒为单位。
- `PX` 参数：过期时间以毫秒为单位。

```sh
SET key value [EX seconds] [PX milliseconds]
```

示例：

```sh
SET mykey "value" EX 10
```

这将设置 `mykey` 的值为 `"value"`，并在 10 秒后过期。

```sh
SET mykey "value" PX 10000
```

这将设置 `mykey` 的值为 `"value"`，并在 10000 毫秒（即 10 秒）后过期。


以下是使用 `ioredis` 库在 Node.js 中执行上述 Redis 命令的示例代码：

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 使用 EXPIRE 命令设置过期时间为10秒
redis.set('mykey', 'value')
  .then(() => redis.expire('mykey', 10))
  .then(result => console.log(result))  // 输出 1 表示成功
  .catch(err => console.error(err));

// 使用 PEXPIRE 命令设置过期时间为10000毫秒
redis.set('mykey', 'value')
  .then(() => redis.pexpire('mykey', 10000))
  .then(result => console.log(result))  // 输出 1 表示成功
  .catch(err => console.error(err));

// 使用 SETEX 命令设置键值对，并指定过期时间为10秒
redis.setex('mykey', 10, 'value')
  .then(result => console.log(result))  // 输出 "OK"
  .catch(err => console.error(err));

// 使用 PSETEX 命令设置键值对，并指定过期时间为10000毫秒
redis.psetex('mykey', 10000, 'value')
  .then(result => console.log(result))  // 输出 "OK"
  .catch(err => console.error(err));

// 使用 SET 命令和 EX 参数设置键值对，并指定过期时间为10秒
redis.set('mykey', 'value', 'EX', 10)
  .then(result => console.log(result))  // 输出 "OK"
  .catch(err => console.error(err));

// 使用 SET 命令和 PX 参数设置键值对，并指定过期时间为10000毫秒
redis.set('mykey', 'value', 'PX', 10000)
  .then(result => console.log(result))  // 输出 "OK"
  .catch(err => console.error(err));
```

通过这些命令和示例代码，你可以在 Redis 中灵活地设置键的过期时间。