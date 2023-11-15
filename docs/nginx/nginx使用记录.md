---
slug: usage
tags: [nginx, 记录]
---

## 1. 使用`-c`指定配置文件
```bash
# 指定配置文件启动
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

## 2. A服务器访问B服务器的文件
> 参考:
> - [nginx访问另一台服务器上的文件](https://blog.csdn.net/sinat_15733233/article/details/123255654)
> - [proxy_pass配置多个ip](https://www.cnblogs.com/xinfang520/p/11653980.html)

- A服务器的配置
```bash
location /staticFile/ { # 自定义location名
  try_files $uri @staticFile;
}
location @staticFile { # 自定义location名
  proxy_redirect off;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_pass http://B服务器的ip:B服务器的端口号;
}
```

- proxy_pass多个服务器ip
```bash
upstream proxy-staticServer { # 自定义upstream名
  server B服务器的ip:B服务器的端口号; # 不加端口号则默认80端口
  server C服务器的ip:C服务器的端口号;
}

location /staticFile/ {
  try_files $uri @staticFile;
}
location @staticFile {
  proxy_redirect off;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_pass http://proxy-staticServer;
}
```

- B服务器的配置
假如静态资源目录为：/export/App/staticFile/
```bash
server {
  listen          80; # A服务器配置的B的端口号为80或者没配端口号时
  server_name     localhost;

  error_page 302 = http://错误页;

  location /staticFile/ {
    root /export/App/;
    try_files $uri $uri/ /staticFile/index.html;
    if ($request_filename ~* .*\.(?:htm|html)$)
    {
      add_header Cache-Control "no-store";
    }
    add_header Cache-Control "max-age=8420000";
  }
}
```

- C服务器的配置同B

## 3. docker `/dev/shm/nginx_temp/client_body` 应该是一个目录
- 遇到过一个问题是把`/dev/shm/nginx_temp/client_body`设置成了文件，导致浏览器上传文件请求接口通过nginx转发时，上传的前2-3次可以成功，后面的上传报错500，nginx的错误日志为：`open() "/dev/shm/nginx_temp/client_body/0000000004" failed (20: Not a directory)`

- 这个问题很容易误导到 `ngx_http_core_module`的指令：`client_max_body_size`，而`client_max_body_size`是用来设置客户端请求体的大小的，如果一个请求的请求体超出了这个指令设置的值，将返回给客户端413(Request Entity Too Large)错误，请注意浏览器无法正确显示该错误。如果将该指令的值设置为0，则不检查 客户端请求体的大小。
