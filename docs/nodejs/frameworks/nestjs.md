# NestJS
## 路线图
使用 claude 3.5 sonnet，提示词：生成一份非常详细的 NestJS 学习路线，要求：1. 分层级展示核心内容 2. 各级标题包含关键词和扩展要点 3. 支持导出为XMind可识别的Markdown格式
```md
# NestJS 学习路线

## 1. 基础知识
### 1.1 TypeScript 基础
#### 1.1.1 类型系统
- 基本类型：number, string, boolean, array, tuple, enum, any, void
- 高级类型：union, intersection, literal, nullable, never, unknown
- 类型推断和类型断言

#### 1.1.2 接口和类
- 接口定义和实现
- 类的创建和继承
- 访问修饰符：public, private, protected
- 抽象类和方法

#### 1.1.3 泛型
- 泛型函数和泛型接口
- 泛型类和泛型约束
- 条件类型和映射类型

#### 1.1.4 装饰器
- 类装饰器
- 方法装饰器
- 属性装饰器
- 参数装饰器

### 1.2 Node.js 基础
#### 1.2.1 异步编程
- 回调函数
- Promise 和 async/await
- 事件发射器 (EventEmitter)

#### 1.2.2 模块系统
- CommonJS 模块
- ES 模块
- 模块加载机制

#### 1.2.3 事件循环
- 宏任务和微任务
- setImmediate vs setTimeout
- process.nextTick

#### 1.2.4 流和缓冲区
- 可读流和可写流
- 管道和链式流
- Buffer 操作

## 2. NestJS 核心概念
### 2.1 模块化架构
#### 2.1.1 @Module 装饰器
- imports: 导入其他模块
- controllers: 声明控制器
- providers: 声明提供者
- exports: 导出提供者

#### 2.1.2 功能模块划分
- 特性模块
- 共享模块
- 动态模块

#### 2.1.3 模块间通信
- 导出和导入服务
- 全局模块
- 模块引用

### 2.2 依赖注入 (DI)
#### 2.2.1 控制反转 (IoC)
- IoC 容器
- 依赖关系图
- 循环依赖处理

#### 2.2.2 提供者 (Providers)
- 使用 @Injectable() 装饰器
- 自定义提供者
- 异步提供者

#### 2.2.3 注入作用域
- DEFAULT (单例)
- REQUEST
- TRANSIENT

#### 2.2.4 可选提供者
- @Optional() 装饰器
- 属性注入

### 2.3 控制器 (Controllers)
#### 2.3.1 路由处理
- @Controller() 装饰器
- 路由通配符
- 子域路由

#### 2.3.2 请求方法装饰器
- @Get(), @Post(), @Put(), @Delete(), @Patch()
- @All() 处理任何 HTTP 方法
- 自定义 HTTP 方法装饰器

#### 2.3.3 参数装饰器
- @Param(), @Query(), @Body()
- @Headers(), @Ip()
- @Session(), @HostParam()

#### 2.3.4 状态码和响应处理
- @HttpCode() 装饰器
- @Header() 装饰器
- @Redirect() 装饰器

### 2.4 提供者 (Providers)
#### 2.4.1 服务 (Services)
- 业务逻辑封装
- 数据访问和操作
- 跨模块服务共享

#### 2.4.2 工厂提供者
- useFactory
- inject 选项
- 异步工厂

#### 2.4.3 别名提供者
- useExisting
- 提供者别名

#### 2.4.4 非服务提供者
- 值提供者 (useValue)
- 类提供者 (useClass)

## 3. 高级特性
### 3.1 中间件 (Middleware)
#### 3.1.1 函数中间件
- 创建函数中间件
- 应用函数中间件

#### 3.1.2 类中间件
- 实现 NestMiddleware 接口
- 依赖注入在中间件中的应用

#### 3.1.3 全局中间件
- 使用 app.use()
- 配置全局中间件

#### 3.1.4 路由特定中间件
- 为特定路由应用中间件
- 排除特定路由

### 3.2 异常过滤器
#### 3.2.1 内置 HTTP 异常
- HttpException 类
- 特定 HTTP 异常类

#### 3.2.2 自定义异常
- 扩展 HttpException
- 创建领域特定异常

#### 3.2.3 异常过滤器实现
- 实现 ExceptionFilter 接口
- 捕获和处理异常

#### 3.2.4 异常层次结构
- 基类和子类异常
- 异常继承关系

### 3.3 管道 (Pipes)
#### 3.3.1 数据转换
- ParseIntPipe, ParseFloatPipe
- ParseBoolPipe, ParseArrayPipe
- 自定义转换管道

#### 3.3.2 数据验证
- ValidationPipe
- 类验证器和类转换器
- 自定义验证管道

#### 3.3.3 内置管道
- DefaultValuePipe
- ParseUUIDPipe
- 其他内置管道的使用

#### 3.3.4 自定义管道
- 实现 PipeTransform 接口
- 异步管道

### 3.4 守卫 (Guards)
#### 3.4.1 身份验证
- 实现 CanActivate 接口
- JWT 认证守卫

#### 3.4.2 授权
- 基于角色的守卫
- 权限检查守卫

#### 3.4.3 路由守卫
- 全局守卫
- 控制器级别守卫
- 方法级别守卫

#### 3.4.4 自定义元数据
- 使用 @SetMetadata()
- Reflector 类的应用

### 3.5 拦截器 (Interceptors)
#### 3.5.1 请求/响应操作
- 实现 NestInterceptor 接口
- 修改请求和响应

#### 3.5.2 缓存
- 缓存拦截器实现
- 缓存策略

#### 3.5.3 响应映射
- 转换响应数据
- 处理 null 和 undefined 值

#### 3.5.4 异常映射
- 覆盖抛出的异常
- RxJS 操作符的使用

## 4. 数据库集成
### 4.1 TypeORM
#### 4.1.1 实体定义
- @Entity() 装饰器
- 列类型和属性
- 主键和索引

#### 4.1.2 关系映射
- 一对一关系
- 一对多和多对一关系
- 多对多关系

#### 4.1.3 查询构建器
- 基本查询操作
- 复杂条件查询
- 原始 SQL 查询

#### 4.1.4 事务处理
- 事务装饰器
- 手动事务控制

### 4.2 Mongoose
#### 4.2.1 模式定义
- 创建 Mongoose 模式
- 模式验证器
- 中间件和钩子

#### 4.2.2 模型创建
- 从模式创建模型
- 模型方法和静态方法

#### 4.2.3 数据操作
- CRUD 操作
- 高级查询
- 聚合管道

#### 4.2.4 填充 (Population)
- 引用文档
- 嵌套填充

## 5. 认证与授权
### 5.1 Passport 集成
#### 5.1.1 本地策略
- 用户名密码认证
- 实现 LocalStrategy

#### 5.1.2 JWT 策略
- JWT 令牌生成
- 实现 JwtStrategy
- 刷新令牌机制

#### 5.1.3 OAuth 策略
- 社交媒体登录
- OAuth2 流程实现

#### 5.1.4 多重认证
- 组合多个认证策略
- 认证顺序控制

### 5.2 RBAC (基于角色的访问控制)
#### 5.2.1 角色定义
- 角色模型设计
- 角色分配机制

#### 5.2.2 权限管理
- 权限模型设计
- 权限分配和继承

#### 5.2.3 动态授权
- 基于上下文的授权
- 动态角色和权限调整

#### 5.2.4 权限中间件
- 实现权限检查中间件
- 集成到路由或全局

## 6. API 文档
### 6.1 Swagger 集成
#### 6.1.1 API 装饰器
- @ApiTags()
- @ApiOperation()
- @ApiResponse()

#### 6.1.2 模型定义
- @ApiProperty()
- 枚举和复杂类型
- 继承和组合

#### 6.1.3 文档生成
- SwaggerModule 配置
- 自定义文档选项
- 文档版本控制

#### 6.1.4 安全定义
- API 密钥认证
- OAuth2 集成
- JWT 认证文档

## 7. 测试
### 7.1 单元测试
#### 7.1.1 Jest 框架
- 测试套件和测试用例
- 断言和匹配器
- 异步测试

#### 7.1.2 模拟依赖
- jest.mock() 和 jest.spyOn()
- 模拟服务和数据库
- 模拟 HTTP 请求

#### 7.1.3 测试覆盖率
- 配置覆盖率报告
- 分支覆盖和语句覆盖
- 持续集成中的覆盖率检查

#### 7.1.4 快照测试
- 创建和更新快照
- 组件快照测试

### 7.2 e2e 测试
#### 7.2.1 Supertest
- HTTP 请求测试
- 响应断言
- 认证和会话处理

#### 7.2.2 测试数据库
- 测试数据库设置
- 数据填充和清理
- 事务回滚

#### 7.2.3 模拟外部服务
- 使用 nock 模拟 HTTP 请求
- 模拟第三方 API

#### 7.2.4 并行测试
- 配置并行测试运行
- 处理测试间干扰

## 8. 部署与运维
### 8.1 Docker 容器化
#### 8.1.1 Dockerfile 编写
- 基础镜像选择
- 多阶段构建
- 优化镜像大小

#### 8.1.2 Docker Compose
- 定义服务
- 环境变量管理
- 网络配置

#### 8.1.3 多阶段构建
- 开发和生产环境分离
- 构建缓存优化

#### 8.1.4 容器编排
- Kubernetes 基础
- 部署 NestJS 应用到 K8s

### 8.2 CI/CD 流程
#### 8.2.1 GitLab CI
- .gitlab-ci.yml 配置
- 管道和作业定义
- 缓存和工件

#### 8.2.2 GitHub Actions
- 工作流定义
- 环境secrets管理
- 自动化测试和部署

#### 8.2.3 自动化部署
- 蓝绿部署
- 金丝雀发布
- 回滚策略

#### 8.2.4 持续监控
- 健康检查端点
- 日志聚合
- 性能监控集成

### 8.3 监控与日志
#### 8.3.1 Prometheus 集成
- 指标收集
- 自定义指标
- 告警规则配置

#### 8.3.2 ELK 栈
- Logstash 日志收集
- Elasticsearch 索引和查询
- Kibana 可视化

#### 8.3.3 应用性能监控 (APM)
- 分布式追踪
- 性能瓶颈分析
- 用户体验监控

#### 8.3.4 日志最佳实践
- 结构化日志
- 日志级别管理
- 敏感信息处理

## 9. 高级主题
### 9.1 微服务架构
#### 9.1.1 服务发现
- 客户端发现模式
- 服务端发现模式
- 服务注册与注销

#### 9.1.2 负载均衡
- 客户端负载均衡
- 服务端负载均衡
- 健康检查和熔断

#### 9.1.3 消息队列集成
- RabbitMQ 集成
- Kafka 集成
- 消息序列化和反序列化

#### 9.1.4 API 网关
- 路由
- 认证和授权
- 限流和缓存

### 9.2 GraphQL
#### 9.2.1 模式定义
- 类型定义
- 查询和变更
- 自定义标量

#### 9.2.2 解析器
- 字段解析器
- 参数解析
- 上下文和依赖注入

#### 9.2.3 订阅
- 实时更新
- 过滤订阅
- WebSocket
```

