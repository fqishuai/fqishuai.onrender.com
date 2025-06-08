---
slug: web
tags: [web, 记录]
---

## 文件上传
### 单文件上传
```html
<div className="empty">
  <input
    className="uploader-wrapper__input"
    type="file"
    <!-- capture="environment" 直接调起后置摄像头  capture="user" 直接调起前置摄像头 -->
    accept="image/jpg,image/jpeg,image/gif,image/png"
    onChange={handleFileChange}
  />
  <img src={cameraIcon} />
  <div>上传照片</div>
</div>
```
```scss
.empty {
  width: 186px;
  height: 186px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &>img {
    width: 56px;
    height: 56px;
  }
  position: relative;
  .uploader-wrapper__input {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    cursor: pointer !important;
    opacity: 0;

    &:disabled {
      cursor: not-allowed;
    }
  }
}
```
```ts
function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  // loading
  setShowLoadOverlay(true);
  const $el = event.target;
  const { files } = $el;
  if (files && files[0]) {
    const formData = new FormData();
    formData.append('file', files[0]);
    axios.post(import.meta.env.VITE_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
      setShowLoadOverlay(false);
      // 上传成功后的业务逻辑
      // ...
    }).catch(error => {
      console.error('上传失败', error);
      Toast.show({
        content: '上传失败',
      });
      setShowLoadOverlay(false);
    });
  } else {
    setShowLoadOverlay(false);
  }
}
```

### 多文件上传
```html
<div className="empty">
  <input
    className="uploader-wrapper__input"
    type="file"
    <!-- capture="environment" 直接调起后置摄像头  capture="user" 直接调起前置摄像头 -->
    accept="image/jpg,image/jpeg,image/gif,image/png"
    multiple
    onChange={handleFileChange}
  />
  <img src={cameraIcon} />
  <div>上传照片</div>
</div>
```
```scss
.empty {
  width: 186px;
  height: 186px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &>img {
    width: 56px;
    height: 56px;
  }
  position: relative;
  .uploader-wrapper__input {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    cursor: pointer !important;
    opacity: 0;

    &:disabled {
      cursor: not-allowed;
    }
  }
}
```
```ts
function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  // loading
  setShowLoadOverlay(true);
  const $el = event.target;
  const { files } = $el;
  if (files) {
    const formData = new FormData();
    for (let i=0; i<files.length; i++) {
      formData.append(i, files[i]);
    }
    axios.post(import.meta.env.VITE_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
      setShowLoadOverlay(false);
      // 上传成功后的业务逻辑
      // ...
    }).catch(error => {
      console.error('上传失败', error);
      Toast.show({
        content: '上传失败',
      });
      setShowLoadOverlay(false);
    });
  } else {
    setShowLoadOverlay(false);
  }
}
```

## 图片压缩
```ts
/**
 * 图片压缩
 * @param files 原始图片file列表
 * @returns 压缩后的图片file列表
 * 注意：图片越大压缩效果越明显，1kb以下可能会出现压缩后size变大的情况
 */
export const compressImg = async (files: FileList) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const base64 = await fileToDataURL(files[0]);
  const img = await dataURLToImage(base64);
  canvas.width = img.width;
  canvas.height = img.height;
  context.clearRect(0, 0, img.width, img.height);
  context.drawImage(img, 0, 0, img.width, img.height);
  const blob = (await canvastoFile(canvas, 'image/jpeg', 0.5)) as Blob;
  const compressedFile = await new File([blob], files[0].name, { type: files[0].type });
  return [compressedFile];
}
const fileToDataURL = (file: Blob): Promise<any> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (e) => resolve((e.target as FileReader).result)
    reader.readAsDataURL(file)
  })
}
const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataURL
  })
}
const canvastoFile = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}
```

使用示例：
```ts
async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  // loading
  setShowLoadOverlay(true);
  const $el = event.target;
  const { files } = $el;
  if (files && files[0]) {
    // 若图片尺寸超过100kb则压缩
    let compressedFiles = files[0].size > 102400 ? await compressImg(files) : files;
    const formData = new FormData();
    formData.append('file', compressedFiles[0]);
    axios.post(import.meta.env.VITE_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
      setShowLoadOverlay(false);
      // 上传成功后的业务逻辑
      // ...
    }).catch(error => {
      console.error('上传失败', error);
      Toast.show({
        content: '上传失败',
      });
      setShowLoadOverlay(false);
    });
  } else {
    setShowLoadOverlay(false);
  }
}
```

