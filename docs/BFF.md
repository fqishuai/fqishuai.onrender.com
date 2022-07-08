---
slug: bff
tags: [架构]
---

## API Gateway
### （1）主要职责：专注跨横切面(Cross-Cutting Concerns)的功能
- 路由，将请求路由到某个微服务
- 认证，对涉及敏感数据的API访问进行集中认证鉴权
- 监控，对涉及敏感数据的API访问进行集中认证鉴权
- 限流熔断，当出现流量洪峰或服务故障，网关能够主动进行限流熔断，保护后端服务，并保持前端用户体验可以接受。
- 安全防爬

### （2）API Gateway 常见的实现方式
- 一个 API Gateway 对所有客户端提供同一种 API。API Gateway 不对客户端类型做区分。
- 一个 API Gateway 对每种客户端提供各自的 API。API Gateway 根据不同的 API 判定来自于哪个客户端，然后分别进行处理，返回不同客户端所需的资源。
- 多个 API Gateway 分别对每种客户端提供各自的 API。

在没有BFF之前，微服务架构里一般都有一个反向代理层，即负责路由和转发来自外网的http和tcp请求给内部的微服务集群，也起到了不把微服务对外暴露的作用。同时可能还会有API网关这一层，负责对接入层的请求进行鉴权、协议转换、流量控制等。相当于把每个微服务要做的事情集中做一次。

在微服务化的架构下，后端微服务通常通过API Gateway来向前端暴露API。API Gateway作为应用的入口点，对前端屏蔽了底层服务的细节，并可以聚合多个对后端微服务的调用以便减少前端的调用次数，提供对前端友好的通讯协议。同时API Gateway还承担了处理横切关注点的职责，例如统一鉴权、请求度量统计、日志等功能。

## BFF
BFF 其实是 API Gateway 的其中一种实现模式。主要思想是为每一种类型的前端提供对应的后端以满足不同前端的不同需求。
### （1）背景
- 后端追求服务下沉和解耦（服务的稳定性）；前端追求用户体验和灵活性
- 对于客户端（特别是移动端）来说，过多的 HTTP 请求是很昂贵的，所以开发过程中，为了尽量减少请求的次数，前端一般会倾向于把有关联的数据通过一个 API 获取。在微服务模式下，意味着有时为了迎合客户端的需求，服务器常会做一些与UI有关的逻辑处理。
- 加入了BFF的前后端架构中，最大的区别就是前端(Mobile, Web) 不再直接访问后端微服务，而是通过 BFF 层进行访问。并且每种客户端都会有一个BFF服务。从微服务的角度来看，有了 BFF 之后，微服务之间的相互调用更少了。这是因为一些UI的逻辑在 BFF 层进行了处理。
- 接口设计时很容易犯的一个错就是经常会根据接口调用方的个性化场景（比如多种界面展示）设计出很多类似且重复性的接口，且接口的实现逻辑割裂、复用性差。
- 从DDD角度看，提倡围绕领域业务能力进行接口设计，服务端应该聚焦领域自身能提供什么样的能力来设计接口，而展示相关的处理逻辑不应该是领域业务。展示逻辑和领域逻辑混杂在一起，久而久之业务逻辑将变得难以维护。
- 为了让业务服务更加聚焦领域能力，根据领域能力设计对外接口，同时又要满足多样化的接口消费场景如前端展示，架构里往往需要引入BFF这一层。
- 一个功能的页面展示可能需要请求多个微服务
- 接口格式不满足前端需求
- 由于移动带宽的限制，更多数据返回意味着加载时长变长；同时更多数据意味着用户需要付出更多的数据流量以及消耗更多的电量。耗电、耗流量分分钟会成为用户卸载掉你的应用的导火索。

### （2）主要职责：将内部复杂的微服务，适配成对各种不同用户体验（APP/Web/H5/第三方等）友好和统一的API
- 聚合/编排多种数据。一个页面要展示多个服务端的数据，因此需要聚合多个API的数据（串行或并行编排多个API）
- 裁剪字段。App端往往只能展示少量信息，浏览器网页则需要全部信息，因此需要适配各端而裁减字段
- 适配。多端应用适配。展示不同的（或更少量的）数据，比如PC端页面设计的API需要支持移动端，发现现有接口从设计到实现都与桌面UI展示需求强相关，无法简单适应移动端的展示需求 ，就好比PC端一个新闻推荐接口，接口字段PC端都需要，而移动端呢H5不需要，这个时候根据不同终端在BFF层做调整，同时也可以进行不同的（或更少的）API调用（聚合）来减少http请求。当你在设计 API 时，会因为不同终端存在不同的区分，它们对服务端提供的 API 访问也各有其特点，需要做一些区别处理。这个时候如果考虑在原有的接口上进行修改，会因为修改导致耦合，破坏其单一的职责。response的格式的适配。
- 快速支持新业务方案上线。数据源不变，展示方案的改动，而需要不同的数据结构。
- 个性化服务。提供满足前端个性化展示的服务，比如单位的处理，颜色的处理，日期格式的处理，特定文案展示的处理等

