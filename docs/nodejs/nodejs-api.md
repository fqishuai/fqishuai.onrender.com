---
tags: [api]
---

:::tip
[API documentation](https://nodejs.org/en/docs/)
:::

## 一、File system
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

## 二、Crypto
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