打开Xmind桌面应用，文件-->导入MarkDown文件-->选择上述生成的MarkDown文件，保存为图片：
![NestJS学习路线图](../img/NestJS学习路线.png)

## 介绍
Nest（[NestJS](https://nestjs.com/)）是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，基于 TypeScript 构建并完全支持 TypeScript（同时也允许开发者使用纯 JavaScript 编码），并结合了面向对象编程（OOP）、函数式编程（FP）和函数响应式编程（FRP）的元素。在底层，Nest 利用了强大的 HTTP 服务器框架，如 Express（默认使用），并且还可以选择配置使用 Fastify！Nest 在这些常见的 Node.js 框架（Express/Fastify）之上提供了一层抽象，但同时也直接向开发者暴露了它们的 API。这给予了开发者自由使用大量可用于底层平台的第三方模块的能力。

Nest.js 的设计理念：提供一个完整的架构解决方案，以应对 Node.js 生态系统中缺乏统一架构的问题。Nest 提供了一个开箱即用的应用程序架构，使开发者和团队能够创建高度可测试、可扩展、松耦合且易于维护的应用程序。它旨在创建一个结构化、可维护且高效的开发环境，特别适合构建复杂的服务器端应用程序。

Nest 的目标是成为一个与平台无关的框架。平台独立性使得创建可重复使用的逻辑部件成为可能，开发人员可以在多种不同类型的应用程序中利用这些逻辑部件。从技术上讲，一旦创建了适配器，Nest 就能与任何 Node HTTP 框架协同工作。开箱即支持两种 HTTP 平台：Express (`@nestjs/platform-express`) 和 fastify (`@nestjs/platform-fastify`)。您可以选择最适合您需求的一种。

无论使用哪个平台，它都会公开自己的应用程序接口。它们分别是 `NestExpressApplication` 和 `NestFastifyApplication`。如下例所示，当你向 `NestFactory.create()` 方法传递一个类型时，应用程序对象将有专门用于该特定平台的方法。但请注意，除非您确实想访问底层平台 API，否则无需指定类型。
```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

## 控制反转和依赖注入
依赖注入（Dependency Injection，简称DI）和控制反转（Inversion of Control，简称IoC）是两个密切相关的软件设计原则，它们在现代软件开发中扮演着重要角色，特别是在大型和复杂的应用程序中。让我们深入探讨这两个概念：

1. 控制反转（IoC）

控制反转是一种设计原则，它将程序的控制流程从程序员转移到外部框架或容器。

核心思想：
- 对象不应该自己控制其依赖关系的创建和管理。
- 这种控制应该被"反转"或委托给外部实体（通常是IoC容器）。

优点：
- 降低代码耦合度
- 提高模块化程度
- 简化测试过程
- 提高代码的可维护性和可扩展性

实现方式：
- 依赖注入（DI）是实现IoC的一种常见方式
- 服务定位器模式也是一种实现IoC的方法

2. 依赖注入（DI）

依赖注入是IoC的一种具体实现方式，它是一种设计模式，用于实现控制反转。

核心思想：
- 类不应该自己创建其依赖的对象，而应该从外部获取。
- 依赖应该被"注入"到需要它们的对象中。

主要形式：
a. 构造函数注入
```typescript
class Car {
  constructor(private engine: Engine) {}
}
```

b. 属性注入
```typescript
class Car {
  @Inject()
  private engine: Engine;
}
```

c. 方法注入
```typescript
class Car {
  private engine: Engine;
  
  @Inject()
  setEngine(engine: Engine) {
    this.engine = engine;
  }
}
```

优点：
- 降低组件间的耦合
- 提高代码的可测试性
- 增强代码的可维护性和可重用性
- 支持运行时动态绑定

3. IoC容器

IoC容器是实现依赖注入的框架部分。它负责：
- 创建对象
- 管理对象的整个生命周期（创建、存活、销毁）
- 将对象注入到其他对象中

在NestJS中，IoC容器是框架的核心部分，负责管理所有的依赖关系。

4. 依赖注入和IoC的关系

- IoC是一个更广泛的概念，描述了控制流的反转。
- DI是实现IoC的一种具体方法。
- 所有的DI都是IoC，但不是所有的IoC都是通过DI实现的。

### 实际应用示例（使用NestJS）

```typescript
// 定义一个服务
@Injectable()
class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

// 使用依赖注入
@Injectable()
class UserService {
  constructor(private logger: LoggerService) {}

  createUser(username: string) {
    this.logger.log(`Creating user: ${username}`);
    // 创建用户的逻辑
  }
}

// 在控制器中使用
@Controller('users')
class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() userData: { username: string }) {
    return this.userService.createUser(userData.username);
  }
}
```

在这个例子中：
- LoggerService 和 UserService 都被标记为可注入（@Injectable()）。
- UserService 通过构造函数注入依赖 LoggerService。
- UserController 通过构造函数注入依赖 UserService。
- NestJS的IoC容器负责创建这些服务的实例并管理它们之间的依赖关系。

:::tip
上述例子中的IoC和DI如下：
- 控制反转（IoC）：UserService 不需要自己创建 LoggerService 的实例、UserController 不需要自己创建 UserService 的实例，而是由 Nest.js 框架管理这些依赖关系。
- 依赖注入（DI）：UserService 通过构造函数被自动注入到 UserController 中、LoggerService 通过构造函数被自动注入到 UserService 中。
:::

### 依赖注入和IoC的好处

- 松耦合：组件之间的依赖关系被最小化。
- 可测试性：可以轻松地用模拟对象替换真实依赖，便于单元测试。
- 可维护性：更改实现不需要修改使用它的代码。
- 可重用性：组件可以在不同的上下文中重用。
- 灵活性：可以在运行时或配置中更改组件的实现。

总结：依赖注入和控制反转是现代软件开发中的重要概念，它们帮助开发者创建更加模块化、可测试和可维护的代码。在像NestJS这样的框架中，这些概念被深度集成，使得开发高质量的应用程序变得更加容易。

### NestJS中常用的依赖注入方式
依赖注入（Dependency Injection, DI）是 NestJS 的核心特性之一，它是一种设计模式，用于实现控制反转(IoC)。

依赖注入的核心思想是：类不应该自己创建其依赖的对象，而应该从外部获取。在 NestJS 中，这个"外部"就是 IoC 容器，NestJS 内置了一个控制反转（"IoC"）容器，用于管理提供者之间的关系。

在 NestJS 中，有几种常用的依赖注入方式。我们来详细讨论每种方式及其使用场景：

1. 构造函数注入

这是最常用且推荐的注入方式。在类的构造函数中声明依赖，NestJS 会自动解析并注入。

```typescript
@Injectable()
export class CatsService {
  constructor(private readonly databaseService: DatabaseService) {}
}
```

优点：
- 易于测试
- 依赖明确
- TypeScript 可以进行类型检查

使用场景：
- 大多数情况下的首选方法
- 当类需要在整个生命周期中使用依赖时

2. 属性注入

使用 `@Inject()` 装饰器直接注入到类的属性中。

```typescript
@Injectable()
export class CatsService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;
}
```

优点：
- 可以在需要时延迟注入
- 适用于可选依赖

使用场景：
- 当你想避免出现太多构造函数参数时
- 处理可选依赖时

:::warning
 如果你的类没有扩展另一个类，通常最好使用基于构造函数的注入。构造函数明确说明了哪些依赖关系是必需的，提供了更好的可见性，与使用 `@Inject` 的类属性相比，代码更容易理解。
:::

3. 方法注入

在方法上使用 `@Inject()` 装饰器。

```typescript
@Injectable()
export class CatsService {
  @Inject(DatabaseService)
  setDatabaseService(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }
}
```

优点：
- 可以在特定方法执行时注入依赖

使用场景：
- 当依赖只在特定方法中需要时
- 在某些高级场景中，如处理循环依赖

4. 工厂提供者注入

使用 `useFactory` 来动态创建提供者。

```typescript
@Module({
  providers: [
    {
      provide: CatsService,
      useFactory: (configService: ConfigService) => {
        return new CatsService(configService.getDatabaseUrl());
      },
      inject: [ConfigService],
    },
  ],
})
export class CatsModule {}
```

优点：
- 可以基于运行时条件或配置动态创建提供者
- 可以使用其他注入的依赖来创建提供者

使用场景：
- 当提供者的创建逻辑比较复杂时
- 当提供者的创建依赖于其他服务或配置时

5. 异步提供者注入

类似于工厂提供者，但支持异步操作。

```typescript
@Module({
  providers: [
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const connection = await createConnection(configService.getDbConfig());
        return connection;
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
```

优点：
- 可以处理异步初始化的依赖
- 适用于需要等待外部资源（如数据库连接）的场景

使用场景：
- 当依赖需要异步初始化时（例如，数据库连接、外部API客户端等）

6. 值提供者注入

直接提供一个值作为依赖。

```typescript
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: 'my-secret-key',
    },
  ],
})
export class AppModule {}
```

优点：
- 简单直接
- 适用于常量或配置值

使用场景：
- 注入配置值、常量或简单对象

7. 类提供者注入

这是最基本的提供者形式，通常与 `@Injectable()` 装饰器一起使用。

```typescript
@Module({
  providers: [CatsService],
})
export class CatsModule {}
```

优点：
- 简洁明了
- 适用于大多数标准服务类

使用场景：
- 对于大多数服务类，这是默认和推荐的方式

每种注入方式都有其适用的场景。选择哪种方式主要取决于你的具体需求、代码结构和个人偏好。在实际开发中，你可能会发现自己主要使用构造函数注入，同时在特定情况下使用其他方式来满足特殊需求。

## 创建项目
```bash
npm i -g @nestjs/cli
nest new project-name
```
生成的 Nest 项目会预装 eslint 和 prettier

入口文件 `main.ts`：
```ts title="main.ts"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```
:::tip
默认情况下，如果在创建应用程序时发生任何错误，应用程序将以代码 `1` 退出。如果想让应用程序抛出错误，请禁用 `abortOnError` 选项（例如，`NestFactory.create(AppModule, { abortOnError: false }）`）。
:::

启动命令：`npm run start`
:::tip
- 要加快开发进程（构建速度快 x20 倍），可以在启动脚本中传递 `-b swc` 标志来使用 SWC 生成器，如下所示 `npm run start -- -b swc`。
- 使用`npm run start:dev`命令启动将监控文件，文件变更时自动重新编译并重新加载服务。
:::

## Controllers
控制器负责处理接收到的请求，并将响应发送回客户端。

控制器的作用是处理应用程序的特定请求。路由机制决定由哪个控制器来处理每个请求。通常，一个控制器有多个路由，每个路由可以执行不同的操作。

要创建一个基本控制器，我们需要使用类和装饰器。装饰器将类与必要的元数据连接起来，使 Nest 可以创建一个路由图，将请求连接到相应的控制器。

使用 `@Controller()` 装饰器是定义基本控制器所必需的。在 `@Controller()` 装饰器中使用路径前缀可以帮助我们将相关路由分组，减少重复代码。
```ts title="cats.controller.ts"
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

控制器必须始终是模块的一部分，使用 `@Module()` 装饰器把控制器注册到模块中：
```ts title="app.module.ts"
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

`@Controller` 装饰器可以使用 `host` 选项，以要求传入请求的 HTTP host 符合某个特定值。
```ts
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```
也可以使用标记来捕获host名中的动态值，使用 `@HostParam()` 装饰器访问:
```ts
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

### 路由
路由路径包括可选的控制器路径前缀和方法装饰器中指定的任何路径字符串。例如，如果控制器前缀是 `cats`，方法装饰器是 `@Get('breed')`，那么生成的路由将是 GET `/cats/breed`。NestJS 还支持基于模式的路由。例如，星号（*）可用作通配符，以匹配路径末尾路由中的任意字符组合。如下`abcd/*`路由路径将匹配 `abcd/`、`abcd/123`、`abcd/abc` 等。
```ts
@Get('abcd/*')
findAll() {
  return 'This route uses a wildcard';
}
```

要定义带参数的路由，可以在路由路径中添加路由参数标记，以便从 URL 中获取动态值。然后，可以使用 `@Param()` 装饰器访问这些路由参数，并将其添加到方法签名中。
```ts
import { Get, Param } from '@nestjs/common';

@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```
也可以向装饰器传递特定的参数标记，并在方法主体中直接引用路由参数的名称:
```ts
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

:::tip
带参数的路径应在静态路径之后声明。这样可以防止参数化路径拦截静态路径的流量。
:::

### 请求及响应
Nest 使用两种不同的选项来处理响应：
1. 内置方法。当请求处理程序返回 JavaScript 对象或数组时，会自动将其序列化为 JSON。但是，当返回 JavaScript 原始类型（如字符串、数字、布尔值）时，Nest 将只发送值，而不会尝试将其序列化。这使得响应处理变得简单：只需返回值，Nest 就会处理其余部分。
2. 特定库。我们可以使用特定库（如 Express）的响应对象，该对象可以使用方法处理程序签名中的 `@Res()` 装饰器注入（如 `findAll(@Res() response)`）。通过这种方法，您可以使用该对象暴露的本地响应处理方法。例如，使用 Express，您可以使用 `response.status(200).send()` 这样的代码来构建响应。

处理程序通常需要访问客户端的请求详情。Nest 提供对底层平台（默认为 Express）请求对象的访问。通过在处理程序签名中使用 `@Req()` 装饰器指示 Nest 注入请求对象，就可以访问请求对象。
```ts title="cats.controller.ts"
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express'; // @types/express

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

下面列出了所提供的装饰器及其所代表的相应特定平台对象:
![装饰器](../img/nestjs装饰器.png)

为了与底层 HTTP 平台（如 Express 和 Fastify）的类型兼容，Nest 提供了 `@Res()` 和 `@Response()` 装饰器。`@Res()` 只是 `@Response()` 的别名。两者都直接暴露了底层本地平台响应对象接口。使用它们时，还应导入底层库的类型（如 `@types/express`），以充分利用它们的优势。请注意，在方法处理程序中注入 `@Res()` 或 `@Response()` 时，Nest 将进入该处理程序的特定库模式，并负责管理响应。这样做时，必须通过调用响应对象（如 `res.json(...)` 或 `res.send(...)`）来发出某种响应，否则 HTTP 服务器就会挂起。

Nest 为所有标准 HTTP 方法提供了装饰器： `@Get()`、`@Post()`、`@Put()`、`@Delete()`、`@Patch()`、`@Options()` 和 `@Head()`。此外，`@All()` 还定义了一个可处理所有这些方法的端点。
:::tip
这些是HTTP协议中常用的请求方法,每种方法有不同的用途和特点。我来详细介绍一下它们的区别:

1. GET
- 用于从服务器获取资源
- 参数通常附加在URL后面
- 不应该对服务器数据进行修改
- 可以被缓存
- 有长度限制
- 适合获取数据

2. POST 
- 向服务器提交数据
- 数据在请求体中
- 可以修改服务器数据
- 不可缓存
- 无长度限制
- 适合提交表单数据

3. PUT
- 更新服务器上的资源
- 客户端提供完整的更新后的资源
- 幂等性:多次请求效果相同
- 适合整体更新资源

4. DELETE
- 删除服务器上的资源
- 幂等性:多次请求效果相同
- 适合删除操作

5. PATCH
- 对资源进行部分修改
- 只需提供要修改的字段
- 非幂等:多次请求可能有不同效果
- 适合部分更新资源

6. OPTIONS
- 获取目标资源支持的通信选项
- 常用于CORS预检请求
- 不会修改服务器数据

7. HEAD
- 类似GET,但只返回头部信息
- 不返回响应体
- 用于获取资源元数据

主要区别:
- 安全性:GET/HEAD是安全的,不应修改服务器数据
- 幂等性:GET/HEAD/PUT/DELETE是幂等的
- 缓存:GET/HEAD可以被缓存
- 数据传输:GET通过URL,POST等通过请求体
- 使用场景:各有不同的适用场景

选择合适的方法可以更好地遵循RESTful API设计原则,提高API的可读性和可维护性。
:::

:::info
DTO（Data Transfer Object 数据传输对象）用于定义数据如何在网络上传输的对象模式。帮助规范化数据结构，提高代码的可维护性。可以使用 TypeScript 接口或简单的类来定义 DTO 模式。

管道（Pipes）是 Nest 中用于数据转换和验证的功能。它们需要在运行时访问变量的元类型信息。推荐使用类来定义 DTO 模式，因为类在编译后的 JavaScript 中仍然存在，TypeScript 接口在编译为 JavaScript 后会被移除导致运行时无法访问。
```ts
// 推荐：使用类
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

// 不推荐：使用接口
export interface CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

在定义 API 请求和响应的数据结构时使用类，这样可以利用 Nest 的全部功能，如验证、序列化等。
:::

使用 `@Body()` 装饰器接收请求参数：
```ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

在路由中处理查询参数时，可以使用 `@Query()` 装饰器从接收到的请求中提取参数。例如请求为：`/cats?age=2&breed=Persian`
```ts
@Get()
async findAll(@Query('age') age: number, @Query('breed') breed: string) {
  return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
}
```
如果你需要处理更复杂的查询参数，比如嵌套的对象或者数组如下所示，你需要配置 HTTP 适配器（Express 或 Fastify）以使用适当的查询解析器。
```js
?filter[where][name]=John&filter[where][age]=30

?item[]=1&item[]=2
```
在 Express 中，您可以使用扩展解析器，它允许使用丰富的查询对象:
```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('query parser', 'extended');
```
在 Fastify 中，可以使用 `querystringParser` 选项：
```ts
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),
  }),
);
```

### 自定义状态码
默认情况下，响应的状态代码总是 200，但 POST 请求除外，它使用的是 201。我们可以通过在处理程序级别添加 `@HttpCode(...)` 装饰器来轻松改变这种行为。
```ts
import { Controller, Get, Post, HttpCode } from '@nestjs/common';

@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

### 自定义响应头
要指定自定义响应头，可以使用 `@Header()` 装饰器或特定于库的响应对象（并直接调用 `res.header()`）。
```ts
import { Controller, Get, Post, Header } from '@nestjs/common';

@Post()
@Header('Cache-Control', 'no-store')
create() {
  return 'This action adds a new cat';
}
```

### 重定向
要将响应重定向到特定 URL，可以使用 `@Redirect()` 装饰器或特定于库的响应对象（并直接调用 `res.redirect()`）。

`@Redirect()` 有两个参数：`url` 和 `statusCode`，二者均为可选参数。如果省略，`statusCode` 的默认值是 `302（Found）`。
```ts
import { Controller, Get, Post, Redirect, } from '@nestjs/common';

@Get()
@Redirect('https://nestjs.com', 301)
```

注意：返回值将覆盖传递给 `@Redirect()` 装饰器的任何参数。如下，访问`/docs?version=5`将返回`'https://docs.nestjs.com/v5/'`
```ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

### 异步
Nest 完全支持异步函数，每个异步函数都必须返回一个 Promise，这允许你返回一个延迟值（指的是将来某个时刻才会得到的值），Nest 可以自动解析这个值（Nest 框架能够自动处理异步函数返回的 Promise，无需开发者手动解析）。
```ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

Nest 框架原生支持 RxJS，Nest允许路由处理器返回 RxJS 可观察流（Observable Streams）。Nest 将在内部处理订阅，并在流完成时解析最终发出的值。
```ts
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```
:::tip
RxJS 是一个用于处理异步和事件驱动编程的库。可观察流是 RxJS 的核心概念，代表一个随时间推移可以发出多个值的数据源。

Nest 自动管理对返回的 Observable 的订阅。开发者不需要手动订阅或取消订阅，Nest 在框架层面处理这些细节。

Nest 会等待 Observable 流完成。一旦流完成，Nest 会取最后发出的值作为响应返回给客户端。

使用场景：
- 处理长时间运行的操作
- 组合多个异步数据源
- 实现实时功能，如 WebSocket 通信
:::

## Providers
Providers 概念是 Nest.js 依赖注入系统的核心，它简化了复杂应用中对象关系的管理，使得开发者可以更专注于业务逻辑的实现。许多基本的 Nest 类都可以被视为 providers，包括：服务（services）、资源库（repositories）、工厂（factories）、辅助类（helpers）

controllers应处理 HTTP 请求，并将更复杂的任务委托给providers。

:::tip
Nest.js 允许开发者以面向对象的方式设计和组织依赖关系。这种设计方法有助于创建更加模块化、可维护和可扩展的代码。Nest.js强烈建议开发者遵循 SOLID 原则。SOLID 是面向对象编程和设计的五个基本原则的缩写，它们是：
- S：单一职责原则 (Single Responsibility Principle)
- O：开放封闭原则 (Open-Closed Principle)
- L：里氏替换原则 (Liskov Substitution Principle)
- I：接口隔离原则 (Interface Segregation Principle)
- D：依赖倒置原则 (Dependency Inversion Principle)

实际开发中应用SOLID：
- 在设计服务、控制器和模块时，应考虑每个组件的单一职责。
- 使用依赖注入来实现依赖倒置原则。
- 通过接口和抽象类来实现开放封闭原则和里氏替换原则。

为什么在 Nest.js 中遵循 SOLID 原则很重要：
- 提高代码质量：遵循这些原则可以帮助开发者编写更清晰、更易于理解和维护的代码。
- 增强可扩展性：使应用更容易适应变化和新需求。
- 提升可测试性：遵循 SOLID 原则的代码通常更容易进行单元测试。
- 与 Nest.js 的设计理念一致：Nest.js 的依赖注入和模块化设计天然支持 SOLID 原则。
:::

### Services
:::tip
可以使用脚手架命令快速生成一个service：`nest g service xxx`
:::

如下，`@Injectable()`装饰器是 NestJS 依赖注入系统的核心部分，它标记一个类可以被 IoC (Inversion of Control) 容器管理和注入，允许这个服务被注入到其他组件中，如控制器或其他服务。**默认情况下，被 `@Injectable()` 装饰的服务是单例的，整个应用共享同一个实例。**
```ts
import { Injectable } from '@nestjs/common';

interface Cat {
  name: string;
  age: number;
  breed: string;
}

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

### Providers的生命周期

提供者（Providers）的生命周期通常与应用程序的生命周期一致，在应用程序启动时实例化、在应用程序关闭时销毁。

也可以将提供者的生命期与特定请求相关联，这是一种特殊的生命周期管理方式，提供者的生命周期与特定的请求绑定，而不是整个应用程序的生命周期。

### 可选依赖(Optional providers)

`@Optional()` 是 Nest 框架提供的一个特殊装饰器，应用在构造函数的参数上，用于标记某个依赖项为可选。防止因缺少非关键依赖而导致的错误。

在某些情况下，一些依赖项可能不是必需的，这些依赖项可以在没有提供时使用默认值或者被忽略。

```ts
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```
上述代码尝试注入一个名为 'HTTP_OPTIONS' 的 HTTP 客户端配置，如果这个配置存在，它将被注入到 `httpClient` 参数中。如果不存在，由于 `@Optional()`，`httpClient` 将为 `undefined`，不会抛出错误。

`@Inject()`是 NestJS 提供的一个装饰器，用于指定依赖注入的标记（token）。

### 注册Provider

定义了一个提供者后，需要向 Nest 注册该服务，以便它可以处理注入。具体方法是将服务添加到 `@Module()` 装饰器中的`providers`。
```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

### 手动实例化
Nest 框架通常会自动处理依赖注入，这种自动化简化了大多数情况下的依赖管理。然而，在某些情况下，您可能需要跳出内置的依赖注入系统，手动检索或实例化提供者。以下简要讨论两种这样的技术：
- 使用模块引用（Module reference），用于动态获取或实例化提供者。适用于需要在运行时灵活管理依赖的场景。
- 在 `bootstrap()` 函数中获取提供者，用于在应用启动之前配置和使用某些服务。适用于独立应用程序。

## Modules
每个 Nest 应用程序至少有一个模块，即根模块，它作为 Nest 构建应用程序图的起点。这个图是 Nest 用来解析模块(modules)和提供者(providers)之间关系和依赖的内部结构。

强烈推荐使用模块作为组织组件的有效方式。对于大多数应用程序来说，你可能会有多个模块，每个模块封装一组密切相关的功能。

`@Module()` 装饰器接受一个单一的对象，用来描述模块的结构和行为。该对象的属性有：
- `providers` 列出模块中的服务提供者，这些提供者会被 Nest 的依赖注入系统实例化，它们可以在模块内共享，也可能被导出供其他模块使用。
- `controllers` 定义模块中的控制器，这些控制器负责处理传入的请求并返回响应，Nest 会自动实例化这些控制器。
- `imports` 用于导入其他模块，这允许模块之间共享功能和服务。
- `exports` 定义哪些提供者可以被其他导入此模块的模块使用。可以导出提供者本身或其令牌（provide 值）。这使得模块能够封装某些功能，同时选择性地暴露部分功能给外部。

默认情况下，模块内定义的提供者只在该模块内可见，这意味着其他模块不能直接访问或注入这些提供者。在一个模块中，可以注入两类提供者：a. 当前模块内定义的提供者；b. 从其他导入模块中明确导出的提供者。模块可以选择性地导出某些提供者，导出的提供者构成了模块的公共接口，其他导入该模块的模块可以使用这些提供者。

:::tip
在 NestJS 中，模块默认被创建为单例，这意味着每个模块在整个应用程序中只有一个实例。

由于模块是单例的，其中的提供者也通常是单例的。这允许在不同模块间轻松共享同一个提供者实例。

当多个模块导入包含某个提供者的模块时，它们实际上都在使用同一个提供者实例。

这种机制提高了应用的效率，因为不需要为每个模块创建单独的提供者实例。确保了在整个应用中使用的是同一个服务实例，保持了状态的一致性。

在设计模块和服务时，应该考虑到它们可能被多个模块共享。

单例模式有助于减少内存使用，因为不会创建多余的对象实例。
:::

### 功能模块
功能模块组织了与特定功能相关的代码，有助于保持清晰的边界和更好的组织。随着应用程序或团队的成长，这一点尤为重要，而且也符合 SOLID 原则。
```ts title="cats/cats.module.ts"
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

:::tip
可以使用脚手架命令快速生成一个module：`nest g module xxx`
:::

导入功能模块到根模块中：
```ts title="app.module.ts"
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

### 共享模块
```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```
将 `CatsService` 提供者添加到模块的 `exports` 数组中来导出它。这样，任何导入 `CatsModule` 的模块都可以访问 `CatsService`，并且会与所有其他导入它的模块共享同一个实例。

:::info
如果我们直接在每个需要它的模块中注册 `CatsService`，虽然也能工作，但会导致每个模块获得自己单独的 `CatsService` 实例。这可能导致内存使用增加，因为创建了同一服务的多个实例，而且如果服务维护任何内部状态，还可能导致意外行为，比如状态不一致。
:::

通过将 `CatsService` 封装在一个模块（如 `CatsModule`）内并导出它，我们确保了在所有导入 `CatsModule` 的模块之间重用同一个 `CatsService` 实例。这不仅减少了内存消耗，还导致了更可预测的行为，因为所有模块共享同一个实例，使得管理共享状态或资源变得更容易。这是像 NestJS 这样的框架中模块化和依赖注入的关键优势之一——允许服务在整个应用程序中高效共享。

:::warning
NestJS 允许在模块类中注入提供者。这意味着模块类可以使用构造函数注入来获取其他服务或提供者。如下示例：
```ts title="cats.module.ts"
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

但是，模块类本身不能被注入到其他类中作为提供者。这是 NestJS 框架的一个设计限制。如果允许模块类被注入，可能会导致循环依赖。循环依赖会造成初始化顺序的问题，可能导致运行时错误。

模块应该作为组织和封装其他组件（如服务、控制器）的容器，而不是直接参与业务逻辑。提供者（通常是services）用于实现具体的业务逻辑。
:::

### 全局模块
NestJS 将提供者封装在模块作用域内。如果不先导入封装模块，你无法在其他地方使用该模块的提供者。当你想提供一组应该随时可用的提供者（例如，辅助函数、数据库连接等）时，可以使用 `@Global()` 装饰器将模块设为全局模块。

`@Global()` 装饰器使模块成为全局作用域。

全局模块应该只注册一次，通常是由根模块或核心模块注册。

如下示例，希望注入 `CommonService` 的模块无需在其导入数组中导入 `CommonModule`。
```ts
@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
```

:::tip
应优先使用 `imports` 数组来管理模块间的依赖关系。谨慎使用全局模块，仅用于真正需要全局访问的服务。通过明确的导入，可以避免应用不同部分之间的过度耦合，避免不必要的依赖，减少潜在的副作用。
:::

### 动态模块
NestJS 允许在运行时动态配置模块。当模块需要根据不同的配置或环境变量来初始化时可以将其设计为动态模块。

通常通过静态方法 `forRoot()` 来创建动态模块。`forRoot()` 方法可以同步或异步返回一个动态模块。
- 同步返回：直接返回一个 `DynamicModule` 对象。适用于不需要异步操作的简单配置。
- 异步返回：返回一个 Promise。适用于需要异步操作的场景，如从远程服务器获取配置。

同步返回示例：
```ts
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```
可以如下使用`DatabaseModule`:
```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

请注意，动态模块返回的属性是对 `@Module()` 装饰器中定义的基础模块元数据的扩展（而不是覆盖）。如果动态模块和基础模块都定义了同名属性，它们会被合并而不是覆盖。

异步返回示例：
```ts
@Module({})
export class ConfigModule {
  static async forRoot(options: ConfigOptions): Promise<DynamicModule> {
    const config = await fetchConfigFromServer(options.serverUrl);
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG',
          useValue: config,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
```

通过设置 `global: true`，可以使动态模块在全局范围内可用。这意味着该模块可以在应用的任何地方使用，而无需显式导入。如下示例：
```ts
@Module({})
export class MyModule {
  static forRoot(): DynamicModule {
    return {
      module: MyModule,
      global: true,
      providers: [/* ... */],
      exports: [/* ... */],
    };
  }
}
```
将动态模块设置为全局是一个强大的特性，它可以简化模块的使用并提高代码的可重用性。然而，这应该谨慎使用，只有在模块确实需要在整个应用中广泛使用时才采用。

重新导出一个动态模块时，不需要再次调用其 `forRoot()` 方法。原因是当你在 `imports` 中使用 `forRoot()` 时，NestJS 已经配置并实例化了该动态模块，在 `exports` 中，你只需要引用模块类本身，而不是再次配置它。

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

## Middleware
中间件是在路由处理器之前被调用的函数。

NestJS 中间件在默认情况下等同于 Express 中间件。以下来自 Express 官方文档的描述阐述了中间件的功能：
- 执行任何代码。这意味着您可以在请求处理过程中插入任何逻辑，比如日志记录、数据验证、身份认证等。
- 对请求和响应对象进行修改。例如，您可以添加自定义头部、修改请求体、或设置响应状态码。
- 结束请求-响应周期。中间件可以通过发送响应来结束整个处理过程。这在某些情况下很有用，比如在认证失败时直接返回错误响应。
- 调用下一个中间件。通过调用 `next()` 函数，中间件可以将控制权传递给下一个中间件或路由处理器。
- `next()` 函数用于将控制权传递给下一个中间件或路由处理器。如果当前中间件函数没有结束请求-响应周期，它必须调用 `next()` 来将控制权传递给下一个中间件函数。否则，请求将会挂起，导致客户端一直等待响应。

使用场景：
- 日志记录
- 身份验证
- 请求解析
- 错误处理
- 跨域资源共享（CORS）

可以为一个路由应用多个中间件。中间件按照它们被应用的顺序执行。

### 自定义中间件
你可以通过两种方式在 Nest 中实现自定义中间件：使用函数，或者使用带有 `@Injectable()` 装饰器的类。类应该实现 `NestMiddleware` 接口，而函数则没有任何特殊要求。
- 函数中间件是一种简单的中间件形式，适用于不需要额外依赖或复杂逻辑的场景。如下示例：

  ```ts
  import { Request, Response, NextFunction } from 'express';

  export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request...`);
    next();
  }
  ```

- 类中间件更加强大和灵活，适用于需要依赖注入或更复杂逻辑的场景。`NestMiddleware` 接口要求类实现 `use` 方法，这个方法接收 `request` 对象、`response` 对象和 `next` 函数作为参数。如下示例：

  ```ts title="logger.middleware.ts"
  import { Injectable, NestMiddleware } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';

  @Injectable()
  export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      console.log('Request...');
      next();
    }
  }
  ```

使用类中间件的优势：
- 可以使用依赖注入，例如使用构造函数注入`loggerService`：
  ```ts
  import { Injectable, NestMiddleware } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
  import { LoggerService } from './logger.service';

  @Injectable()
  export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly loggerService: LoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
      this.loggerService.log(`Incoming request to ${req.url}`);
      next();
    }
  }
  ```
- 可以在类中定义多个方法，使代码更有组织性
- 更容易进行单元测试
- 可以在多个模块中重用

使用函数中间件的优势：
- 更简洁，适合简单的逻辑
- 不需要额外的装饰器和接口

### 注册中间件
与控制器、提供者等不同，中间件不是在 `@Module()` 装饰器中声明的。这是因为中间件通常需要更灵活的配置。

中间件是通过模块类的 `configure()` 方法来设置的。这个方法允许我们动态地配置中间件，包括它们应用的路径和顺序。

如果一个模块包含中间件，它必须实现 `NestModule` 接口。这个接口要求模块类实现 `configure()` 方法。`configure()` 方法接收一个 `MiddlewareConsumer` 参数，这是一个帮助类，它提供了几个内置方法来管理中间件，所有这些方法都可以以流畅的风格简单地链式调用。如下，使用 `consumer.apply()` 方法来应用中间件，然后使用 `forRoutes()` 来指定中间件应用的路由。

```ts title="app.module.ts"
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

这种设置中间件的方式提供了几个优点：
- 灵活性：我们可以动态决定中间件应用到哪些路由，甚至可以基于条件来应用中间件。
- 精细控制：我们可以为不同的路由设置不同的中间件，或者设置中间件的执行顺序。
- 模块化：中间件的配置是在模块级别完成的，这有助于保持代码的组织性和模块化。
- 可读性：将中间件配置集中在一个地方（`configure` 方法）使得代码更易于理解和维护。
- 动态配置：因为配置是在方法中完成的，我们可以使用逻辑来动态决定如何应用中间件。

我们可以向 `forRoutes()` 方法传递一个包含路由路径和请求方法的对象来更精确地控制中间件在哪些 HTTP 方法和路径上生效，如下示例：
```ts title="app.module.ts"
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

这种配置方式的优点：
- 精确控制：可以将中间件限制到特定的 HTTP 方法，而不是应用到所有方法。
- 灵活性：可以为不同的 HTTP 方法配置不同的中间件。
- 性能优化：通过只在必要的路由和方法上应用中间件，可以提高应用的性能。
- 安全性：可以针对特定的敏感操作（如 POST 或 DELETE 请求）应用特殊的中间件。

如下，为不同的路由和方法组合应用同一个中间件：
```ts
consumer
  .apply(LoggerMiddleware)
  .forRoutes(
    { path: 'users', method: RequestMethod.GET },
    { path: 'users/:id', method: RequestMethod.PUT },
    { path: 'auth/*', method: RequestMethod.POST },
  );
```

:::tip
`forRoutes()` 方法可以接受单个字符串、多个字符串、`RouteInfo` 对象、控制器类（即控制器中定义的所有路由），甚至多个控制器类。例如：
```ts
.forRoutes('cats')
.forRoutes('cats', 'dogs')
.forRoutes({ path: 'cats', method: RequestMethod.GET })
.forRoutes(CatsController)
.forRoutes(CatsController, DogsController)
```

`apply()` 方法可以应用单个中间件或多个中间件（这些中间件将按照在 `apply()` 方法中列出的顺序依次执行）。例如：
```ts
.apply(logger)
.apply(LoggerMiddleware)
.apply(LoggerMiddleware, AnotherMiddleware) // 按顺序依次执行
```
:::

#### NestJS 允许在配置中间件时执行异步操作
如下示例：
```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { UsersController } from './users.controller';
import { ConfigService } from './config.service';

@Module({
  controllers: [UsersController],
  providers: [ConfigService],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}

  async configure(consumer: MiddlewareConsumer) {
    // 假设我们需要从配置服务异步获取一些设置
    const middlewareEnabled = await this.configService.isMiddlewareEnabled();

    if (middlewareEnabled) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes(UsersController);
    }
  }
}
```
这种异步配置的能力带来了几个重要的优势：
- 动态配置：可以基于异步获取的配置或数据来决定如何设置中间件。
- 外部依赖：可以在配置中间件之前与外部服务或数据库进行交互。
- 灵活性：可以执行任何需要的异步操作，如读取文件、进行 API 调用等。
- 条件应用：可以基于复杂的异步逻辑来决定是否应用某个中间件。
- 初始化：可以在应用中间件之前执行一些异步的初始化操作。

#### NestJS 中间件也支持基于模式的路由
NestJS 允许使用特定的模式来定义中间件应用的路由，而不仅仅是固定的路径。例如：
```ts
forRoutes({
  path: 'abcd/*splat',
  method: RequestMethod.ALL,
});
```
:::tip
`splat` 只是通配符参数的名称，没有特殊含义。你可以随意命名它，例如，`*wildcard`。在路由模式中，星号（`*`）后面跟着的名称（如 `splat` 或 `wildcard`）实际上是给这个通配符部分起的一个名字，这个名字本身并没有特殊的含义或功能。

`abcd/*splat` 和 `abcd/*` 在功能上是完全等效的，两者都会匹配以 `abcd/` 开头并后跟任意字符的路由。`abcd/*`只是没有给通配符命名。在大多数情况下，特别是在简单的路由匹配中，`abcd/*` 的写法就足够了，而且更简洁。
:::

要使通配符部分变为可选，需要使用大括号，例如：`abcd/{*splat}`，这种写法会匹配 `abcd/`，以及 `abcd/` 后跟任意字符的路径，例如：`abcd/1`, `abcd/123`, `abcd/abc`, `abcd/hello-world`, `abcd/file.txt` 都会匹配（连字符（`-`）和点（`.`）在路由中被视为普通字符）。如果不使用大括号，如`abcd/*splat` 或 `abcd/*`，不会匹配 `abcd/`，这是因为 `*` 通配符要求至少有一个字符。

#### 指定路由不应用中间件
`exclude()` 方法用于指定哪些路由不应用中间件，即使这些路由匹配了 `forRoutes()` 中的模式。

`exclude()` 方法可以接受多种形式的参数：单个字符串路由、多个字符串路由、`RouteInfo` 对象（包含路径和 HTTP 方法），例如：
```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    'cats',                   // 排除 /cats 路由
    'dogs/(.*)',              // 排除所有以 /dogs/ 开头的路由
    { path: 'fish', method: RequestMethod.POST }  // 排除 POST /fish 路由
  )
  .forRoutes(CatsController);
```

`exclude()` 方法支持使用 `path-to-regexp` 包的通配符语法，这意味着你可以使用像 `*`, `?`, `+` 等通配符来匹配复杂的路由模式。

:::warning
`exclude()` 方法应该在 `apply()` 之后、`forRoutes()` 之前调用。
:::

总的来说，`exclude()` 方法为 NestJS 的中间件配置提供了更高的灵活性，使得开发者可以在广泛应用中间件的同时，精确地控制哪些路由应该被排除在外。这在构建大型、复杂的应用时特别有用，可以避免不必要的中间件处理，提高应用性能。

### 全局中间件
使用 `INestApplication` 实例的 `use()` 方法可以将中间件应用到所有路由。
```ts title="main.ts"
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(process.env.PORT ?? 3000);
```

在全局中间件中无法访问依赖注入（DI）容器，即不能在全局中间件中注入服务或其他依赖项。

对于全局中间件，推荐使用函数式中间件。例如：
```ts
app.use((req, res, next) => {
  console.log('Request...');
  next();
});
```

:::tip
在 `AppModule` 或其他模块中使用 `.forRoutes('*')` 可以实现类似全局中间件的效果，同时保留依赖注入的能力。
```ts
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```
`forRoutes('*')` 表示该中间件将应用于所有路由。
:::

:::warning
全局中间件会应用到每个请求，所以要谨慎使用，避免不必要的性能开销。
:::

## Exception filters
NestJS 提供了一个自动的异常处理机制，负责捕获并处理应用中所有未被显式处理的异常。

当捕获到未处理的异常时，会自动生成一个用户友好的响应。这个操作是由一个内置的全局异常过滤器执行的，它处理 `HttpException` 类型的异常（及其子类）。

`HttpException`是 NestJS 提供的一个基本异常类，许多内置的 HTTP 相关异常都继承自这个类。

当遇到未识别的异常（既不是 `HttpException`，也不是继承自 `HttpException` 的类）时，内置的异常过滤器会生成以下默认的 JSON 响应:
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

:::tip
NestJS 的全局异常过滤器能够识别和处理 `http-errors` 库创建的错误对象。（`http-errors`是一个流行的 Node.js 库，用于创建 HTTP 错误对象。）

对于未识别的异常，默认行为是抛出 `InternalServerErrorException`（500 内部服务器错误）。但对于包含 `statusCode` 和 `message` 的异常（`statusCode`表示 HTTP 状态码, `message`表示错误消息），会使用这些信息而不是默认的 500 错误。例如：
```ts
import createHttpError from 'http-errors';

throw createHttpError(404, 'Resource not found'); // 这将被 NestJS 捕获并返回一个 404 状态码的响应，消息为 "Resource not found"。
```

虽然支持 `http-errors`，但在 NestJS 应用中，通常推荐使用 NestJS 自己的 `HttpException` 类及其子类。
:::