### （3）BFF架构
![服务化架构](https://mmbiz.qpic.cn/mmbiz_png/ELH62gpbFmGA0ecWFic1LS4RsmDU4u6XYsdx5opGHvC1UaP0iaKh78FCJwz3qNK5ZGkLvlcuC4q6ykMXJ6OZoFoQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)
![BFF架构](https://mmbiz.qpic.cn/mmbiz_png/lXoAxSVgJib2LicfkVvEn5ibk0DrDJ4qxK8B1qvlOA92rbiajwWe4FAtHdEhKjL7ZqeJKUXeMPqYs1guAJiaDibrkyCw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)
![BFF架构](https://mmbiz.qpic.cn/mmbiz_png/aaVJqS7LaMLClPic6l1HLPZAEorehByj4Lg18e9bbBrEm61icnjq8xs5jz81PJLIuWVPo7ZdXW7iab9dicAIQdQzzw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)
![BFF架构](https://mmbiz.qpic.cn/sz_mmbiz_png/zcTK4kXOJe2M2uJxsIWR3gGDlEb2rwnwHYhmOEeiaiaH8dZqwBu4QO4Vk0hRFU7oLTiaygzuz3p19X5747rnKHwNQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

- BFF层直接调用服务端 RPC 接口拿到数据，按需加工数据，给客户端提供接口服务
- 客户端和BFF服务的通信？BFF和后端微服务的通信？ --- BFF 和微服务后台之间，还是通过 registrator 和 Consul 进行服务注册和发现。BFF服务应该融入现有微服务注册发现的机制
- BFF服务怎么部署？ --- 通过 Docker 进行部署
- BFF服务的路由处理？ --- 在 BFF 的路由设置中，对于客户端的处理，主要有 `/graphql` 和 `/api/${serviceName}`两部分。`/graphql` 处理的是所有 GraphQL 查询请求，同时我们在 BFF 端增加了 `/api/${serviceName}` 进行 API 透传，对于一些没有必要进行 GraphQL 封装的请求，可以直接通过透传访问到相关的微服务中
- BFF 是否需要集成鉴权认证？ --- 主要看各系统自己的设计，并不是一个标准的实践。可以把所有的鉴权过程全部由各自的微服务模块负责，BFF 只提供中转的功能。
- 如何高效支持串并行调用下游接口？BFF层的一个接口往往需要调用下游多个微服务接口，有串行调用也有并行调用。
- BFF服务和API网关独立存在，BFF和API GW都是正常的微服务，可以互相发现，通过http协议互相调用。
- 调用链路。 --- 调用链路从上往下，中后台应用通过 HTTP 请求到 Nginx 服务器上，Nginx 转发到 BFF 层，BFF 层通过 RPC 调用后端域的微服务，完成整个调用过程。
  - ZooKeeper：可简单理解为服务注册中心，后端的各个微服务都统一注册到这个注册中心，然后 BFF 层充当 ZooKeeper Client 去连接这个注册中心，连接后，就可以枚举到注册中心每个服务的 Host 和 Port，拿到 Host 和 Port 就可以发起 RPC 调用了。
  - RPC：远程过程调用，也就是说两台服务器 A、B，一个部署在 A 服务器上的应用需要访问 B 服务器上的一个应用的某个方法，由于不在一个内存空间，因此需要通过网络来表达调用的语义和传达的数据，可以简单理解为 A 服务器上部署了我们的 BFF 应用，B 服务器上部署了我们的微服务。RPC 通信协议可基于 HTTP 或者 TCP 协议，我们采用的是 gRPC，即使用 HTTP/2 的一种 RPC 调用方式。
![调用链路](https://mmbiz.qpic.cn/mmbiz_png/YBFV3Da0Nwsnff4GCnCcevW77O1lMW3dtfRnxJp0FOK6aMGRGfEHel0DbLwqbKSKtj7RY9licqHicZ854OkM45RQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

### （4）BFF的设计原则
- BFF为前端而生，关注点在提升前端用户体验。对于“业务的关注”并不是说，BFF会处理所有的业务逻辑，业务逻辑还是应该由微服务关心，BFF 关注的是客户端需要什么。
- BFF不承载业务能力，业务逻辑要下沉到合适的后端服务中。BFF层避免承载过多的业务，BFF ≠ ESB(企业级服务总线)，如果BFF 以一己之力承载了前端所有的业务，最终一定会走向大泥球，成为架构中的瓶颈和脆弱点。
- BFF不承载特定技术能力，必要时可以建立专门的服务承载，如文档打印、Excel生成、算法逻辑等。
- BFF不做后端服务的集成层，某个后端服务的数据变更需要同步到其他服务，不能通过BFF实现。
- 不可图一时之方便而越俎代庖，将大部分该由后端服务提供的能力放到BFF层，而更应该关注在前端的体验优化上，做好前后端的隔离，让前后端能够各司其职，合理高效协作。
- BFF虽然提倡为每一种类型的前端提供相应的后端，但这并不意味着你有多少种前端就有多少个BFF，它是一种小于等于的关系。

### （5）GraphQL BFF or REST BFF
- REST。按照 REST 的设计标准来看，所有的访问都是基于对资源的访问（增删查改）
- GraphQL 是一种 API 查询语句，相比于 REST 风格，GraphQL 具有如下特性：
  - 定义数据模型，按需获取。GraphQL 在服务器实现端，需要定义不同的数据模型。前端的所有访问，最终都是通过 GraphQL 后端定义的数据模型来进行映射和解析。并且这种基于模型的定义，能够做到按需索取。
  - 数据分层。查询一组users数据，可能需要获取 user.friends, user.friends.addr等信息，所以针对 users 的本次查询，实际上分别涉及到对 user, frind, addr 三类数据。GraphQL 对分层数据的查询，大大减少了客户端请求次数。因为在 REST 模式下，可能意味着每次获取 `user` 数据之后，需要再次发送 API 去请求 friends 接口。而 GraphQL 通过数据分层，能够让客户端通过一个 API获取所有需要的数据。这也就是 GraphQL（图查询语句 Graph Query Language）名称的由来。
  - 强类型。GraphQL 的类型系统定义了包括 Int, Float, String, Boolean, ID, Object, List, Non-Null 等数据类型。
  - 协议而非存储。GraphQL 本身并不直接提供后端存储的能力，它不绑定任何的数据库或者存储引擎。它利用已有的代码和技术进行数据源的管理。比如作为在 BFF 层使用 GraphQL, 这一层的 BFF 并不需要任何的数据库或者存储媒介。GraphQL 只是解析客户端请求，知道客户端的“意图”之后，再通过对微服务API的访问获取到数据，对数据进行一系列的组装或者过滤。
  - 无须版本化。GraphQL 服务端能够通过添加 deprecationReason，自动将某个字段标注为弃用状态。并且基于 GraphQL 高度的可扩展性，如果不需要某个数据，那么只需要使用新的字段或者结构即可，老的弃用字段给老的客户端提供服务，所有新的客户端使用新的字段获取相关信息。并且考虑到所有的 graphql 请求，都是按照 POST /graphql 发送请求，所以在 GraphQL 中是无须进行版本化的。

- GraphQL 和 REST的不同点：
  - 数据获取。REST 缺乏可扩展性， GraphQL 能够按需获取。GraphQL API 调用时，payload 是可以扩展的。
  - API 调用。REST 针对每种资源的操作都是一个 endpoint；GraphQL 只需要一个 endpoint( /graphql), 只是 post body 不一样
  - 复杂数据请求。REST 对于嵌套的复杂数据需要多次调用，GraphQL 一次调用, 减少网络开销
  - 错误码处理。REST 能够精确返回HTTP错误码，GraphQL的请求状态码只有400和200，对错误信息进行包装
  - 版本号。REST通过 v1/v2 实现，GraphQL 通过 Schema 扩展实现

- Apollo GraphQL

### （6）BFF的治理方向
- 首先分析BFF问题背后是不是存在后端服务设计问题，优先解决后端服务的设计问题。
- 从业务上分析BFF接口的职责，保证接口职责单一。
- 将BFF中业务能力下沉到后端服务。
- 将BFF中需要复用的技术能力抽取成共享库或下沉建立后端服务。
- 避免一个BFF接口依赖过多的后端服务，根据系统复杂度来看，最多依赖不超过5个后端服务为宜。
- 避免一个BFF接口多次写操作，不滥用BFF站在上帝视角所拥有的权利，各司其职。

### （7）BFF的价值/收益
- 通过引入BFF解耦了前后端


## Serverless
Serverless = Faas (Function as a service) + Baas (Backend as a service)
- FaaS（云函数）是服务商提供一个平台、提供给用户开发、运行管理这些函数的功能，而无需搭建和维护基础框架，是一种事件驱动由消息触发的函数服务
- BaaS（后端即服务）包含了后端服务组件，它是基于 API 的第三方服务，用于实现应用程序中的核心功能，包含常用的数据库、对象存储、消息队列、日志服务等等。

![Serverless架构](https://mmbiz.qpic.cn/mmbiz_png/lXoAxSVgJib2LicfkVvEn5ibk0DrDJ4qxK8fm5Cd4hVvv9ooCFibs3TMRM3hLzzVItE0BUlYiaPfOLia17jiage9D4iayQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

Serverless 带来的其实是前端研发模式上的颠覆。相对以往纯前端研发的方式，Serverless 屏蔽底层基础设施的复杂度，后台能力通过FaaS平台化，我们不再需要关注运维、部署的细节，开发难度得到了简化，前端开发群体的边界就得以拓宽，能够参与到业务逻辑的开发当中，更加贴近和理解业务，做更有价值的输出。

SFF（Serverless For Frontend）：通过将 BFF 构建于 Serverless 之上，用云函数的方式取代传统基于 NodeJS 的 BFF 层。

在传统基于 Node.js 的 BFF 层，其痛点主要在于存在较高的发布和运维成本，而引入 Serverless 的关键目标就是要解决这两个问题。