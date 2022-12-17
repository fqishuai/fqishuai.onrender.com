---
slug: docs
tags: [nginx]
---

:::tip
- [nginx官网](http://nginx.org/)
- [nginx官方文档](http://nginx.org/en/docs/)
:::


## 2. modules

### 2.1 ngx_http_core_module
```bash
http {

}
```
#### 2.1.1 client_max_body_size
```text
Syntax: 	client_max_body_size size;
Default: 	client_max_body_size 1m;
Context: 	http, server, location
```