## H5
### H5页面适配
[移动端H5开发之页面适配篇](https://cloud.tencent.com/developer/article/2020264)

#### [postcss-pxtorem 总是搭配 amfe-flexible 一起使用](https://juejin.cn/post/7204471780140466231)
- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem): 将px单位转换成rem单位
- [amfe-flexible](https://github.com/amfe/lib-flexible): 自动计算html根节点的字体大小

两个库的搭配使用，将页面上的元素某些属性以相对于根元素的倍数来进行展示，从而适配不同的屏幕大小。
```bash
pnpm add -D postcss-pxtorem
pnpm add amfe-flexible
```
```ts title="vite.config.ts"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postCssPxToRem from 'postcss-pxtorem';

export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 75, // 设计稿宽度750px
          propList: ['*'], // 所有px都转换成rem
          selectorBlackList: ['nut-'], // 忽略选择器为'nut-'开头的元素的px
        })
      ]
    }
  },
})
```
```tsx title="main.tsx"
import 'amfe-flexible';
```

rem是相对于html元素字体单位的一个相对单位，从本质上来说，它属于一个字体单位，用字体单位来布局，并不是太合适

#### [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)
将px单位转换为视口单位的 (vw, vh, vmin, vmax) 的 PostCSS 插件.

安装：`yarn add -D postcss-px-to-viewport`

vite项目中配置:
```js title="vite.config.js"
import { defineConfig } from 'vite' 
import vue from '@vitejs/plugin-vue' 
import postcsspxtoviewport from 'postcss-px-to-viewport' 
export default defineConfig({ 
  plugins: [ 
    vue() 
  ], 
  css: { 
    postcss: { 
      plugins: [ 
        postcsspxtoviewport({ 
          unitToConvert: 'px', // 要转化的单位 
          viewportWidth: 750, // UI设计稿的宽度 
          unitPrecision: 6, // 转换后的精度，即小数点位数 
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换 
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw 
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw 
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名， 
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换 
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false 
          replace: true, // 是否转换后直接更换属性值 
          exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配 
          landscape: false // 是否处理横屏情况 
        }) 
      ] 
    } 
  } 
})
```

配置说明：
- `propList`: 当有些属性的单位我们不希望转换的时候，可以添加在数组后面，并在前面加上!号，如`propList: ["*","!letter-spacing"]`,这表示：所有css属性的属性的单位都进行转化，除了`letter-spacing`的
    
- `selectorBlackList`：转换的黑名单，在黑名单里面的我们可以写入字符串，只要类名包含有这个字符串，就不会被匹配。比如`selectorBlackList: ['wrap']`,它表示形如`wrap`,`my-wrap`,`wrapper`这样的类名的单位，都不会被转换

使用注释忽略转换：
- `/* px-to-viewport-ignore-next */` 用在单独一行，防止下一行被转换
- `/* px-to-viewport-ignore */ ` 用在属性后面，防止同一行被转换
```css
/* example input: */
.class {
  /* px-to-viewport-ignore-next */
  width: 10px;
  padding: 10px;
  height: 10px; /* px-to-viewport-ignore */
  border: solid 2px #000; /* px-to-viewport-ignore */
}

/* example output: */
.class {
  width: 10px;
  padding: 3.125vw;
  height: 10px;
  border: solid 2px #000;
}
```

### 抓包工具
- Charles

### H5调试工具
1. [vconsole](https://github.com/Tencent/vConsole/blob/dev/README_CN.md)

2. [eruda](https://github.com/liriliri/eruda/blob/master/README_CN.md)
通过 url 参数来控制是否加载调试器，即当前端拼接了`eruda=true`参数的时候，才会引入对应的js文件
```js
;(function () {
  var src = '//cdn.jsdelivr.net/npm/eruda';
  if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
  document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
  document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
```

### 真机本地调试
#### [whistle](http://wproxy.org/whistle/)
1. 安装：`sudo npm install -g whistle`
2. 手机和PC保持在同一网络下（比如连到同一个Wi-Fi或手机热点）
3. 命令行输入`w2 start`启动whistle，PC端可以访问`http://127.0.0.1:8899/`查看抓包记录
4. 手机配置代理：点击连接的Wi-Fi或手机热点--->配置代理选择手动，服务器填入whistle启动后提示的ip，端口填入默认的8899
5. 手机配置代理后，PC端访问`http://127.0.0.1:8899/`，点击HTTPS会弹出一个证书二维码，使用手机扫码器扫描该二维码下载证书
6. 证书下载后打开手机的设置--->通用--->VPN与设备管理--->安装下载的证书(描述文件)
7. 安装后就可以真机本地调试https链接了

whistle功能很强大，如图：
![whistle](images/whistle2.png)
常用命令：`w2 start` `w2 restart` `w2 stop`

#### [spy-debugger](https://github.com/wuchangming/spy-debugger)
1. 安装：`sudo npm install spy-debugger -g`
2. 手机和PC保持在同一网络下（比如连到同一个Wi-Fi或手机热点）
3. 命令行输入spy-debugger，按命令行提示用浏览器打开相应地址。
4. 设置手机连接网络的HTTP代理，代理IP地址设置为PC的IP地址，端口为spy-debugger的启动端口(默认端口：9888)。
5. 手机安装证书。注：手机必须先设置完代理后再通过手机扫码器(非微信)扫如下二维码安装证书([二维码地址](https://github.com/wuchangming/spy-debugger/blob/master/demo/img/QRCodeForCert.png))（注意：手机首次调试需要安装证书，已安装了证书的手机无需重复安装。iOS新安装的证书需要手动打开证书信任)。
6. 用手机浏览器访问你要调试的页面即可。

#### [Vorlon.JS](https://www.vorlonjs.io/)

### 二维码生成器
- 草料二维码
- Chrome插件：Quick QR二维码生成器

### 使用nutui-react开发地址选择
- 使用 Cascader `import { Cascader } from '@nutui/nutui-react';`
- 新建地址Cascader和编辑地址Cascader如果放在一个自定义组件里则Cascader会回显不了（原因待探索），所以把编辑地址Cascader单独放到一个自定义的组件里
  ```tsx
  function AddressBook() {
    const [visible, setVisible] = useState(false);
    const [addressValueList, setAddressValueList] = useState<string[]>([]);
    const [addressInfoList, setAddressInfoList] = useState<any[] | null>(null);

    const cascaderOptionKey = {
      textKey: 'addressId',
      valueKey: 'addressId',
      childrenKey: 'children',
    };

    async function lazyLoadAddress(node: any, resolve: (children: any) => void) {
      if (node.root) { // 首次加载
        let firstLevelAddressList = await getAddressById('0');
        resolve(firstLevelAddressList);
      } else {
        const { addressId } = node;
        let nextLevelAddressList = await getAddressById(addressId);
        resolve(nextLevelAddressList);
      }
    }
    function handleAddressValueChange(value: any, path: any) {
      setAddressValueList(value);
      setAddressInfoList(path);
    }

    return <>
      <div onClick={() => setVisible(true)} className="address-wrapper">
        <div className={addressValueList.length ? 'edit-address' : 'add-address'}>{addressValueList.length ? addressValueList.join('') : '请选择省市区县、乡镇等'}</div>
        {
          !!addressIdValue && addressValueList.length>0
          ?
          <EditAddressPicker
            isVisible={visible}
            defaultAddressList={addressValueList}
            optionKey={cascaderOptionKey}
            fetchData={lazyLoadAddress}
            onChangeAddressValue = {(value: any, path: any) => handleAddressValueChange(value, path)}
            onClosePicker={() => {setVisible(false)}}
          ></EditAddressPicker>
          :
          <Cascader
            visible={visible}
            value={addressValueList}
            title="地址选择"
            closeable={false}
            lazy
            optionKey={cascaderOptionKey}
            onChange={handleAddressValueChange}
            onLoad={lazyLoadAddress}
            onClose={() => {setVisible(false)}}
          />
        }
      </div>
    </>
  }
  ```
  ```tsx
  interface IAddressPicker {
    isVisible: boolean,
    defaultAddressList: string[],
    optionKey: any,
    fetchData: (arg0: any, arg1: any) => void,
    onChangeAddressValue: (arg0: any, arg1: any) => void,
    onClosePicker: () => void,
  }

  function EditAddressPicker({
    isVisible,
    defaultAddressList,
    optionKey,
    fetchData,
    onChangeAddressValue,
    onClosePicker,
  }: IAddressPicker) {

    function handleAddressValueChange(value: any, path: any) {
      onChangeAddressValue(value, path);
    }

    return <>
      <Cascader
        visible={isVisible}
        defaultValue={defaultAddressList}
        title="地址选择"
        closeable={false}
        lazy
        optionKey={optionKey}
        onLoad={fetchData}
        onChange={handleAddressValueChange}
        onClose={onClosePicker}
      />
    </>
  }
  ```

### 浏览器模拟器造成 React中点击父元素会触发子元素的点击事件 的假象
以下代码在浏览器模拟器上点击`img`标签或`agree-wrapper`元素的非`span`区域，会触发跳转页面。但是，在真机上不会有这种现象。
```tsx
import { useNavigate, useSearchParams } from "react-router-dom";

function App() {
  const [agreeFlag, setAgreeFlag] = useState(false);

  const navigate = useNavigate();

  function handleChangeAgreeFlag() {
    setAgreeFlag(!agreeFlag);
  }
  function linkAgreement(event: any) {
    event.stopPropagation();
    navigate('/agreement');
  }

  return <>
    <div className="footer">
      <div className="agree-wrapper" onClick={handleChangeAgreeFlag}>
        <img src={agreeFlag ? checkedIcon : uncheckIcon} />
        <div>请仔细阅读<span onClick={(event)=>linkAgreement(event)}>《操作说明》</span>，以便后续操作</div>
      </div>
      <div className="btn" onClick={handleSave}>确定</div>
    </div>
  </>
}
```
```scss
.footer {
  position: fixed;
  bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  width: 100%;
  height: 230px;
  background-color: #FFFFFF;
  .btn {
    background-image: linear-gradient(90deg, #FF6B22 0%, #FF8727 100%);
    border-radius: 45px;
    width: 686px;
    height: 90px;
    margin: 0 auto;
    font-size: 32px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: 44px;
    font-weight: 600;
    padding: 23px 0;
    box-sizing: border-box;
  }
  .agree-wrapper {
    display: flex;
    align-items: center;
    padding: 24px 0 30px 30px;
    &>img {
      width: 30px;
      height: 30px;
    }
    &>div {
      font-size: 24px;
      color: #222222;
      letter-spacing: 0;
      font-weight: 400;
      margin-left: 10px;
      &>span {
        color: #ff6300;
      }
    }
  }
}
```

## 小程序
### 支付宝小程序
#### 1. [联调设置](https://opendocs.alipay.com/mini/ide/integration-testing)
> 用于开发版跳转到另外的小程序再跳回来的场景

### 微信小程序
#### [上报实时日志](https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/)
实时日志目前只支持在手机端测试。工具端的接口可以调用，但不会上报到后台。

#### 微信小程序嵌入H5页面打开慢的问题
微信小程序嵌入H5页面打开慢的问题，可以从多个角度进行优化。以下是一些常见的优化策略：

1. 优化H5页面本身

- **减少资源体积**：压缩CSS、JavaScript和图片文件。使用WebP格式替代传统的图片格式，因为WebP提供了更好的压缩率。
- **优化加载顺序**：确保关键的CSS和JavaScript尽早加载。可以使用`<link rel="preload">`预加载关键资源。
- **减少HTTP请求**：合并CSS和JavaScript文件，减少页面加载时的HTTP请求次数。
- **使用CDN**：将资源放在CDN上，可以加快资源的加载速度，因为CDN可以提供更靠近用户的服务器来响应请求。
- **懒加载**：对于非首屏的图片和内容，可以采用懒加载的方式，等到用户滚动到相应位置时再加载。

2. 优化小程序与H5的交互

- **减少数据传输**：在小程序和H5页面之间传输的数据量越小，性能越好。尽量减少不必要的数据传输。
- **使用缓存**：对于一些不经常变化的数据，可以在小程序端或H5端使用缓存，避免每次都从服务器获取。

3. 服务器端优化

- **开启Gzip压缩**：在服务器端配置Gzip压缩，可以显著减少传输的数据量。
- **优化后端性能**：确保后端API响应速度快。可以通过优化数据库查询、使用更快的服务器、增加缓存等方式来提升后端性能。
- **使用HTTP/2**：相比于HTTP/1.x，HTTP/2提供了更高的效率，如服务器推送、头部压缩等特性，可以进一步提升页面加载速度。

4. 其他

- **预加载页面**：如果可以预测用户的行为，可以提前在小程序中加载H5页面，当用户实际需要时，页面已经加载完成，可以立即显示。
- **监控性能**：使用性能监控工具（如Lighthouse、WebPageTest等）定期检测H5页面的加载性能，及时发现并解决问题。

通过上述方法的综合应用，可以显著提升微信小程序嵌入H5页面的打开速度，改善用户体验。


SSR（服务器端渲染）也可以在一定程度上解决微信小程序嵌入H5页面打开慢的问题，主要通过以下几个方面：

1. **提升首屏加载速度**

服务器端渲染可以直接生成页面的HTML内容，这意味着浏览器可以在下载HTML后立即开始渲染页面，而不需要等待所有的JavaScript都下载并执行完成。这对于提升首屏加载速度非常有效，尤其是在网络条件不佳或设备性能较低的情况下。

2. **减少白屏时间**

由于服务器端渲染的页面在服务器上已经生成了最终的HTML，用户在请求页面时可以更快地看到页面内容，这减少了用户面对空白屏幕的时间，从而提升了用户体验。

3. **减轻客户端负担**

服务器端渲染将部分渲染工作从客户端转移到服务器端，这样可以减轻客户端（在这里指的是微信小程序内嵌的浏览器）的计算负担，特别是对于那些性能较弱的设备，可以显著提升渲染效率。

4. **SEO优化**

虽然这一点对于微信小程序嵌入H5页面的性能优化不直接相关，但值得一提的是，SSR对于改善网页的搜索引擎优化（SEO）也非常有帮助。由于搜索引擎更容易抓取和索引预渲染的内容，这对于需要提升搜索引擎可见度的H5页面来说是一个额外的好处。

实施注意事项：

- **服务器负载**：由于服务器端渲染需要服务器进行额外的计算工作，这可能会增加服务器的负载。因此，在实施SSR时，需要考虑服务器资源和负载情况，适当进行优化和扩展。
- **开发复杂度**：相比于客户端渲染，服务器端渲染可能会增加开发的复杂度，特别是在处理数据预取、路由管理等方面。因此，需要权衡其带来的性能提升和开发成本。

总的来说，SSR能够有效提升微信小程序嵌入H5页面的加载速度和用户体验，但同时也需要考虑到实施SSR可能带来的服务器负载增加和开发复杂度提升等问题。

#### APP拉起小程序
[官方文档](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Launching_a_Mini_Program/Launching_a_Mini_Program.html)

考虑到部分场景下 APP 需要通过小程序来承载服务，为此 OpenSDK 提供了移动应用（APP）拉起小程序功能。移动应用（APP）接入此功能后，用户可以在 APP 中跳转至微信某一小程序的指定页面，完成服务后再跳回至原 APP 。

#### [小程序转发朋友和分享朋友圈不可用](https://developers.weixin.qq.com/community/develop/doc/0000ae4fe3ca608fc59fe14875e400?_at=1734404797378)
只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮。文档：https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object

只有定义了此事件处理函数，右上角菜单才会显示“分享到朋友圈”按钮。文档：https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareTimeline

## antv使用记录
> 使用@ant-design/plots，文档也可以参考g2的文档([g2 API](https://g2.antv.vision/zh/docs/api/general/tooltip))，底层用的是g2

### 1. 自定义tooltip
- 问题：闪烁并且有的地方不显示tooltip，解决方案：设置tooltip的position，position: 'top'

### 2. 图表标注
#### 2.1 [辅助线](https://charts.ant.design/zh/examples/component/annotation/#line-annotation)
API：Line Annotation
- type: 'line', 标识为：辅助线（可带文本）
- start 起始位置
- end 结束位置
:::info
起始位置、结束位置 除了指定原始数据之外，还可以使用预设定数据点，如：
  - 'min': 最小值
  - 'max': 最大值
  - 'mean': 平均值
  - 'median': 中位值
  - 'start': 即 0
  - 'end': 即 1
:::

#### 2.2 [辅助文本](https://charts.ant.design/zh/examples/component/annotation/#text-annotation1)
API：Text Annotation
- type: 'text', 标识为：辅助文本，在指定位置添加文本说明
- position 文本标注位置

## ant design使用记录
### `useForm`
Ant Design 中的 `useForm` 是一个自定义 Hook，用于在函数组件中创建和管理表单实例。它是 Ant Design 表单库的核心功能之一，提供了一种方便的方式来处理表单状态、验证和提交。

以下是 `useForm` 的主要特点和用法：

1. 创建表单实例：
   `useForm()` 返回一个表单实例数组，这个数组只包含一个元素（表单实例）。

   ```javascript
   const [form] = Form.useForm();
   ```

2. 表单控制：
   form 实例提供了多种方法来控制表单，如：
   - `setFieldsValue`: 设置表单字段的值
   - `getFieldsValue`: 获取表单字段的值
   - `resetFields`: 重置表单字段
   - `validateFields`: 验证表单字段

3. 与 Form 组件集成：
   创建的 form 实例可以传递给 `Form` 组件的 `form` 属性。

   ```jsx
   <Form form={form} onFinish={onFinish}>
     {/* 表单项 */}
   </Form>
   ```

4. 表单提交：
   通常与 `onFinish` 事件一起使用，在表单验证通过后触发。

   ```javascript
   const onFinish = (values) => {
     console.log('Form values:', values);
   };
   ```

5. 手动触发验证：
   可以在需要的时候手动触发表单验证。

   ```javascript
   form.validateFields().then(values => {
     // 处理验证通过的表单数据
   }).catch(errorInfo => {
     // 处理验证失败的情况
   });
   ```

6. 动态表单操作：
   `useForm` 使得在复杂的动态表单场景中操作表单变得更加容易。

7. 性能优化：
   使用 `useForm` 可以避免不必要的重渲染，提高表单的性能。

使用 `useForm` 的一个简单示例：

```jsx
import { Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';

const MyForm = () => {
  const [form] = useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

总之，`useForm` 提供了一种强大而灵活的方式来在 React 函数组件中管理表单状态和行为，是 Ant Design 表单开发中的重要工具。

:::tip
`Form.useForm()` 返回一个只包含单个表单实例的数组看起来有点奇怪，这种设计有几个原因：

1. 一致性与未来扩展性：

   这种设计保持了与 React Hooks 的一致性，特别是像 `useState` 这样的 Hooks。虽然目前只返回一个实例，但这种结构为将来可能的扩展留下了空间，比如可能在未来支持多个表单实例。

2. 解构语法的便利性：

   数组形式允许使用解构语法，这在 React 中是一种常见且简洁的模式。例如：
   ```javascript
   const [form] = Form.useForm();
   ```
   这种写法简洁明了，与其他 React Hooks 的使用方式保持一致。

3. 与其他自定义 Hooks 保持一致：

   许多自定义 Hooks 遵循类似的模式，返回一个数组而不是单个值或对象。这有助于保持 API 的一致性。

4. 灵活性：

   虽然目前只返回一个实例，但数组形式为用户提供了更多灵活性。例如，用户可以选择是否使用解构，或者直接使用索引：
   ```javascript
   const form = Form.useForm()[0];
   ```

5. 避免破坏性变更：

   如果将来 Ant Design 决定在 `useForm` 中返回额外的值，使用数组可以避免破坏现有的 API，使得向后兼容性更容易维护。

6. 遵循惯例：

   在 React 生态系统中，返回数组的 Hooks 是一种常见模式，特别是当可能返回多个相关值时。

虽然对于只返回单个实例的情况来说，这种设计可能看起来有点过度，但它提供了一致性、灵活性和未来扩展的可能性。这种方法在 React 和许多库的 API 设计中很常见，因为它在简单性和潜在复杂性之间取得了平衡。

总的来说，这种设计选择反映了一种在当前需求和未来可能性之间平衡的努力，同时也考虑到了与 React 生态系统中其他部分的一致性。
:::

#### 创建多个form实例
在Ant Design中,你可以根据需要创建任意数量的form实例。这在处理复杂表单或多个相关表单时特别有用。

以下是创建和使用多个form实例的一些方法和注意事项:

1. 创建多个实例:

```javascript
const [form1] = Form.useForm();
const [form2] = Form.useForm();
const [form3] = Form.useForm();
```

2. 在不同的Form组件中使用:

```jsx
<Form form={form1}>
  {/* form1 的字段 */}
}
</Form>

<Form form={form2}>
  {/* form2 的字段 */}
}
</Form>
```

3. 独立操作每个表单:

```javascript
form1.setFieldsValue({ /* ... */ });
form2.resetFields();
form3.validateFields().then(/* ... */);
```

4. 用途示例:
   - 步骤表单:每个步骤使用单独的form实例
   - 动态表单:根据需要动态创建form实例
   - 相关但独立的表单:如搜索表单和数据编辑表单

5. 注意事项:
   - 确保每个Form组件使用正确的form实例
   - 多个form实例可能增加状态管理的复杂性
   - 考虑是否真的需要多个实例,有时单个复杂表单可能更合适

6. 示例:管理多个相关表单

```jsx
import { Form, Input, Button } from 'antd';

const MultiFormExample = () => {
  const [personalForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  const onSubmitAll = () => {
    Promise.all([
      personalForm.validateFields(),
      addressForm.validateFields()
    ]).then(([personalValues, addressValues]) => {
      console.log('Personal:', personalValues);
      console.log('Address:', addressValues);
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  return (
    <>
      <Form form={personalForm} name="personal">
        <Form.Item name="name" rules={[{ required: true }]}>
          <Input placeholder="Name" />
        </Form.Item>
      </Form>

      <Form form={addressForm} name="address">
        <Form.Item name="street" rules={[{ required: true }]}>
          <Input placeholder="Street" />
        </Form.Item>
      </Form>

      <Button onClick={onSubmitAll}>Submit All</Button>
    </>
  );
};
```

这个例子展示了如何使用两个独立的form实例来管理个人信息和地址信息,并在需要时一起提交它们。

总之,创建多个form实例提供了更大的灵活性,但也需要更谨慎的状态管理。根据你的具体需求,选择最适合的表单结构和实例数量。

### `form`和`select`结合使用，设置`select`的`value`不生效
被设置了 `name` 属性的 `Form.Item` 包装的控件，表单控件会自动添加 `value`（或 `valuePropName` 指定的其他属性） `onChange`（或 `trigger` 指定的其他属性），数据同步将被 `Form` 接管，这会导致以下结果：

- 你不再需要也不应该用 `onChange` 来做数据收集同步（你可以使用 `Form` 的 `onValuesChange`），但还是可以继续监听 `onChange` 事件。

- 你不能用控件的 `value` 或 `defaultValue` 等属性来设置表单域的值，默认值可以用 `Form` 里的 `initialValues` 来设置。注意 `initialValues` 不能被 `setState` 动态更新，你需要用 `setFieldsValue` 来更新。

- 你不应该用 `setState`，可以使用 `form.setFieldsValue` 来动态改变表单值。
  ```js
  form.setFieldsValue({
    字段名: 值,
  })
  ```

:::tip
`setFieldsValue` 只会更新你指定的字段，不会影响其他字段的值。如果你设置的字段在表单中不存在，这个操作不会有任何效果，也不会报错。这个方法是同步的，设置后立即生效。
:::

### 表单最后一行右对齐适配电脑分辨率
使用`Col`嵌套`Row`
```jsx
<Form
  form={form}
  name="basic"
  labelCol={{ span: 8 }}
  wrapperCol={{ span: 16 }}
  initialValues={{ remember: true }}
  className='form-container'
>
  <div className='content'>
    <Row>
      <Col span={8}>
        <Form.Item
          label="AAA"
          labelCol={{span: 5}}
          name="aaa"
        >
          <Select
            mode="multiple"
            style={{width:300,fontSize:11,borderRadius:3}}
            size='small'
            showArrow={true}
            showSearch={false}
            allowClear={true}
            onChange={(seletedData) => handleCommonChange(seletedData,'aaa')}
          >
            {
              [1,2,3,4].map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="BBB"
          labelCol={{span: 4}}
          name="bbb"
        >
          <Select
            mode="multiple"
            style={{width:300,fontSize:11,borderRadius:3}}
            size='small'
            showArrow={true}
            showSearch={false}
            allowClear={true}
            onChange={(seletedData) => handleCommonChange(seletedData,'bbb')}
          >
            {
              [1,2,3,4].map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="CCC"
          labelCol={{span: 4}}
          name="ccc"
        >
          <Select
            mode="multiple"
            style={{width:300,fontSize:11,borderRadius:3}}
            size='small'
            showArrow={true}
            showSearch={false}
            allowClear={true}
            onChange={(seletedData) => handleCommonChange(seletedData,'ccc')}
          >
            {
              [1,2,3,4].map((item,index) => {
                return <Option key={index} value={item}>{item}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row>
      <Col span={8} offset={16}>
        <Row>
          <Col span={4}></Col>
          <Col span={16}>
            <div style={{width:'300px',textAlign:'right'}}>
              <Button className='reset-btn' onClick={handleReset}>重置</Button>
              <Button className='search-btn' onClick={handleSearch}>查询</Button>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</Form>
```

### 组件的方法自定义传参
- 比如，`DatePicker`的`onChange`
```jsx
const handleDateChange = (_date:unknown,dateString:string,type:string) => {
  // type是自定义入参，date、dateString是onChange自带的入参
}

<DatePicker
  size='small'
  style={{width:300,fontSize:11,borderRadius:3}}
  placeholder='请选择日期'
  onChange={(date,dateString) => handleDateChange(date,dateString,'beginTime')}
/>
```

### `Table`组件的数据源需要有`key`这个属性
否则虽然不影响使用但是控制台报错提示
```js
const resultWithKey = res.result.reduce((acc: any[],cur: { key: number; },ind:number) => {
  cur.key = ind;
  acc.push(cur);
  return acc;
}, []);
setTableDatas(resultWithKey); // Table的数据源需要有key prop，否则不影响使用但控制台会报错提示
```

### `Table`组件列特别多时，设置列宽不生效
注意设置 `scroll={{ x: '4000px' }}` 这个`x`的宽度首先要能够容纳所有设置的列宽之和('4000px'只是举例)，这样在这个总的宽度之内去设置列宽，才能生效。

### `Table`组件怎么动态控制勾选框的勾中与取消
在 Ant Design 的 Table 组件中，可以使用 `rowSelection` 属性来动态控制行的勾选状态。`rowSelection` 属性接受一个对象，该对象可以包含 `selectedRowKeys` 和 `onChange` 等属性来管理选中的行。

以下是一个示例，展示了如何动态控制 Table 中勾选框的勾中与取消：

```jsx
import React, { useState } from 'react';
import { Table, Button } from 'antd';

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const toggleSelection = (key) => {
    setSelectedRowKeys((prevSelectedRowKeys) => {
      if (prevSelectedRowKeys.includes(key)) {
        return prevSelectedRowKeys.filter((selectedKey) => selectedKey !== key);
      } else {
        return [...prevSelectedRowKeys, key];
      }
    });
  };

  return (
    <div>
      <Button onClick={() => toggleSelection('1')}>Toggle Selection for Row 1</Button>
      <Button onClick={() => toggleSelection('2')}>Toggle Selection for Row 2</Button>
      <Button onClick={() => toggleSelection('3')}>Toggle Selection for Row 3</Button>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};

export default App;
```

代码解释:

1. **状态管理**：
   - 使用 `useState` 钩子来管理选中的行的 `selectedRowKeys`。

2. **数据和列定义**：
   - `data` 数组定义了表格的数据源。
   - `columns` 数组定义了表格的列。

3. **行选择配置**：
   - `rowSelection` 对象包含 `selectedRowKeys` 和 `onChange` 属性。
   - `selectedRowKeys` 用于存储当前选中的行的键。
   - `onChange` 回调函数在选中行变化时更新 `selectedRowKeys`。

4. **动态控制勾选状态**：
   - `toggleSelection` 函数用于动态控制行的选中状态。它接收一个行的 `key` 作为参数，并根据当前的 `selectedRowKeys` 来添加或移除该行的 `key`。

5. **按钮控制**：
   - 三个按钮分别用于切换对应行的选中状态。点击按钮时调用 `toggleSelection` 函数。

6. **Table 组件**：
   - `Table` 组件通过 `rowSelection` 属性来控制行的选择状态，并将 `columns` 和 `dataSource` 传递给表格。

通过这种方式，你可以动态地控制 Ant Design 表格中行的勾选和取消。

### `Table`组件需要设置`rowKey`
如果表格中列的值有重复的，比如有一列是sku，可能有重复的sku，这时控制台会报错：`Each child in a list should have a unique "key" prop.`

可以通过设置`rowKey`解决该问题：
```ts
<Table 
  dataSource={dataSource} 
  rowKey={(record) => record.id} // 假设 'id' 是唯一的
  ...
/>
```

### `message`使用注意事项
`message`使用报错:
```
Uncaught Error: Objects are not valid as a React child (found: object with keys {stack, message, name, code, config, request, response, status}). If you meant to render a collection of children, use an array instead.

The above error occurred in the <span> component:

span
div
PureContent
div
div
Notify
```

这个错误通常是因为你试图直接将一个对象渲染到 React 的 JSX 中，而 React 只能渲染原始类型（如字符串、数字）或 React 元素。如果你在使用 Ant Design 的 `message` 组件时遇到这个错误，可能是因为你试图显示一个对象而不是一个字符串。

为了避免这个错误，你需要确保传递给 `message` 组件的内容是一个字符串或其他可以正确渲染的类型。以下是一些具体的解决方案：确保传递字符串给 `message` 组件

如果你从某个操作（例如 API 请求）中获取了一个错误对象，你需要提取并格式化这个错误信息为字符串，然后再传递给 `message` 组件。

假设你有一个 API 请求，并且在请求失败时需要显示错误信息：

```javascript
import { message } from 'antd';
import axios from 'axios';

// 示例 API 请求函数
async function fetchData() {
  try {
    const response = await axios.get('https://api.example.com/data');
    console.log(response.data);
  } catch (error) {
    // 提取并格式化错误信息
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;

    // 显示错误信息
    message.error(`Error: ${errorMessage}`);
  }
}

// 调用函数以触发请求
fetchData();
```

如果你希望显示更详细的错误信息，可以将错误对象的相关信息提取并格式化为字符串：

```javascript
import { message } from 'antd';
import axios from 'axios';

// 示例 API 请求函数
async function fetchData() {
  try {
    const response = await axios.get('https://api.example.com/data');
    console.log(response.data);
  } catch (error) {
    // 提取并格式化错误信息
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;

    // 显示错误信息
    message.error(`Error: ${errorMessage}`);
    
    // 如果需要显示更多详细信息，可以进一步提取
    console.error('Full error details:', error);
  }
}

// 调用函数以触发请求
fetchData();
```

为了避免 `Uncaught Error: Objects are not valid as a React child` 错误，确保传递给 Ant Design 的 `message` 组件的内容是一个字符串或其他可以正确渲染的类型。通过提取和格式化错误信息，你可以确保 `message` 组件显示的是可读的错误消息，而不是 JavaScript 对象。

### `Upload`的`showUploadList`
Ant Design 的 Upload 组件中，`showUploadList` 属性用于控制上传列表的显示。这个属性可以是一个布尔值或一个对象，用来定制上传列表的显示行为。下面详细解释其用法和作用：

1. 基本用法（布尔值）：

```jsx
<Upload showUploadList={true}>
  <Button icon={<UploadOutlined />}>Upload</Button>
</Upload>
```

- 当设置为 `true`（默认值）时，显示上传列表。
- 当设置为 `false` 时，隐藏上传列表。

2. 高级用法（对象）：

```jsx
<Upload
  showUploadList={{
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: true,
    removeIcon: <CustomIcon />,
    downloadIcon: <CustomDownloadIcon />,
  }}
>
  <Button icon={<UploadOutlined />}>Upload</Button>
</Upload>
```

对象属性说明：

- `showPreviewIcon`（布尔值）：是否显示预览图标。
- `showRemoveIcon`（布尔值）：是否显示删除图标。
- `showDownloadIcon`（布尔值）：是否显示下载图标。
- `removeIcon`（ReactNode）：自定义删除图标。
- `downloadIcon`（ReactNode）：自定义下载图标。

3. 实际应用示例：

```jsx
import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined, StarOutlined } from '@ant-design/icons';

const App = () => (
  <Upload
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    showUploadList={{
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: true,
      removeIcon: <StarOutlined onClick={e => console.log(e, 'custom removeIcon event')} />,
      downloadIcon: <a>Download</a>,
    }}
  >
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
);

export default App;
```

4. `showUploadList` 的作用：

- 控制可见性：允许你控制整个上传列表或其特定部分的可见性。
- 自定义图标：可以替换默认的预览、删除和下载图标。
- 增强用户体验：通过显示或隐藏特定功能，你可以根据需求定制上传组件的用户界面。
- 简化界面：在某些情况下，你可能只想显示上传按钮而不显示文件列表，这时可以设置 `showUploadList={false}`。

5. 注意事项：

- 当使用对象形式时，未指定的属性会使用默认值。
- 自定义图标时，确保提供适当的点击处理函数（如果需要）。
- `showDownloadIcon` 仅在 `listType` 为 'picture' 或 'picture-card' 时有效。

通过灵活使用 `showUploadList`，你可以精确控制 Upload 组件的外观和功能，使其更好地适应你的具体需求和设计要求。

### `Upload`的`fileList`
Ant Design 的 Upload 组件中，`fileList` 属性是一个非常重要的属性，用于控制和管理上传文件的列表。它的作用和使用方法如下：

1. 基本作用：

- 控制上传文件列表：`fileList` 用于显示和管理已上传或正在上传的文件列表。
- 状态管理：通过 `fileList`，你可以跟踪每个文件的上传状态、进度等信息。
- 自定义文件列表：允许你完全控制显示哪些文件，以及如何显示它们。

2. 数据结构：

`fileList` 是一个对象数组，每个对象代表一个文件，通常包含以下字段：

```javascript
{
  uid: string;        // 文件唯一标识
  name: string;       // 文件名
  status: string;     // 上传状态，可能的值：uploading, done, error, removed
  url?: string;       // 文件URL（如果已上传）
  thumbUrl?: string;  // 缩略图URL
}
```

3. 使用示例：

```jsx
import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const App = () => {
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    },
  ]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      fileList={fileList}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export default App;
```

4. `fileList` 的主要作用：

- 初始化文件列表：可以预先设置已上传的文件列表。
- 控制文件状态：通过更新 `fileList`，你可以控制文件的上传状态、进度等。
- 自定义文件操作：可以在 `onChange` 事件中自定义文件的添加、删除、状态更新等操作。
- 实现受控组件：通过 `fileList` 和 `onChange`，可以将 Upload 组件变为完全受控的组件。

5. 高级用法：

- 过滤文件：可以在 `onChange` 中过滤或修改 `fileList`，以实现自定义的文件验证或处理逻辑。
- 限制上传数量：通过控制 `fileList` 的长度，可以限制可上传的文件数量。
- 自定义上传行为：结合 `beforeUpload` 属性，可以在文件上传前对 `fileList` 进行修改。

6. 注意事项：

- 确保为每个文件提供唯一的 `uid`。
- 当使用 `fileList` 时，Upload 组件变为受控组件，你需要自己管理文件列表的状态。
- 如果你只想显示文件列表而不控制它，可以使用 `defaultFileList` 属性。

通过合理使用 `fileList`，你可以实现复杂的文件上传逻辑，如批量上传、进度显示、自定义验证等功能，使 Upload 组件更好地适应你的具体需求。

### `Upload`限制上传数量
为了限制 Ant Design 的 `Upload` 组件只上传一张图片，你可以使用以下几种方法：

1. **设置 `maxCount` 属性**：
   `Upload` 组件在 Ant Design 4.9.0 版本之后新增了 `maxCount` 属性，可以直接限制上传文件的数量。

2. **在 `beforeUpload` 中进行文件数量检查**：
   在 `beforeUpload` 属性中，你可以检查当前已经上传的文件数量，并在达到限制时阻止新的文件上传。

这里是一个完整的示例，展示了如何使用 `maxCount` 和 `beforeUpload` 来限制上传文件数量为1：

```javascript
import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadComponent = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 只保留最新上传的文件
    newFileList = newFileList.slice(-1);

    setFileList(newFileList);

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const beforeUpload = (file) => {
    if (fileList.length >= 1) {
      message.error('You can only upload one file at a time');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <Upload
      action="/upload" // 替换为你的上传接口
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      maxCount={1} // 限制上传数量为1
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export default UploadComponent;
```

解释：

1. **`fileList` 状态**：
   - 使用 `useState` 管理上传的文件列表。
   - 在 `handleChange` 回调中更新文件列表，确保只保留最新的一个文件。

2. **`handleChange` 回调**：
   - `info.fileList` 包含当前上传的所有文件。
   - 使用 `slice(-1)` 方法只保留最新上传的一个文件。
   - 根据文件状态显示成功或失败的消息。

3. **`beforeUpload` 回调**：
   - 在文件上传前检查当前文件列表的长度。
   - 如果文件列表长度已经达到限制（1），则阻止新的文件上传并显示错误消息。

4. **`maxCount` 属性**：
   - 直接限制上传文件的数量为1。

这个示例展示了如何使用 Ant Design 的 `Upload` 组件来限制用户只能上传一张图片。通过结合 `maxCount` 属性和 `beforeUpload` 回调，可以确保用户上传的文件数量不会超过限制。

### 将 `Form.Item` 嵌套的 `Upload` 组件的文件列表与表单的 `name` 绑定
在 Ant Design 中，要将 Form.Item 嵌套的 Upload 组件的文件列表与表单的 name 绑定，可以使用 Form.Item 的 valuePropName 和 getValueFromEvent 属性，结合 Upload 组件的一些属性。以下是具体的实现方法：

```jsx
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const App = () => {
  const [form] = Form.useForm();

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      form={form}
      name="upload_form"
      onFinish={onFinish}
    >
      <Form.Item
        name="upload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Please upload a file' }]}
      >
        <Upload name="file" listType="text" multiple={false}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
```

关键点解释：

1. `valuePropName="fileList"`：
   这告诉 Form.Item 使用 Upload 组件的 fileList 属性来存储和读取值。

2. `getValueFromEvent={normFile}`：
   这个函数定义了如何从上传事件中提取值。在这个例子中，我们返回整个 fileList。

3. `normFile` 函数：
   这个函数处理上传事件，确保返回的是一个文件列表数组。

4. Upload 组件配置：
   - `name="file"`：指定上传的文件字段名。
   - `listType="text"`：定义上传列表的样式。
   - `multiple={false}`：这里设置为 false 表示只允许上传单个文件。如果需要多文件上传，可以设置为 true。

5. 表单提交：
   在 onFinish 函数中，你可以访问上传的文件信息。上传的文件列表将作为 `values.upload` 的值。

注意事项：

- 如果你需要在提交表单时实际上传文件，你需要在 onFinish 函数中手动处理文件上传逻辑，或者使用 Upload 组件的 `action` 属性指定上传 URL。
- 对于大文件或需要立即上传的场景，你可能需要调整 Upload 组件的配置，比如使用 `beforeUpload` 属性来控制上传行为。
- 如果需要显示上传进度或处理上传错误，可以使用 Upload 组件的其他属性和事件，如 `onProgress`, `onError` 等。

这种方法可以有效地将 Upload 组件集成到 Form 中，使文件上传成为表单数据的一部分，便于统一管理和提交。

### `Form`中使用`Upload`并回显
在 Ant Design 的表单中使用 `Upload` 组件并实现文件上传后的回显，你可以通过设置 `fileList` 属性来控制上传文件列表，并在表单初始化时设置初始值来回显已上传的文件。

以下是一个完整的示例，展示如何在 Ant Design 表单中使用 `Upload` 组件，并在表单初始化时回显已上传的文件：

```javascript
import React, { useState, useEffect } from 'react';
import { Form, Upload, Button, message, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const initialFileList = [
  {
    uid: '-1',
    name: 'example.png',
    status: 'done',
    url: 'https://example.com/example.png',
  },
];

const UploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState(initialFileList);

  useEffect(() => {
    // 设置表单的初始值，包括上传的文件列表
    form.setFieldsValue({
      files: fileList,
    });
  }, [form, fileList]);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 更新文件列表
    setFileList(newFileList);

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const beforeUpload = (file) => {
    // 在这里可以添加文件上传前的检查逻辑
    return true;
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="files"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={e => e.fileList}
      >
        <Upload
          action="/upload" // 替换为你的上传接口
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input your description!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadForm;
```

解释：

1. **初始文件列表**：
   - `initialFileList` 是一个包含已上传文件信息的数组。每个文件对象包含 `uid`, `name`, `status`, 和 `url` 属性，用于描述文件的唯一标识、文件名、上传状态和文件 URL。

2. **表单初始化**：
   - 使用 `useEffect` 钩子在组件挂载时设置表单的初始值，包括 `Upload` 组件的文件列表。

3. **`handleChange` 回调**：
   - 当上传文件列表发生变化时，更新文件列表状态并根据文件状态显示相应的消息。

4. **`beforeUpload` 回调**：
   - 在文件上传前可以添加检查逻辑，当前示例中直接返回 `true` 允许所有文件上传。

5. **表单项配置**：
   - `Form.Item` 使用 `name="files"` 和 `valuePropName="fileList"` 来绑定 `Upload` 组件的文件列表。
   - `getValueFromEvent` 属性用于从事件中提取文件列表并更新表单值。

6. **表单提交**：
   - 在 `onFinish` 回调中可以获取表单的所有值，包括上传的文件列表。

通过这种方式，你可以在 Ant Design 表单中使用 `Upload` 组件，并在表单初始化时回显已上传的文件。

### `Form`中动态使用`Upload`并回显
示例：
```tsx
import { Upload, UploadFile } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { UploadFileStatus } from "antd/lib/upload/interface";
import fetchApiData from "@/api";

export default function Demo() {
  const [dataInfo, setDataInfo] = useState(null);
  const [uploadedFilesInfo, setUploadedFilesInfo] = useState<{[key: string]: UploadFile[]}>({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let apiResult = await fetchApiData(`/demoApi`);
    if (apiResult) {
      if (apiResult.formList?.length && apiResult.mapInfo) {
        const imageList = apiResult.formList.filter((formItem) => formItem.type == 'image');
        let obj: {[key: string]: UploadFile[]} = {};
        for (let index = 0; index < imageList.length; index++) {
          const imageFormItem = imageList[index];
          let uploadFileList = [{
            url: apiResult.mapInfo[imageFormItem.name] as string,
            uid: `${apiResult.mapInfo.id+1}`,
            name: `${imageFormItem.name}.png`,
            status: 'done' as UploadFileStatus,
          }];
          obj[imageFormItem.name] = uploadFileList;
        }
        setUploadedFilesInfo(obj);
      }
      setDataInfo(apiResult);
    }
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只支持上传 JPG/PNG 文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于 2MB');
    }
    return isJpgOrPng && isLt2M;
  }
  const handleUploadChange = (info: any, config: IFormConfig) => {
    let newFiles = [...info.fileList];
    newFiles = newFiles.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setUploadedFilesInfo({...uploadedFilesInfo, [config.name]: newFiles});
  }

  return (
    <Form
      name="returnForm"
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      autoComplete="off"
    >
      {
        returnInfo?.formConfigList.map((config) => (
          <Form.Item
            key={config.name}
            name={config.name}
            label={config.label}
            // labelCol={{span: (config.type == 'image' || config.type == 'text') ? 4 : 4}}
            // wrapperCol={{span: (config.type == 'image' || config.type == 'text') ? 16 : 16}}
            initialValue={`${returnInfo.dataMap[config.name]}`}
            // valuePropName={config.type=='image' ? 'fileList' : 'value'}
            // getValueFromEvent={(e) => setFormEvent(e, config)}
            rules={[{ required: config.required, message: config.message }]}
          >
            {
              config.type == 'select' && !!config.optionsName &&
              <Select options={getSelectOptions(returnInfo[config.optionsName])} onChange={(value, option) => handleSelectChange(config, value, option)}  />
            }
            {
              config.type == 'text' &&
              <TextArea rows={4} showCount maxLength={200} placeholder={config.placeholder} className="remark-input" />
            }
            {
              config.type == 'input' &&
              <Input placeholder={config.placeholder} />
            }
            {
              config.type == 'image' &&
              <Upload
                name="fileData"
                listType="picture-card"
                className="img-uploader"
                action="/api/upload/commonUploadFile"
                maxCount={1}
                fileList={uploadedFilesInfo[config.name]}
                // showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={(info) => handleUploadChange(info, config)}
              >
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </button>
              </Upload>
            }
          </Form.Item>
        ))
      }
    </Form>
}
```

### Upload报错：`(intermediate value).forEach is not a function`
出现 `(intermediate value).forEach is not a function` 错误通常是因为 `Upload` 组件的 `fileList` 属性传递的值不是一个数组。确保 `fileList` 始终是一个数组类型。

以下是一个完整的示例，展示如何在 Ant Design 表单中使用 `Upload` 组件并正确回显已上传的文件，同时确保 `fileList` 始终是一个数组：

```javascript
import React, { useState, useEffect } from 'react';
import { Form, Upload, Button, message, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const initialFileList = [
  {
    uid: '-1',
    name: 'example.png',
    status: 'done',
    url: 'https://example.com/example.png',
  },
];

const UploadForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState(initialFileList);

  useEffect(() => {
    // 设置表单的初始值，包括上传的文件列表
    form.setFieldsValue({
      files: fileList,
    });
  }, [form, fileList]);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 更新文件列表
    setFileList(newFileList);

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const beforeUpload = (file) => {
    // 在这里可以添加文件上传前的检查逻辑
    return true;
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="files"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
      >
        <Upload
          action="/upload" // 替换为你的上传接口
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input your description!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadForm;
```

关键点解释:

1. **确保 `fileList` 始终是数组**：
   - 在 `getValueFromEvent` 属性中，使用 `(e) => (Array.isArray(e) ? e : e && e.fileList)` 确保 `fileList` 始终是一个数组。

2. **初始文件列表**：
   - `initialFileList` 是一个包含已上传文件信息的数组。每个文件对象包含 `uid`, `name`, `status`, 和 `url` 属性，用于描述文件的唯一标识、文件名、上传状态和文件 URL。

3. **表单初始化**：
   - 使用 `useEffect` 钩子在组件挂载时设置表单的初始值，包括 `Upload` 组件的文件列表。

4. **`handleChange` 回调**：
   - 当上传文件列表发生变化时，更新文件列表状态并根据文件状态显示相应的消息。

5. **`beforeUpload` 回调**：
   - 在文件上传前可以添加检查逻辑，当前示例中直接返回 `true` 允许所有文件上传。

6. **表单项配置**：
   - `Form.Item` 使用 `name="files"` 和 `valuePropName="fileList"` 来绑定 `Upload` 组件的文件列表。
   - `getValueFromEvent` 属性用于从事件中提取文件列表并更新表单值。

通过这种方式，你可以在 Ant Design 表单中使用 `Upload` 组件，并在表单初始化时回显已上传的文件，同时确保 `fileList` 始终是一个数组，避免出现 `.forEach is not a function` 的错误。

### `Form.Item` 的 `getValueFromEvent`属性
Ant Design 的 Form.Item 组件中，`getValueFromEvent` 是一个非常有用的属性，用于自定义如何从事件中提取表单项的值。这个属性在处理非标准表单控件或需要特殊处理的输入值时特别有用。

以下是关于 `getValueFromEvent` 的详细解释和使用示例：

1. 基本概念：

`getValueFromEvent` 是一个函数，它接收事件对象作为参数，并返回你希望作为表单项值的内容。

2. 基本语法：

```jsx
<Form.Item
  name="fieldName"
  getValueFromEvent={(event) => {
    // 处理事件并返回值
    return processedValue;
  }}
>
  <YourComponent />
</Form.Item>
```

3. 常见用例：

a. 处理自定义输入组件：

```jsx
<Form.Item
  name="customInput"
  getValueFromEvent={(event) => event.target.value.toUpperCase()}
>
  <Input />
</Form.Item>
```

这个例子将输入值转换为大写。

b. 处理文件上传：

```jsx
<Form.Item
  name="upload"
  valuePropName="fileList"
  getValueFromEvent={(e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }}
>
  <Upload>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
</Form.Item>
```

这个例子处理 Upload 组件的文件列表。

c. 处理复选框组：

```jsx
<Form.Item
  name="checkboxGroup"
  getValueFromEvent={(checkedValues) => checkedValues.join(',')}
>
  <Checkbox.Group options={['A', 'B', 'C']} />
</Form.Item>
```

这个例子将选中的值转换为逗号分隔的字符串。

4. 高级用例：

a. 处理复杂对象：

```jsx
<Form.Item
  name="complexObject"
  getValueFromEvent={(event, prevValue) => {
    return {
      ...prevValue,
      [event.target.name]: event.target.value
    };
  }}
>
  <ComplexComponent />
</Form.Item>
```

这个例子处理一个复杂对象，保留之前的值并更新特定字段。

b. 异步处理：

```jsx
<Form.Item
  name="asyncField"
  getValueFromEvent={async (event) => {
    const result = await someAsyncOperation(event.target.value);
    return result;
  }}
>
  <Input />
</Form.Item>
```

这个例子展示了如何异步处理输入值。

5. 注意事项：

- `getValueFromEvent` 应该是一个纯函数，不应该有副作用。
- 确保返回值的类型与表单项期望的类型一致。
- 对于一些复杂的场景，可能需要结合 `valuePropName` 一起使用。
- 在处理异步操作时要小心，确保不会影响表单的整体性能。

6. 与其他属性的配合：

`getValueFromEvent` 经常与 `valuePropName` 和 `trigger` 属性一起使用，以完全自定义表单项的行为：

```jsx
<Form.Item
  name="customField"
  valuePropName="checked"
  trigger="onMyCustomChange"
  getValueFromEvent={(value) => value ? 'YES' : 'NO'}
>
  <CustomToggle />
</Form.Item>
```

通过灵活使用 `getValueFromEvent`，你可以处理各种复杂的表单场景，使 Form.Item 能够适应几乎任何类型的输入组件和数据处理需求。这大大增加了 Ant Design Form 的灵活性和可扩展性。

### `Form.Item`嵌套
`name`设置为数组，如下：

```jsx
const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const beforeUpload = (file: any) => {
  const isImgAudioVedio = ["image/jpeg", "image/jpg", "image/png", "video/mp4", "video/avi", "video/mov", "video/quicktime", "audio/mpeg", "audio/ogg", "audio/aac"].includes(file.type);
  if (!isImgAudioVedio) {
    message.error('只支持上传照片、视频、音频文件');
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error('文件大小不超过50MB');
  }
  return isImgAudioVedio && isLt50M;
}
const handleUploadChange = (uploadInfo: any) => {
  // 上传状态为完成时设置url
  if (uploadInfo.file.status === 'done') {
    uploadInfo.fileList.map((file: any) => {
      if (file.response) {
        file.url = file.response[0].path;
      }
      return file
    })
  }
}

const nestFormItemRender = () => {
  return (
    <div>
      {
        nestFormItems?.map((item: any, index: number) => (
          <div className="nest-item-wrapper" key={item.id}>
            <div className="item-title">
              <Form.Item
                name={['nestItems', index, 'name']}
                label={`名称${chineseNumbers[index+1]}`}
                initialValue={item.name}
                rules={[{ required: true, message: `请选择名称${chineseNumbers[index+1]}` }]}
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="row">
              <Form.Item
                label="数量"
                name={['nestItems', index, 'num']}
                initialValue={item.num}
                rules={[{ required: true }]}
              >
                <InputNumber
                  addonBefore={<img src={numMinusIcon} />}
                  addonAfter={<img src={numPlusIcon} />}
                  min={1}
                  controls={false}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="是否打开"
                name={['nestItems', index, 'on']}
                initialValue={item.on}
                labelCol={{ span: 6 }}
              >
                <Switch checkedChildren="是" unCheckedChildren="否" disabled />
              </Form.Item>
            </div>
            <div className="upload-wrapper">
              <Form.Item
                label="附件"
                name={['nestItems', index, 'files']}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                initialValue={item.fileList ? item.fileList.map((ele: any) => ({
                  name: ele.fileName,
                  status: 'done',
                  url: ele.fileUrl,
                  fileType: ele.fileType,
                })) : []}
                rules={[{ required: true, message: '请上传附件' }]}
              >
                <Upload
                  action={'/api/upload/uploadFile'}
                  name="fileData"
                  beforeUpload={beforeUpload}
                  maxCount={5}
                  onChange={handleUploadChange}
                >
                  <div className="upload-btn">
                    <img src={pcUploadIcon} />
                    <div>本地上传</div>
                  </div>
                </Upload>
              </Form.Item>
              <div className="tip">请上传照片、视频、音频文件，每份文件不超过50M，最多上传5份</div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
```

### `Form`中使用`Select`并回显
`Form.Item`的`initialValue`

### [`Form.useWatch`](https://ant-design.antgroup.com/components/form-cn#formusewatch)
用于直接获取 `form` 中字段对应的值。

例如：
```js
const reservationStatus = Form.useWatch('reservationStatus', form);
```

### `Form`中使用`DatePicker`并回显
`Form.Item`的`initialValue`使用`dayjs`处理

```ts
<Form.Item
  key={detailFormItem.itemCode}
  name={detailFormItem.itemCode}
  label={detailFormItem.itemName}
  initialValue={dayjs(detailFormItem.itemValue)}
  rules={[{ required: detailFormItem.required, message: `请填写${detailFormItem.itemName}` }]}
></Form.Item>
```

### `Form.List` 中的 `Form.Item` 设置 `name`
在 Ant Design 的 Form.List 中设置表单项的 name 需要结合 Form.List 的 fields 参数和嵌套字段语法。以下是如何正确设置 Form.List 中表单项 name 的方法和示例：

1. 基本语法：

在 Form.List 中，每个字段的 name 应该是一个数组，包含 Form.List 的 name 和当前字段的索引。

```jsx
<Form.List name="users">
  {(fields, { add, remove }) => (
    <>
      {fields.map((field, index) => (
        <Form.Item
          {...field}
          name={[field.name, 'firstName']}
          // ...
        >
          <Input />
        </Form.Item>
      ))}
    </>
  )}
</Form.List>
```

2. 完整示例：

这里是一个更完整的示例，展示了如何在 Form.List 中设置多个表单项的 name：

```jsx
import { Form, Input, Button } from 'antd';

const App = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[name, 'firstName']}
                  rules={[{ required: true, message: 'Missing first name' }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'lastName']}
                  rules={[{ required: true, message: 'Missing last name' }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
                <Button onClick={() => remove(name)}>Delete</Button>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
```

在这个例子中：

- Form.List 的 name 设置为 "users"。
- 每个表单项的 name 设置为 `[name, 'firstName']` 和 `[name, 'lastName']`，其中 `name` 是 Form.List 提供的字段索引。
- 这样设置后，提交的表单数据结构会是：

```javascript
{
  users: [
    { firstName: '...', lastName: '...' },
    { firstName: '...', lastName: '...' },
    // ...
  ]
}
```

3. 注意事项：

- 确保使用 Form.List 提供的 `field` 对象中的 `name` 属性作为每个字段的索引。
- 如果需要嵌套更深的结构，可以继续添加数组元素，如 `[name, 'address', 'street']`。
- 使用 `...restField` 展开 Form.List 提供的其他字段属性，以确保正确的字段绑定。

通过这种方式，你可以灵活地在 Form.List 中设置和管理动态表单项的 name。

### `Form.List` 设置初始值
可以使用 `Form` 组件的 `initialValues` 属性或者 `Form.List` 的 `initialValue` 属性。如果你的 `Form.List` 结构比较复杂，包含了多个嵌套字段，建议使用 `Form` 的 `initialValues` 属性。
```tsx
import { useEffect, useState } from "react";
import fetchApiData from "@/api";
import { Form } from "antd";

const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export default function Demo() {
  const [info, setInfo] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    let apiResult = await fetchApiData(`/getInfo`);
    if (apiResult) {
      let obj = { ...apiResult };
      if (obj.infoItems) {
        // 获取数据后根据Form.List中的Form.Item的name设置初始值
        obj.infoItems = obj.infoItems.map((item: any) => ({
          material: item.feeItemName,
          files: [],
          ...item,
        }));
      }
      setInfo(obj);
    }
  }
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleUploadChange = (uploadInfo: any) => {
    // 上传状态为完成时设置url
    if (uploadInfo.file.status === 'done') {
      uploadInfo.fileList.map((file: any) => {
        if (file.response) {
          file.url = file.response[0].path;
        }
        return file
      })
    }
  }

  return (
    <Form
      name="demoForm"
      form={form}
      autoComplete="off"
      colon={false}
      initialValues={{
        infoItems: info?.infoItems, // 设置name为infoItems的Form.List的初始值
      }}
    >
      <Form.List
        name="infoItems"
        rules={[
          {
            validator: async (_, infoItems) => {
              if (!infoItems || infoItems.length == 0) {
                return Promise.reject(new Error('请添加信息'));
              }
            }
          }
        ]}
      >
        {
          (fields, { add, remove }, { errors }) => (
            <>
              <Form.Item label="信息" rules={[{ required: true }]}>
                <div className="material-wrapper">
                  <div onClick={() => add()} className="btn">
                    <img src={plusIcon} />
                    <div>添加信息</div>
                  </div>
                  <div className="tip">凭证上传要求：支持照片、视频、音频文件，每份文件不超过50M，最多上传5份</div>
                </div>
                <Form.ErrorList errors={errors} />
              </Form.Item>
              {
                // 使用 slice().reverse() （这不会改变原数组）使Form.List 中的项目倒序排列
                fields.slice().reverse().map(({ key, name, ...restField }) => (
                  <div className="material-item-wrapper" key={key}>
                    <div className="item-title">
                      <Form.Item
                        {...restField}
                        name={[name, 'material']}
                        label={`信息${chineseNumbers[name+1]}`}
                        rules={[{ required: true, message: `请选择信息${chineseNumbers[name+1]}` }]}
                      >
                        <Cascader
                          options={infoOptions}
                          fieldNames={{
                            label: 'name',
                            value: 'code',
                            children: 'children'
                          }}
                          loadData={loadData}
                          // changeOnSelect
                          placeholder="请选择"
                        />
                      </Form.Item>
                      <div className="del" onClick={() => remove(name)}>删除</div>
                    </div>
                    <div className="row">
                      <Form.Item
                        {...restField}
                        label="数量"
                        name={[name, 'num']}
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          addonBefore={<img src={numMinusIcon} onClick={() => handleMinus([name, 'num'])} />}
                          addonAfter={<img src={numPlusIcon} onClick={() => handlePlus([name, 'num'])} />}
                          min={1}
                          controls={false}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="是否修理"
                        name={[name, 'repair']}
                        initialValue={false}
                        labelCol={{ span: 6 }}
                      >
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                      </Form.Item>
                    </div>
                    <div className="upload-wrapper">
                      <Form.Item
                        {...restField}
                        label="附件"
                        name={[name, 'files']}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: '请上传附件' }]}
                      >
                        <Upload
                          action={'/upload'}
                          name="fileData"
                          beforeUpload={beforeUpload}
                          maxCount={5}
                          onChange={handleUploadChange}
                        >
                          <div className="upload-btn">
                            <img src={pcUploadIcon} />
                            <div>本地上传</div>
                          </div>
                        </Upload>
                      </Form.Item>
                      <div className="tip">请上传照片、视频、音频文件，每份文件不超过50M，最多上传5份</div>
                    </div>
                  </div>
                ))
              }
            </>
          )
        }
      </Form.List>
    </Form>
  )
}
```

### `Cascader`的初始数据是嵌套数据的情况下使用`loadData`
如果初始数据是嵌套的，我们需要调整 `loadData` 的实现来处理这种情况。以下是一个处理嵌套初始数据的示例：

```jsx
import React, { useState } from 'react';
import { Cascader } from 'antd';

const App = () => {
  const [options, setOptions] = useState([
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖区',
              isLeaf: true,
            },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          isLeaf: true,
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          isLeaf: false, // 标记为可以进一步加载
        },
      ],
    },
  ]);

  const loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 模拟异步请求
    setTimeout(() => {
      targetOption.loading = false;
      if (targetOption.value === 'nanjing') {
        targetOption.children = [
          {
            label: '鼓楼区',
            value: 'gulou',
            isLeaf: true,
          },
          {
            label: '玄武区',
            value: 'xuanwu',
            isLeaf: true,
          },
        ];
      }
      setOptions([...options]);
    }, 1000);
  };

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={onChange}
      changeOnSelect
    />
  );
};

export default App;
```

关键点解释：

1. 初始数据结构：
   - 数据已经是嵌套的，包含了多层级的选项。
   - 某些节点（如 '南京'）标记为 `isLeaf: false`，表示它们可以进一步加载子选项。

2. `loadData` 函数：
   - 只处理那些标记为 `isLeaf: false` 的选项。
   - 在这个例子中，只有 '南京' 需要进一步加载数据。

3. 动态加载：
   - 当用户选择 '南京' 时，`loadData` 函数会被触发。
   - 模拟异步请求后，为 '南京' 添加子选项。

4. 更新状态：
   - 使用 `setOptions([...options])` 来触发重新渲染，确保新添加的数据显示出来。

5. `isLeaf` 属性：
   - 对于确定没有子选项的节点，设置 `isLeaf: true`。
   - 对于可能有子选项但尚未加载的节点，设置 `isLeaf: false`。

注意事项：

- **确保正确设置 `isLeaf` 属性。只有 `isLeaf: false` 的选项才会触发 `loadData`。**
- 对于已经有子选项的节点，不需要设置 `isLeaf`，Cascader 会自动处理。
- 在实际应用中，你可能需要根据后端 API 的响应动态设置 `isLeaf`。
- 考虑添加错误处理，以应对数据加载失败的情况。

这种方法允许你在初始时加载部分数据，然后根据用户的选择动态加载更多数据。这对于处理大型数据集或需要逐步从服务器获取数据的场景非常有用，可以提高初始加载速度和整体性能。

### InputNumber自定义加减号
使用 `addonBefore` 和 `addonAfter` ，以下是一种实现方法：

```jsx
import React from 'react';
import { InputNumber, Button } from 'antd';

const App = () => {
  const handleAddonBeforeClick = () => {
    console.log('AddonBefore clicked');
    // 在这里添加你的逻辑
  };

  const handleAddonAfterClick = () => {
    console.log('AddonAfter clicked');
    // 在这里添加你的逻辑
  };

  return (
    <InputNumber
      addonBefore={
        <Button 
          type="text" 
          onClick={handleAddonBeforeClick}
          style={{ border: 'none', padding: 0 }}
        >
          Before
        </Button>
      }
      addonAfter={
        <Button 
          type="text" 
          onClick={handleAddonAfterClick}
          style={{ border: 'none', padding: 0 }}
        >
          After
        </Button>
      }
      controls={false}
    />
  );
};

export default App;
```

关键点解释：

1. 自定义 addonBefore 和 addonAfter：
   - 使用 Button 组件作为自定义的 addon 内容。
   - 设置 Button 的 type 为 "text"，使其看起来像普通文本。

2. 添加点击事件处理器：
   - 为 Button 组件添加 onClick 事件处理器。

3. 样式调整：
   - 使用 style 属性移除 Button 的边框和内边距，使其看起来更像 InputNumber 的一部分。

4. 事件处理函数：
   - `handleAddonBeforeClick` 和 `handleAddonAfterClick` 函数用于处理点击事件。
   - 你可以在这些函数中添加自定义逻辑。

注意事项：

- 这种方法会改变 addonBefore 和 addonAfter 的默认外观。如果你想保持原有的外观，可能需要进一步调整样式。

- 如果你需要更复杂的交互，可以考虑使用自定义的 React 组件作为 addon。

- 确保点击事件不会干扰到 InputNumber 的正常使用。

- 如果你需要访问 InputNumber 的值或其他属性，可以将这个组件封装在一个父组件中，并通过 props 传递必要的信息和回调函数。

示例扩展：如果你需要在点击事件中访问 InputNumber 的值，可以这样修改：

```jsx
import React, { useState } from 'react';
import { InputNumber, Button } from 'antd';

const App = () => {
  const [value, setValue] = useState(0);

  const handleAddonBeforeClick = () => {
    console.log('AddonBefore clicked, current value:', value);
    // 其他逻辑...
  };

  const handleAddonAfterClick = () => {
    console.log('AddonAfter clicked, current value:', value);
    // 其他逻辑...
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <InputNumber
      value={value}
      onChange={handleChange}
      addonBefore={
        <Button 
          type="text" 
          onClick={handleAddonBeforeClick}
          style={{ border: 'none', padding: 0 }}
        >
          Before
        </Button>
      }
      addonAfter={
        <Button 
          type="text" 
          onClick={handleAddonAfterClick}
          style={{ border: 'none', padding: 0 }}
        >
          After
        </Button>
      }
    />
  );
};

export default App;
```

这种方法允许你在 addonBefore 和 addonAfter 的点击事件中访问和操作 InputNumber 的当前值。

## elementui使用记录
### 1. `el-radio`切换不了
- 查看选中的值有没有变
- 选中的值变了，但是显示的没变，可以在change事件中强更新
```js
handleChange() {
  this.$forceUpdate();
}
```

### 2. `el-form`校验不通过
- 初次按规则输入，校验正常通过
- 回填后，清空，再填，相同规则校验一直不能通过
- 发现清空时对表单字段的处理有问题，表单对象初始化没有的字段，使用`delete`关键字清空
```js
<el-form :model="form">
  <el-form-item label="AAA：" prop="a" :rules="[ { required: true, message: '请选择AAA', trigger: 'change'} ]">
    <el-cascader
      v-model="form.a"
      :options="aOptions"
      :props="aProps"
      @change="handleChangeAAA"
      style="width: 100%;"
      clearable
    >
    </el-cascader>
  </el-form-item>
  <el-form-item label="BBB：" prop="b" :rules="[ { required: true, message: '请选择BBB', trigger: 'change'} ]">
    <el-select v-model="form.b" placeholder="请选择">
      <el-option
        v-for="(item, index) in bOptions"
        :label="item.label"
        :value="item.value"
        :key="index"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="CCC：" prop="c" :rules="{ required: true, message: '请选择CCC', trigger: 'change' }">
    <el-radio-group v-model="form.c" @change="handleChangeCCC">
      <el-radio :label="1" >CCC-1</el-radio>
      <el-radio :label="2" >CCC-2</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="DDD：" prop="d" :rules="[
    { required: true, message: '请填写DDD', trigger: ['blur', 'change'] },
    { max: 50, message: '不可超过50个字符', trigger: ['blur', 'change'] }
  ]">
    <el-input v-model="form.d" type="textarea" :rows="2" placeholder="请输入不超过50个字符"></el-input>
  </el-form-item>
</el-form>

<script>
  export default {
    data() {
      return {
        form: {},
      }
    },
    methods: {
      // 回填
      handleEcho() {
        this.form.a = 1;
        this.form.b = 'bbbbbb';
        this.form.c = 10;
        this.form.d = 'dddddd';
      },
      // 清空
      handleClear() {
        delete this.form.a; // this.form.a = null; 赋值null能清空，但再次选择后校验依然是该项没值
        this.form.b = ''; // 字符串类型的字段赋值空字符串也正常，不用delete
        delete this.form.c; // this.form.c = null; 赋值null能清空，但再次选择后校验依然是该项没值
        this.form.d = ''; // 字符串类型的字段赋值空字符串也正常，不用delete
      },
    },
  }
</script>
```

### 3. `el-upload`校验文件类型
```html
<el-upload
  class="upload-acceptance"
  :action="'https://xxx'"
  :headers="{'xxx': 'xxx'}"
  :on-preview="handleAcceptPreview"
  :on-remove="handleAcceptRemove"
  :on-success="handleAcceptSuccess"
  multiple
  :limit="20"
  :before-upload="handleBeforeUpload"
  :on-exceed="handleAcceptExceed"
  :file-list="fileList"
  list-type="picture"
>
  <el-button size="small">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传图片，最多支持20个，且单个不超过5MB</div>
</el-upload>
```
```js
handleBeforeUpload(file) {
  // 判断是否为图片
  const isImage = file.type.startsWith('image/');
  // 判断是否为excel
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  // 对file name做处理
  if (file.name.includes('(')) {
    Object.defineProperty(file, 'name', {
      writable: true,
      value: file.name.replace(/\([^\)]*\)/g,"") // 去掉文件名中的括号
    });
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    this.$message.error('只能上传图片！');
  }
  if (!isLt5M) {
    this.$message.error('上传图片大小不能超过 5MB！');
  }
  return isImage && isLt5M;
},
```

### 4. form表单嵌套upload进行校验
在使用 Element UI 进行表单验证时，如果表单中嵌套了 `el-upload` 组件，你可以通过自定义校验规则来实现文件上传的验证。以下是一个示例，展示了如何在表单中嵌套 `el-upload` 组件并进行校验：

```html
<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="120px">
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    
    <el-form-item label="Upload" prop="upload">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :file-list="form.upload"
      >
        <el-button slot="trigger" size="small" type="primary">Select File</el-button>
        <div slot="tip" class="el-upload__tip">Only jpg/png files with a size less than 500kb are allowed.</div>
      </el-upload>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">Submit</el-button>
      <el-button @click="resetForm('form')">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        upload: []
      },
      rules: {
        name: [
          { required: true, message: 'Please input name', trigger: 'blur' }
        ],
        upload: [
          { required: true, validator: this.validateUpload, trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.form.upload = fileList;
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isJPG) {
        this.$message.error('Upload image must be JPG or PNG format!');
      }
      if (!isLt2M) {
        this.$message.error('Upload image size cannot exceed 500KB!');
      }
      return isJPG && isLt2M;
    },
    validateUpload(rule, value, callback) {
      if (this.form.upload.length === 0) {
        callback(new Error('Please upload a file'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('Submit successful!');
        } else {
          this.$message.error('Submit failed!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.upload = [];
    }
  }
};
</script>

<style>
.upload-demo {
  margin-bottom: 20px;
}
</style>
```

在这个示例中，我们做了以下几件事：

1. 在 `el-form` 中定义了一个 `el-upload` 组件来处理文件上传。
2. 使用 `handleSuccess` 方法在文件上传成功后更新表单模型中的 `upload` 属性。
3. 使用 `beforeUpload` 方法在上传文件之前进行文件类型和大小的验证。
4. 定义自定义校验规则 `validateUpload`，确保用户上传了至少一个文件。
5. 在表单提交时，进行校验并显示相应的消息。

这样，当用户上传文件并提交表单时，表单会进行验证，确保所有必填项包括文件上传都已完成。

### 5. 去掉 Element UI 上传组件的文件列表动画
要去掉 Element UI 上传组件的文件列表动画，你可以通过覆盖相关的 CSS 样式来实现。以下是几个步骤：

1. 首先，找到上传组件的根元素，通常是 `.el-upload-list`。

2. 然后，覆盖与动画相关的 CSS 属性。主要是 `transition` 属性。

3. 你可以在你的组件或全局样式中添加以下 CSS：

```css
<style scoped>
.el-upload-list--text {
  transition: none !important;
}

.el-upload-list__item {
  transition: none !important;
}

.el-upload-list__item-name {
  transition: none !important;
}

/* 如果使用了缩略图模式，也可以添加这个 */
.el-upload-list--picture .el-upload-list__item {
  transition: none !important;
}
</style>
```

4. 如果你想全局应用这个样式，可以去掉 `scoped` 属性，或者在你的主 CSS 文件中添加这些样式。

5. 如果以上方法不完全有效，你可能需要使用 `!important` 来确保你的样式覆盖了 Element UI 的默认样式。

6. 对于某些特定的动画，你可能还需要覆盖其他的 CSS 属性，如 `animation`。

例如：

```css
.el-upload-list__item,
.el-upload-list__item-name,
.el-upload-list--picture .el-upload-list__item {
  transition: none !important;
  animation: none !important;
}
```

请注意，移除动画可能会影响用户体验，因为动画通常用于提供视觉反馈。确保这符合你的设计需求。

如果你只想移除特定实例的动画，而不是全局移除，你可以给你的上传组件一个特定的类名，然后只针对这个类名应用以上的 CSS 样式。

## vxe-grid使用记录
:::tip
[vxe-table](https://vxetable.cn/): 一个基于 vue 的 PC 端表格组件，支持增删改查、虚拟列表、虚拟树、懒加载、快捷菜单、数据校验、打印导出、表单渲染、数据分页、弹窗、自定义模板、渲染器、贼灵活的配置项等。
:::

### 1. 按需引入vxe-grid
- `npm install xe-utils vxe-table@legacy`
- `npm install babel-plugin-import -D`
- 在`main.js`中引入
```js title="src/main.js"
import XEUtils from 'xe-utils'
import { VXETable,Grid,Table as VTable } from 'vxe-table' // Table导入时重命名是为了避免和其他UI库的Table组件命名冲突
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
VXETable.setup({ // 设置国际化中文是为了让vxe-grid的loading显示“加载中”
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})
Vue.use(Grid)
Vue.use(VTable) // 需要引入vxe-table的Table组件，否则使用vxe-grid时会报错
```
- 配置`babel.config.js`或者`.babelrc`
```js title="babel.config.js"
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "vxe-table",
        "style": true // 样式是否也按需加载
      }
    ]
  ]
}
```

## 生成二维码
在 Vue.js 项目中生成二维码可以使用 `qrcode` 库。以下是一个简单的步骤指南：

1. **安装 `qrcode` 库**：
   ```bash
   npm install qrcode
   ```

2. **在 Vue 组件中使用 `qrcode`**：

   ```vue
   <template>
     <div>
       <canvas ref="qrcodeCanvas"></canvas>
     </div>
   </template>

   <script>
   import QRCode from 'qrcode'

   export default {
     name: 'QRCodeGenerator',
     mounted() {
       this.generateQRCode()
     },
     methods: {
       generateQRCode() {
         const canvas = this.$refs.qrcodeCanvas
         const text = 'https://example.com' // 你想要生成二维码的文本或URL

         QRCode.toCanvas(canvas, text, function (error) {
           if (error) console.error(error)
           console.log('二维码生成成功！')
         })
       }
     }
   }
   </script>
   ```

遇到的问题：需要在弹窗中展示二维码，按以上步骤开发运行报错：`TypeError: Cannot read properties of undefined (reading 'getContext')`
```vue
<template>
  <div>
   <el-button @click="handleLookQrcode">查看二维码</el-button>
   <el-dialog
      :visible.sync="qrcodeVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div slot="title">二维码如下</div>
      <div>
        <canvas ref="qrcodeCanvas"></canvas>
      </div>
      <div slot="footer">
        <el-button @click="qrcodeVisible = false">取消</el-button>
        <el-button @click="handleCopy">复制</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  data() {
    return {
      qrcodeVisible: false,
    }
  },
  methods: {
    handleLookQrcode() {
      this.qrcodeVisible = true;
      this.generateQRCode();
    },
    generateQRCode() {
      const canvas = this.$refs.qrcodeCanvas;
      const text = 'https://example.com' // 你想要生成二维码的文本或URL
      console.log('canvas', canvas)
      try {
        QRCode.toCanvas(canvas, text, function (error) {
          if (error) console.error(error)
          console.log('二维码生成成功！')
        })
      } catch (error) {
        console.log('error', error)
      }
    },
  }
}
</script>
```
这个报错是因为尝试获取二维码画布的上下文时，画布对象未正确初始化或未找到。如上打印`canvas`为`undefined`，将`handleLookQrcode`改为：
```js
handleLookQrcode() {
  this.qrcodeVisible = true;
  setTimeout(() => {
    this.generateQRCode();
  }, 0);
},
```

## 复制粘贴
为了确保在所有浏览器中都能正常工作，可以使用 `clipboard-polyfill` 库。安装：`npm install clipboard-polyfill`

### 复制文本
```js
<template>
  <div>
    <button @click="handleCopy">Copy Multiple Texts</button>
  </div>
</template>

<script>
import * as clipboard from 'clipboard-polyfill';

export default {
  methods: {
    async handleCopy() {
      try {
        const text1 = 'First text content';
        const text2 = 'Second text content';
        
        // 将多个文本内容组合成一个字符串
        const combinedText = `${text1}\n${text2}`;
        
        // 使用 clipboard-polyfill 复制组合后的文本内容
        await clipboard.writeText(combinedText);
        alert('Multiple texts copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy texts: ', error);
      }
    }
  }
};
</script>
```

### 复制图片
在 Vue 中复制图片到剪贴板可以通过以下步骤实现：

1. **获取图片的 Blob 对象**。
2. **将 Blob 对象写入剪贴板**。

以下是一个完整的示例：

```javascript
<template>
  <div>
    <img ref="image" src="path/to/your/image.jpg" alt="Image to copy" />
    <button @click="copyImage">Copy Image</button>
  </div>
</template>

<script>
import * as clipboard from 'clipboard-polyfill';

export default {
  methods: {
    async copyImage() {
      try {
        const img = this.$refs.image;
        const response = await fetch(img.src);
        const blob = await response.blob();
        await clipboard.write([new clipboard.ClipboardItem({ [blob.type]: blob })]);
        alert('Image copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy image: ', error);
      }
    }
  }
};
</script>
```

1. **获取图片元素**：通过 `this.$refs.image` 获取图片元素。
2. **获取图片的 Blob 对象**：使用 `fetch` 请求图片的 URL，并将响应转换为 Blob 对象。
3. **将 Blob 对象写入剪贴板**：使用 `clipboard-polyfill` 库的 `write` 方法将 Blob 对象写入剪贴板。

:::warning
只在HTTPS环境下生效，HTTP环境下粘贴的内容为空
:::

### 复制canvas
以下是一个完整的示例：

```javascript
<template>
  <div>
    <canvas ref="qrcodeCanvas"></canvas>
    <button @click="copyQRCode">Copy QR Code</button>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import * as clipboard from 'clipboard-polyfill';

export default {
  mounted() {
    this.generateQRCode();
  },
  methods: {
    generateQRCode() {
      const canvas = this.$refs.qrcodeCanvas;
      QRCode.toCanvas(canvas, 'Your QR Code Data', function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
      });
    },
    async copyQRCode() {
      try {
        const canvas = this.$refs.qrcodeCanvas;
        canvas.toBlob(async (blob) => {
          if (blob) {
            await clipboard.write([new clipboard.ClipboardItem({ [blob.type]: blob })]);
            alert('QR Code copied to clipboard!');
          } else {
            console.error('Failed to convert canvas to Blob');
          }
        });
      } catch (error) {
        console.error('Failed to copy QR Code: ', error);
      }
    }
  }
};
</script>
```

1. **生成二维码**：在 `mounted` 钩子中调用 `generateQRCode` 方法，使用 `qrcode` 库生成二维码并绘制到 `<canvas>` 元素上。
2. **复制二维码**：在 `copyQRCode` 方法中，将 `<canvas>` 元素转换为 Blob 对象，并使用 `clipboard-polyfill` 库将 Blob 对象写入剪贴板。

:::warning
只在HTTPS环境下生效，HTTP环境下粘贴的内容为空
:::

### 复制多个内容
比如同时复制图片和文本，可以将不同类型的内容（如图像和文本）组合在一起。以下是一个示例，展示如何将二维码图像和文本同时写入剪贴板：

```javascript
<template>
  <div>
    <canvas ref="qrcodeCanvas"></canvas>
    <button @click="handleCopy">Copy QR Code and Text</button>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import * as clipboard from 'clipboard-polyfill';

export default {
  data() {
    return {
      qrcodeUrl: 'https://example.com' // 你想要复制的文本内容
    };
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    generateQRCode() {
      const canvas = this.$refs.qrcodeCanvas;
      QRCode.toCanvas(canvas, this.qrcodeUrl, function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
      });
    },
    handleCopy() {
      try {
        const canvas = this.$refs.qrcodeCanvas;
        canvas.toBlob(async (blob) => {
          if (blob) {
            const clipboardItems = [
              new clipboard.ClipboardItem({ [blob.type]: blob }),
              new clipboard.ClipboardItem({ 'text/plain': new Blob([this.qrcodeUrl], { type: 'text/plain' }) })
            ];
            await clipboard.write(clipboardItems);
            alert('QR Code and text copied to clipboard!');
          } else {
            console.error('Failed to convert canvas to Blob');
          }
        });
      } catch (error) {
        console.error('Failed to copy QR Code: ', error);
      }
    }
  }
};
</script>
```

1. **生成二维码**：在 `mounted` 钩子中调用 `generateQRCode` 方法，使用 `qrcode` 库生成二维码并绘制到 `<canvas>` 元素上。
2. **复制二维码和文本**：在 `handleCopy` 方法中，将 `<canvas>` 元素转换为 Blob 对象，并将其与文本内容一起写入剪贴板。

:::warning
粘贴后发现始终只能粘贴一项，虽然可以将多个内容作为不同的 MIME 类型添加到剪贴板中，但是剪贴板 API 并不支持将不同类型的内容（如图像和文本）同时粘贴到目标应用程序中。大多数应用程序（如文本编辑器、浏览器等）只能处理一种类型的剪贴板内容。
:::

不过，可以通过以下方法来实现类似的效果：将图像和文本组合成一个 HTML 片段，然后将其作为 HTML 内容复制到剪贴板中。这样，当你粘贴时，支持 HTML 粘贴的应用程序（如富文本编辑器）将能够同时显示图像和文本。
```js
<template>
  <div>
    <canvas ref="qrcodeCanvas"></canvas>
    <button @click="handleCopy">Copy QR Code and Text</button>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import * as clipboard from 'clipboard-polyfill';

export default {
  data() {
    return {
      qrcodeUrl: 'https://example.com' // 你想要复制的文本内容
    };
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    generateQRCode() {
      const canvas = this.$refs.qrcodeCanvas;
      QRCode.toCanvas(canvas, this.qrcodeUrl, function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
      });
    },
    async handleCopy() {
      try {
        const canvas = this.$refs.qrcodeCanvas;
        const textContent = this.qrcodeUrl;
        
        // 将 canvas 转换为 Data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        
        // 创建 HTML 片段
        const htmlContent = `
          <div>
            <img src="${imageDataUrl}" alt="QR Code">
            <p>${textContent}</p>
          </div>
        `;
        
        // 创建 ClipboardItem 对象
        const clipboardItem = new clipboard.ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' })
        });
        
        // 写入剪贴板
        await clipboard.write([clipboardItem]);
        alert('QR Code and text copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy QR Code: ', error);
      }
    }
  }
};
</script>
```

1. **生成二维码**：在 `mounted` 钩子中调用 `generateQRCode` 方法，使用 `qrcode` 库生成二维码并绘制到 `<canvas>` 元素上。
2. **将 canvas 转换为 Data URL**：使用 `canvas.toDataURL` 方法将 `<canvas>` 元素转换为 Data URL。
3. **创建 HTML 片段**：将图像 Data URL 和文本内容组合成一个 HTML 片段。
4. **创建 `ClipboardItem` 对象**：将 HTML 片段和纯文本内容包装在 `ClipboardItem` 对象中。
5. **写入剪贴板**：使用 `clipboard-polyfill` 库的 `write` 方法将 `ClipboardItem` 对象写入剪贴板。

:::tip
这种方式在HTTPS和HTTP环境下都生效。
::

## 文件下载
### 使用`<a>`配合`download`属性实现文件下载

例1，使用`<a>`标签的`download`属性来实现图片下载
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Image</title>
</head>
<body>
    <img id="image" src="https://example.com/image.jpg" alt="Example Image" style="display:none;">
    <a id="downloadLink" href="#" download="image.jpg">Download Image</a>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var image = document.getElementById('image');
            var downloadLink = document.getElementById('downloadLink');
            
            // 设置下载链接的href为图片的src
            downloadLink.href = image.src;
        });
    </script>
</body>
</html>
```

例2，JS创建一个隐藏的`<a>`标签，设置其`href`属性为文件的URL，并设置`download`属性为文件的默认名称。然后，模拟点击这个链接以触发下载，最后移除这个隐藏的链接。
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件下载示例</title>
</head>
<body>
    <button id="downloadBtn">下载文件</button>

    <script>
        document.getElementById('downloadBtn').addEventListener('click', function() {
            // 文件的URL
            var fileUrl = 'https://example.com/path/to/your/file.pdf';
            // 创建一个隐藏的a标签
            var a = document.createElement('a');
            a.href = fileUrl;
            a.download = 'file.pdf'; // 设置下载文件的默认名称
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    </script>
</body>
</html>
```

例3，如果你需要下载的是动态生成的文件（例如，生成的文本或图像），可以使用Blob对象：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件下载示例</title>
</head>
<body>
    <button id="downloadBtn">下载文件</button>

    <script>
        document.getElementById('downloadBtn').addEventListener('click', function() {
            // 动态生成的文件内容
            var fileContent = '这是一个示例文件的内容';
            var blob = new Blob([fileContent], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);

            // 创建一个隐藏的a标签
            var a = document.createElement('a');
            a.href = url;
            a.download = 'example.txt'; // 设置下载文件的默认名称
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 释放URL对象
            URL.revokeObjectURL(url);
        });
    </script>
</body>
</html>
```

:::tip
某些浏览器可能会对跨域下载有安全限制，确保文件URL与页面URL在同一个域名下，或者服务器配置了正确的CORS头。
:::

例4，使用Canvas绘制图片并下载(适用于需要对图片进行处理或修改的情况)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Image</title>
</head>
<body>
    <canvas id="canvas" style="display:none;"></canvas>
    <a id="downloadLink" href="#" download="image.jpg">Download Image</a>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var downloadLink = document.getElementById('downloadLink');
            var image = new Image();
            image.crossOrigin = 'Anonymous'; // 处理跨域问题
            image.src = 'https://example.com/image.jpg';

            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                
                // 将Canvas内容转换为Data URL
                var dataURL = canvas.toDataURL('image/jpeg');
                
                // 设置下载链接的href为Data URL
                downloadLink.href = dataURL;
            };
        });
    </script>
</body>
</html>
```

### 使用[`file-saver`](https://github.com/eligrey/FileSaver.js)
安装：
```bash
npm install file-saver --save
npm install @types/file-saver --save-dev
```

使用：
```js
import { saveAs } from 'file-saver';

// Saving text
var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
FileSaver.saveAs(blob, "hello world.txt");

// Saving URLs
FileSaver.saveAs("https://httpbin.org/image", "image.jpg");
```

## [微信网页开发JS SDK](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)
### 微信分享给朋友自定义分享内容
在微信分享给朋友的内容中，图片的大小是由微信自动调整的，开发者无法直接控制图片的显示大小。但是，开发者可以通过优化图片的尺寸和比例来确保在微信中显示效果良好。以下是一些建议和步骤，帮助你设置分享内容中的图片：

1. 图片尺寸建议

   微信对分享图片有一定的推荐尺寸和比例，以下是一些常见的建议：

   - **缩略图尺寸**：建议使用 300x300 像素或 5:4 比例的图片。
   - **图片格式**：推荐使用 JPEG 或 PNG 格式。
   - **文件大小**：尽量保持图片文件大小在 300KB 以内，以确保加载速度和显示效果。

2. 使用微信分享接口

   在微信的开发接口中，通过 `wx.updateAppMessageShareData` 或 `wx.onMenuShareAppMessage` 方法可以设置分享给朋友的内容，包括标题、描述、链接和缩略图。以下是一个示例：

   ```javascript
   wx.ready(function () {
       wx.updateAppMessageShareData({ 
           title: '分享标题', // 分享标题
           desc: '分享描述', // 分享描述
           link: 'https://example.com', // 分享链接
           imgUrl: 'https://example.com/image.jpg', // 分享图标
           success: function () {
               // 设置成功
           }
       });
   });
   ```

3. 图片优化建议

   - **保持图片清晰度**：确保图片在 300x300 像素下仍然清晰可见。
   - **避免过多文字**：图片中的文字应简洁明了，避免过多的文字内容。
   - **使用高对比度**：确保图片中的主要元素与背景有足够的对比度，以便在缩略图中仍然清晰可辨。

以下是一个完整的示例，展示如何通过微信 JavaScript SDK 设置分享内容：

```html
<!DOCTYPE html>
<html>
<head>
    <title>微信分享示例</title>
    <script src="https://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
    <script>
        // 微信配置
        wx.config({
            debug: false,
            appId: 'your_app_id',
            timestamp: 'timestamp',
            nonceStr: 'nonceStr',
            signature: 'signature',
            jsApiList: [
                'updateAppMessageShareData',
                'onMenuShareAppMessage'
            ]
        });

        wx.ready(function () {
            // 设置分享内容
            wx.updateAppMessageShareData({ 
                title: '分享标题', 
                desc: '分享描述', 
                link: 'https://example.com', 
                imgUrl: 'https://example.com/image.jpg', 
                success: function () {
                    // 设置成功
                }
            });
        });
    </script>
</head>
<body>
    <h1>微信分享示例</h1>
</body>
</html>
```

:::tip
1. 分享链接的域名必须已经在微信公众平台的“JS接口安全域名”设置中进行过验证和配置。进入“设置” -> “公众号设置” -> “功能设置” -> 在“JS接口安全域名”一栏，添加你的域名并进行验证。

2. 你在调用 `wx.updateAppMessageShareData` 时，传递的 `link` 参数的域名必须与当前页面的域名一致。例如，如果你的页面在 `https://example.com/page`，那么分享链接的域名也必须是 `example.com`。
:::

## 使用lodash
为了减少包的体积并仅安装你需要的 `lodash` 函数，你可以使用 `lodash-es` 或者直接从 `lodash` 库中按需导入特定的函数。以下是如何安装和使用最小的 `lodash` 包的详细说明。

### 方法一：使用 `lodash-es`

`lodash-es` 是 `lodash` 的 ES 模块版本，支持按需导入，可以更好地与现代打包工具（如 Vite、Webpack）配合使用。

1. **安装 `lodash-es`**：

```bash
npm install lodash-es
npm install --save-dev @types/lodash-es
```

2. **按需导入 `debounce` 函数**：

```javascript
import debounce from 'lodash-es/debounce';
```

### 方法二：按需导入 `lodash` 函数

你也可以直接从 `lodash` 库中按需导入特定的函数，这样可以确保只打包你需要的部分。

1. **安装 `lodash`**：

```bash
npm install lodash
```

2. **按需导入 `debounce` 函数**：

```javascript
import debounce from 'lodash/debounce';
```

以下是一个示例，展示如何在 React 组件中使用按需导入的 `debounce` 函数。

```jsx
import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash-es/debounce'; // 或者使用 'lodash/debounce'

const SearchComponent = () => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(
    debounce((value) => {
      console.log('Searching for:', value);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchComponent;
```

详细说明:

1. **安装 `lodash-es` 或 `lodash`**：
   - 使用 `npm install lodash-es` 安装 `lodash-es`，或者使用 `npm install lodash` 安装 `lodash`。

2. **按需导入 `debounce` 函数**：
   - 使用 `import debounce from 'lodash-es/debounce';` 从 `lodash-es` 导入 `debounce` 函数，或者使用 `import debounce from 'lodash/debounce';` 从 `lodash` 导入 `debounce` 函数。

3. **在 React 组件中使用 `debounce`**：
   - 使用 `useState` 钩子来管理输入框的状态。
   - 使用 `useCallback` 钩子来定义一个被 `debounce` 的函数 `handleSearch`。`debounce` 函数接受两个参数：要被限制执行频率的函数和时间间隔（以毫秒为单位）。
   - 在 `handleChange` 函数中，更新输入框的状态，并调用被 `debounce` 的 `handleSearch` 函数。
   - 使用 `useEffect` 钩子在组件卸载时清理 `debounce` 函数。

通过这种方式，你可以确保只打包和使用 `lodash` 中你需要的部分，从而减少包的体积。

## 拖拽
[`react-draggable`](https://github.com/react-grid-layout/react-draggable)

### 拖拽排序
以下是 `react-beautiful-dnd`、`react-dnd`、`react-sortable-hoc` 和 `dnd-kit` 这几个库的对比：

#### 1. [`react-beautiful-dnd`](https://github.com/atlassian/react-beautiful-dnd)
33.6k 官方声明2025-4-30弃用改组件库，推荐使用dnd-kit

**优点**：
- **易用性**：API 设计简洁，易于上手。
- **用户体验**：提供了良好的拖拽动画和用户体验。
- **文档**：文档详细，示例丰富。

**缺点**：
- **灵活性**：对于一些复杂的拖拽需求，可能不够灵活。
- **性能**：在处理大量元素时，性能可能会有所下降。

**适用场景**：
- 适用于大多数常见的拖拽排序需求，特别是列表和网格布局。

#### 2. [`react-dnd`](https://github.com/react-dnd/react-dnd)
21.2k

**优点**：
- **灵活性**：基于 HTML5 拖放 API，适用于复杂的拖放需求。
- **可扩展性**：可以处理多种拖放场景，不仅限于排序。

**缺点**：
- **学习曲线**：API 相对复杂，需要更多的学习和配置。
- **文档**：文档较为详细，但示例相对较少。

**适用场景**：
- 适用于需要高度自定义和复杂拖放交互的应用，如看板、树形结构等。

#### 3. [`react-sortable-hoc`](https://github.com/clauderic/react-sortable-hoc)
10.8k 官方声明该库不再被积极维护。所有开发工作均已转向`@dnd-kit`。它提供功能奇偶性，采用现代且可扩展的架构构建，支持复杂的用例并具有内置的辅助功能。强烈鼓励新消费者采用`@dnd-kit`，而不是采用`react-sortable-hoc`。



**优点**：
- **易用性**：API 设计简洁，易于上手。
- **性能**：性能较好，适用于处理大量元素。

**缺点**：
- **灵活性**：功能相对单一，主要用于拖拽排序，不适用于复杂的拖放需求。
- **维护**：库的维护频率较低，可能存在一些未解决的问题。

**适用场景**：
- 适用于简单的拖拽排序需求，如列表和网格布局。

#### 4. [`dnd-kit`](https://github.com/clauderic/dnd-kit)
13.6k `npm install @dnd-kit/core`

Dnd Kit 的核心是三个主要的组件：DndContext、Draggable 和 Droppable。

DndContext：作为父组件，管理拖放操作的上下文环境。
Draggable：表示可以拖动的元素。
Droppable：表示可以放置拖动元素的目标区域。


**优点**：
- **现代化**：基于现代化的设计，提供了灵活的 API 和良好的性能。
- **灵活性**：可以处理多种拖放场景，支持复杂的交互。
- **性能**：性能优异，适用于处理大量元素。

**缺点**：
- **学习曲线**：API 相对复杂，需要更多的学习和配置。
- **文档**：文档较为详细，但示例相对较少。

**适用场景**：
- 适用于需要高度自定义和复杂拖放交互的应用，如看板、树形结构等。

示例：以下是一个使用 `dnd-kit` 实现拖拽排序的示例。这个示例展示了如何使用 `dnd-kit` 库来创建一个简单的拖拽排序列表。

首先，安装 `dnd-kit`：

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers
```

然后，创建一个组件来实现拖拽排序：

```jsx
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    margin: '4px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

const DragAndDrop = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDrop;
```

代码解释：

1. **安装依赖**：
   安装 `@dnd-kit/core`、`@dnd-kit/sortable` 和 `@dnd-kit/modifiers` 这三个包。

2. **SortableItem 组件**：
   - 使用 `useSortable` 钩子来使每个项目可拖拽。
   - 设置拖拽元素的样式，包括 `transform` 和 `transition`。

3. **DragAndDrop 组件**：
   - 使用 `useState` 钩子来管理项目列表的状态。
   - 使用 `useSensors` 和 `useSensor` 来配置传感器，这里使用 `PointerSensor` 来处理拖拽事件。
   - 在 `DndContext` 中配置 `collisionDetection` 和 `onDragEnd` 回调函数。
   - 使用 `SortableContext` 包裹可拖拽的项目，并设置排序策略为 `verticalListSortingStrategy`。

4. **handleDragEnd 函数**：
   - 在拖拽结束时，更新项目列表的顺序。

这个示例展示了如何使用 `dnd-kit` 来实现一个简单的拖拽排序列表。你可以根据需要进一步自定义和扩展这个示例。


`activationConstraint` 是 `dnd-kit` 中用于配置拖拽激活条件的一个选项。它允许你设置一些约束条件，只有在满足这些条件时，拖拽操作才会被激活。这样可以避免误触发拖拽操作，提高用户体验。

在 `dnd-kit` 中，`activationConstraint` 可以配置在传感器（如 `PointerSensor`）中。以下是一个示例，展示了如何使用 `activationConstraint` 来设置拖拽激活的距离约束

**`activationConstraint: { distance: 10 }`** 的含义是：

- **distance**：设置拖拽激活的距离约束。只有当用户拖动的距离超过 10 像素时，拖拽操作才会被激活。

除了 `distance` 之外，`activationConstraint` 还可以配置其他类型的约束条件，例如时间约束：

```jsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      delay: 250, // 250 毫秒
      tolerance: 5, // 5 像素
    },
  })
);
```

- **delay**：设置拖拽激活的时间延迟。只有当用户按住元素超过 250 毫秒时，拖拽操作才会被激活。
- **tolerance**：设置拖拽激活的容差距离。在延迟时间内，用户可以在 5 像素范围内移动而不会取消拖拽激活。

通过配置 `activationConstraint`，你可以更精确地控制拖拽操作的激活条件，从而提高用户体验，避免误操作。


## 平滑滚动

简单滑动使用`window.scrollTo`:
```js
// 滑动到顶部
window.scrollTo({
  top: 0,
  behavior: 'smooth' // 平滑滚动
});
```

如果你正在寻找类似 `react-scroll` 的库来实现滚动定位功能，以下是一些常用的库和工具，它们可以帮助你在 React 应用中实现平滑滚动和滚动定位功能：

### 1. `react-scroll`

`react-scroll` 是一个非常流行的库，用于在 React 应用中实现平滑滚动和滚动定位功能。4.4k star

安装：
```bash
npm install react-scroll
npm install -D @types/react-scroll
```

示例：

```jsx
import React from 'react';
import { Link, Element, animateScroll as scroll } from 'react-scroll';

const ScrollExample = () => {
  return (
    <div>
      <button onClick={() => scroll.scrollTo(100)}>Scroll to Position 100</button>
      <Link to="item5" smooth={true} duration={500}>
        Scroll to Item 5
      </Link>
      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}>
        <ul>
          {Array.from({ length: 20 }, (_, index) => (
            <Element name={`item${index + 1}`} key={index}>
              <li>Item {index + 1}</li>
            </Element>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScrollExample;
```

#### 遇到的问题
根据如下官方示例可以实现预期效果：
```jsx
import React from 'react';
import { Link, Element } from 'react-scroll';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="section1" smooth={true} duration={500}>Section 1</Link>
          </li>
          <li>
            <Link to="section2" smooth={true} duration={500}>Section 2</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <Element name="section1">
        <section style={{ height: '100vh', backgroundColor: 'lightblue' }}>
          <h1>Section 1</h1>
          <p>This is the content of section 1</p>
        </section>
      </Element>
      <Element name="section2">
        <section style={{ height: '100vh', backgroundColor: 'lightgreen' }}>
          <h1>Section 2</h1>
          <p>This is the content of section 2</p>
        </section>
      </Element>
      {/* Add more sections with Element components as needed */}
    </div>
  );
}

export default App;
```

但是，当把父元素高度固定为`200px`并设置可滚动，`section`高度设为`100px`后，点击`Link`或手动触发滚动都不能生效。解决方案：手动指定父元素为可滚动区域。
```js
import { Link, Element, scroller } from "react-scroll";

export default function Demo() {
  const scrollToSection = () => {
    scroller.scrollTo('section1', {
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: 50,
      containerId: 'parent-container' // 指定滚动容器的ID，这个很重要
    });
  };
  return (
    <div style={{height:'200px', overflow:'auto'}} id="parent-container">
      <button onClick={scrollToSection}>Scroll to Section 1</button>
      {/* <nav>
        <ul>
          <li>
            <Link to="section1" smooth={true} duration={500}>Section 1</Link>
          </li>
          <li>
            <Link to="section2" smooth={true} duration={500}>Section 2</Link>
          </li>
        </ul>
      </nav> */}
      <Element name="section1">
        <section style={{ height: '100px', backgroundColor: 'lightblue' }}>
          <h1>Section 1</h1>
          <p>This is the content of section 1</p>
        </section>
      </Element>
      <Element name="section2">
        <section style={{ height: '100px', backgroundColor: 'lightgreen' }}>
          <h1>Section 2</h1>
          <p>This is the content of section 2</p>
        </section>
      </Element>
      {/* Add more sections with Element components as needed */}
    </div>
  )
}
```

### 2. `react-scroll-to-component`

`react-scroll-to-component` 是另一个用于在 React 应用中实现平滑滚动的库。168 star

安装：

```bash
npm install react-scroll-to-component
```

示例：

```jsx
import React, { useRef } from 'react';
import scrollToComponent from 'react-scroll-to-component';

const ScrollToComponentExample = () => {
  const sectionRef = useRef(null);

  return (
    <div>
      <button onClick={() => scrollToComponent(sectionRef.current, { offset: 0, align: 'top', duration: 500 })}>
        Scroll to Section
      </button>
      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}>
        <div ref={sectionRef} style={{ height: '1000px' }}>
          <h2>Section</h2>
        </div>
      </div>
    </div>
  );
};

export default ScrollToComponentExample;
```

### 3. `react-router-hash-link`

`react-router-hash-link` 是一个用于在 React Router 中实现平滑滚动的库。735 star

安装：

```bash
npm install react-router-hash-link
```

示例：

```jsx
import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const HashLinkExample = () => {
  return (
    <div>
      <Link smooth to="#section1">Scroll to Section 1</Link>
      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}>
        <div id="section1" style={{ height: '1000px' }}>
          <h2>Section 1</h2>
        </div>
      </div>
    </div>
  );
};

export default HashLinkExample;
```

### 4. `react-scrollspy`

`react-scrollspy` 是一个用于在滚动时高亮导航链接的库。不再主动维护，请改用`@makotot/ghostui`。61 star

安装：

```bash
npm install react-scrollspy
```

示例：

```jsx
import React from 'react';
import Scrollspy from 'react-scrollspy';

const ScrollSpyExample = () => {
  return (
    <div>
      <Scrollspy items={['section1', 'section2']} currentClassName="is-current">
        <li><a href="#section1">Section 1</a></li>
        <li><a href="#section2">Section 2</a></li>
      </Scrollspy>
      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}>
        <div id="section1" style={{ height: '1000px' }}>
          <h2>Section 1</h2>
        </div>
        <div id="section2" style={{ height: '1000px' }}>
          <h2>Section 2</h2>
        </div>
      </div>
    </div>
  );
};

export default ScrollSpyExample;
```

### 5. `react-scroll-into-view`

`react-scroll-into-view` 是一个用于在 React 应用中实现平滑滚动的库。52 star

安装：

```bash
npm install react-scroll-into-view
```

示例：

```jsx
import React from 'react';
import ScrollIntoView from 'react-scroll-into-view';

const ScrollIntoViewExample = () => {
  return (
    <div>
      <ScrollIntoView selector="#section1">
        <button>Scroll to Section 1</button>
      </ScrollIntoView>
      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}>
        <div id="section1" style={{ height: '1000px' }}>
          <h2>Section 1</h2>
        </div>
      </div>
    </div>
  );
};

