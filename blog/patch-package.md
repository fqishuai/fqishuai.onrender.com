## patch-package可以用来修改npm包的源码
- `npm install patch-package`
- package.json中增加postinstall
```json
"scripts": {
  "postinstall": "patch-package"
}
```
- 修改依赖包的源码
- 生成补丁，以element-ui为例，执行`npx patch-package element-ui` (注意，使用npx需要npm版本 > 5.2)
> 生成的补丁(依赖包名+版本号.patch的文件)默认会在项目根目录自动创建的patches文件夹中

- 注意：patch是锁定版本号的，如果升级了版本，patch内容将会失效，最好在package.json能够锁定版本号。