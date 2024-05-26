---
slug: ssl
---

[给Nginx配置一个自签名的SSL证书](https://www.liaoxuefeng.com/article/990311924891552)

```sh title="gencert.sh"
#!/bin/sh

# create self-signed server certificate:

read -p "Enter your domain [www.example.com]: " DOMAIN

echo "Create server key..."

openssl genrsa -des3 -out $DOMAIN.key 1024

echo "Create server certificate signing request..."

SUBJECT="/C=US/ST=Mars/L=iTranswarp/O=iTranswarp/OU=iTranswarp/CN=$DOMAIN"

openssl req -new -subj $SUBJECT -key $DOMAIN.key -out $DOMAIN.csr

echo "Remove password..."

mv $DOMAIN.key $DOMAIN.origin.key
openssl rsa -in $DOMAIN.origin.key -out $DOMAIN.key

echo "Sign SSL certificate..."

openssl x509 -req -days 3650 -in $DOMAIN.csr -signkey $DOMAIN.key -out $DOMAIN.crt

echo "TODO:"
echo "Copy $DOMAIN.crt to /etc/nginx/ssl/$DOMAIN.crt"
echo "Copy $DOMAIN.key to /etc/nginx/ssl/$DOMAIN.key"
echo "Add configuration in nginx:"
echo "server {"
echo "    ..."
echo "    listen 443 ssl;"
echo "    ssl_certificate     /etc/nginx/ssl/$DOMAIN.crt;"
echo "    ssl_certificate_key /etc/nginx/ssl/$DOMAIN.key;"
echo "}"
```

执行：
```bash
sudo sh ./gencert.sh
```
会生成4个文件，Web服务器需要把`xxx.crt`发给浏览器验证，然后用`xxx.key`解密浏览器发送的数据，剩下两个文件不需要上传到Web服务器上。

express启动https服务：
```js
const fs = require('fs')
const https = require('https')
const express = require('express')

const app = express()

const options = {
  key: fs.readFileSync('./xxx.key'),
  cert: fs.readFileSync('./xxx.crt')
};
https.createServer(options, app).listen(443)
```