export default ScrollIntoViewExample;
```

## 轮询
### 在 Vue.js 项目中使用 Axios 进行轮询
在 Vue.js 项目中使用 Axios 进行轮询是一种常见的需求，特别是当你需要定期从服务器获取最新数据时。以下是一个使用 Axios 进行轮询的示例：

```vue
<template>
  <div>
    <h1>Data Polling Example</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-if="data">
      <li v-for="item in data" :key="item.id">{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      data: null,
      loading: false,
      error: null,
      pollingInterval: null
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('https://api.example.com/data');
        this.data = response.data;
      } catch (err) {
        this.error = 'Error fetching data: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    startPolling() {
      this.fetchData(); // 立即执行一次
      this.pollingInterval = setInterval(() => {
        this.fetchData();
      }, 5000); // 每5秒轮询一次
    },
    stopPolling() {
      clearInterval(this.pollingInterval);
    }
  },
  mounted() {
    this.startPolling();
  },
  beforeDestroy() {
    this.stopPolling();
  }
};
</script>
```

这个示例实现了以下功能：

1. `fetchData` 方法使用 Axios 发送 GET 请求到指定 URL。

2. `startPolling` 方法启动轮询：
   - 立即调用一次 `fetchData`。
   - 使用 `setInterval` 每 5 秒调用一次 `fetchData`。

3. `stopPolling` 方法用于停止轮询，清除 `setInterval`。

4. 在组件挂载时（`mounted` 钩子）启动轮询。

5. 在组件销毁前（`beforeDestroy` 钩子）停止轮询，以防止内存泄漏。

注意事项：

- 调整轮询间隔（示例中为 5000 毫秒）以适应你的需求。
- 考虑添加错误处理逻辑，例如在连续失败多次后暂停轮询。
- 如果你的应用需要在后台持续轮询，考虑使用 Web Workers 或服务端推送技术（如 WebSockets）。
- 确保你的服务器能够处理频繁的请求，并考虑实现节流或限速机制。

这种轮询方法适用于需要定期更新数据的场景，但要注意不要设置过于频繁的轮询间隔，以免对服务器造成不必要的负担。