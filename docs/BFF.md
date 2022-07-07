---
slug: bff
tags: [架构]
---

API Gateway
主要职责：专注跨横切面(Cross-Cutting Concerns)的功能
- 路由，将请求路由到某个微服务
- 认证，对涉及敏感数据的API访问进行集中认证鉴权
- 监控，对涉及敏感数据的API访问进行集中认证鉴权
- 限流熔断，当出现流量洪峰或服务故障，网关能够主动进行限流熔断，保护后端服务，并保持前端用户体验可以接受。
- 安全防爬

BFF
主要职责：将内部复杂的微服务，适配成对各种不同用户体验（APP/Web/H5/第三方等）友好和统一的API
后端追求服务下沉和解耦；前端追求用户体验和灵活性
- 聚合
- 裁剪
- 适配。多端应用适配。展示不同的（或更少量的）数据，比如PC端页面设计的API需要支持移动端，发现现有接口从设计到实现都与桌面UI展示需求强相关，无法简单适应移动端的展示需求 ，就好比PC端一个新闻推荐接口，接口字段PC端都需要，而移动端呢H5不需要，这个时候根据不同终端在BFF层做调整，同时也可以进行不同的（或更少的）API调用（聚合）来减少http请求。当你在设计 API 时，会因为不同终端存在不同的区分，它们对服务端提供的 API 访问也各有其特点，需要做一些区别处理。这个时候如果考虑在原有的接口上进行修改，会因为修改导致耦合，破坏其单一的职责。

![服务化架构](https://mmbiz.qpic.cn/mmbiz_png/ELH62gpbFmGA0ecWFic1LS4RsmDU4u6XYsdx5opGHvC1UaP0iaKh78FCJwz3qNK5ZGkLvlcuC4q6ykMXJ6OZoFoQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)
![BFF架构](https://mmbiz.qpic.cn/mmbiz_png/lXoAxSVgJib2LicfkVvEn5ibk0DrDJ4qxK8B1qvlOA92rbiajwWe4FAtHdEhKjL7ZqeJKUXeMPqYs1guAJiaDibrkyCw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

BFF层直接调用服务端 RPC 接口拿到数据，按需加工数据，给客户端提供接口服务


Serverless
Serverless = Faas (Function as a service) + Baas (Backend as a service)
- FaaS（云函数）是服务商提供一个平台、提供给用户开发、运行管理这些函数的功能，而无需搭建和维护基础框架，是一种事件驱动由消息触发的函数服务
- BaaS（后端即服务）包含了后端服务组件，它是基于 API 的第三方服务，用于实现应用程序中的核心功能，包含常用的数据库、对象存储、消息队列、日志服务等等。

![Serverless架构](https://mmbiz.qpic.cn/mmbiz_png/lXoAxSVgJib2LicfkVvEn5ibk0DrDJ4qxK8fm5Cd4hVvv9ooCFibs3TMRM3hLzzVItE0BUlYiaPfOLia17jiage9D4iayQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

Serverless 带来的其实是前端研发模式上的颠覆。相对以往纯前端研发的方式，Serverless 屏蔽底层基础设施的复杂度，后台能力通过FaaS平台化，我们不再需要关注运维、部署的细节，开发难度得到了简化，前端开发群体的边界就得以拓宽，能够参与到业务逻辑的开发当中，更加贴近和理解业务，做更有价值的输出。