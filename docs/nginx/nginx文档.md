---
slug: docs
tags: [nginx]
---

:::tip
- [nginx官网](http://nginx.org/)
- [nginx官方文档](http://nginx.org/en/docs/)
:::


## modules

### ngx_http_core_module
```bash
http {

}
```
#### client_max_body_size
```text
Syntax: 	client_max_body_size size;
Default: 	client_max_body_size 1m;
Context: 	http, server, location
```

## 变量
### `$proxy_add_x_forwarded_for`
`$proxy_add_x_forwarded_for` 是 Nginx 中的一个变量，用于在代理请求时添加或更新 `X-Forwarded-For` 请求头。这个变量会将客户端的原始 IP 地址和现有的 `X-Forwarded-For` 头值组合起来，从而保留所有经过的代理服务器的 IP 地址链。

在 Nginx 配置文件中，你可以这样使用它：

```nginx
location / {
  proxy_pass http://backend_server;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

在这个配置中，`$proxy_add_x_forwarded_for` 会包含客户端的原始 IP 地址以及任何现有的 `X-Forwarded-For` 头值。例如，如果客户端的 IP 地址是 `192.0.2.1`，而现有的 `X-Forwarded-For` 头值是 `203.0.113.2`，那么 `X-Forwarded-For` 头的最终值将是 `192.0.2.1, 203.0.113.2`。

这样做的目的是确保每个代理服务器都能记录和传递客户端的原始 IP 地址，便于追踪和调试。