:::tip
[npm docs](https://docs.npmjs.com)
:::

## 1. 怎么正确调试npm包
### 1.1 npm link
问题记录：npm link A，npm unlink A后，npm install A还是显示link的包

### 1.2 yalc

## 2. node_modules文件夹出现.staging
:::tip
npm install 过程中，node_modules 里面出现了一个 `.staging` 文件夹，这表明我们的依赖还没有下载完成，当依赖彻底下载完之后，该文件夹会自动消失。
:::

如果install完还是只有`.staging`文件夹，则需要删除`package-lock.json`文件，删除node_modules文件夹，然后重新 npm install。

## 3. npm命令
### 3.1 npm install
### 3.2 npm update
### 3.3 npm link