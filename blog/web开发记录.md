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
### 1. `form`和`select`结合使用，设置`select`的`value`不生效
被设置了 `name` 属性的 `Form.Item` 包装的控件，表单控件会自动添加 `value`（或 `valuePropName` 指定的其他属性） `onChange`（或 `trigger` 指定的其他属性），数据同步将被 `Form` 接管，这会导致以下结果：

- 你不再需要也不应该用 `onChange` 来做数据收集同步（你可以使用 `Form` 的 `onValuesChange`），但还是可以继续监听 `onChange` 事件。

- 你不能用控件的 `value` 或 `defaultValue` 等属性来设置表单域的值，默认值可以用 `Form` 里的 `initialValues` 来设置。注意 `initialValues` 不能被 `setState` 动态更新，你需要用 `setFieldsValue` 来更新。

- 你不应该用 `setState`，可以使用 `form.setFieldsValue` 来动态改变表单值。
  ```js
  form.setFieldsValue({
    字段名: 值,
  })
  ```

### 2. 表单最后一行右对齐适配电脑分辨率
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

### 3. 组件的方法自定义传参
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

### 4. `Table`组件的数据源需要有`key`这个属性
否则虽然不影响使用但是控制台报错提示
```js
const resultWithKey = res.result.reduce((acc: any[],cur: { key: number; },ind:number) => {
  cur.key = ind;
  acc.push(cur);
  return acc;
}, []);
setTableDatas(resultWithKey); // Table的数据源需要有key prop，否则不影响使用但控制台会报错提示
```

### 5. `Table`组件列特别多时，设置列宽不生效
注意设置 `scroll={{ x: '4000px' }}` 这个`x`的宽度首先要能够容纳所有设置的列宽之和('4000px'只是举例)，这样在这个总的宽度之内去设置列宽，才能生效。

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