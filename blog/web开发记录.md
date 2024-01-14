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

## elementui使用记录
### 1. el-radio切换不了
- 查看选中的值有没有变
- 选中的值变了，但是显示的没变，可以在change事件中强更新
```js
handleChange() {
  this.$forceUpdate();
}
```

### 2. el-form校验不通过
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