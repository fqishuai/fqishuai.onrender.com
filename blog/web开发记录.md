---
slug: web
tags: [web, 记录]
---

## 文件上传
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