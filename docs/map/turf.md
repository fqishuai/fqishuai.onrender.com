[Turf](https://turfjs.org/) 是一个用于空间分析的 JavaScript 库。它包括传统的空间操作、用于创建 GeoJSON 数据的辅助函数以及数据分类和统计工具。 Turf 可以作为客户端插件添加到您的网站，也可以使用 Node.js 运行 Turf 服务器端。

安装：
```bash
# get all of turf
npm install @turf/turf

# or get individual packages
npm install @turf/helpers
npm install @turf/buffer
```

## 自动合并重叠的多边形(`union`)
在使用 Leaflet 和 Leaflet-Geoman 插件时，如果你希望在绘制多边形时自动处理压盖（即自动合并重叠的多边形），你需要编写一些自定义逻辑来实现这一功能。Leaflet-Geoman 本身并不直接支持这种功能，但你可以利用 GeoJSON 和 Turf.js 等库来实现。

以下是一个示例，展示如何使用 Turf.js 来合并重叠的多边形：

1. **安装 Turf.js**:
   首先，你需要安装 Turf.js 库。你可以使用 npm 或 yarn 来安装：

   ```bash
   npm install @turf/turf
   ```

2. **初始化 Leaflet 和 Leaflet-Geoman**:
   初始化地图和 Leaflet-Geoman 插件，并设置绘制事件的监听器。

3. **使用 Turf.js 合并多边形**:
   在绘制完成后，使用 Turf.js 的 `union` 方法来合并重叠的多边形。

以下是一个完整的示例代码：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet-Geoman Polygon Union</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.css" />
  <style>
    #map {
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.min.js"></script>
  <script src="https://unpkg.com/@turf/turf"></script>
  <script>
    // 初始化地图
    const map = L.map('map').setView([51.505, -0.09], 13);

    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 启用 Leaflet-Geoman
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // 存储所有绘制的多边形
    let polygons = [];

    // 监听绘制完成事件
    map.on('pm:create', (e) => {
      const layer = e.layer;
      polygons.push(layer);

      // 合并所有多边形
      const mergedPolygon = mergePolygons(polygons);

      // 清除地图上的所有多边形
      polygons.forEach(polygon => map.removeLayer(polygon));

      // 添加合并后的多边形到地图
      const mergedLayer = L.geoJSON(mergedPolygon).addTo(map);
      polygons = [mergedLayer];
    });

    // 使用 Turf.js 合并多边形
    function mergePolygons(layers) {
      const features = layers.map(layer => layer.toGeoJSON());
      let merged = features[0];

      for (let i = 1; i < features.length; i++) {
        merged = turf.union(merged, features[i]);
      }

      return merged;
    }
  </script>
</body>
</html>
```

在这个示例中，我们：

1. 初始化了一个 Leaflet 地图，并添加了 OpenStreetMap 图层。
2. 启用了 Leaflet-Geoman 插件，并配置了绘制多边形的控件。
3. 监听 `pm:create` 事件，当用户绘制完成一个多边形时，将其添加到 `polygons` 数组中。
4. 使用 Turf.js 的 `union` 方法合并所有多边形，并将合并后的多边形添加到地图上。

这样，当用户绘制多个重叠的多边形时，它们会自动合并为一个多边形。

:::tip
当使用 `turf.union` 合并两个没有重叠的多边形时，`turf.union` 会返回一个包含两个独立多边形的 `MultiPolygon`。这意味着两个多边形会被组合成一个 GeoJSON 对象，但它们仍然保持各自的形状和位置。
:::

### Geoman绘制的多边形进行组合
使用 GeoMan（Leaflet-Geoman）绘制的多边形进行组合可以通过 `turf.union` 函数来实现。`turf.union` 可以将两个或多个多边形合并成一个多边形。以下是一个详细的示例，展示了如何使用 GeoMan 绘制多边形并将它们组合在一起。

确保你已经在项目中引入了 Leaflet 和 GeoMan，并进行基本的地图设置。

```html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet GeoMan Example</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet-geoman-free/dist/leaflet-geoman.css" />
  <style>
    #map {
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-geoman-free/dist/leaflet-geoman.min.js"></script>
  <script src="https://unpkg.com/@turf/turf/turf.min.js"></script>
  <script>
    // 初始化地图
    const map = L.map('map').setView([51.505, -0.09], 13);

    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 启用 GeoMan
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // 存储绘制的多边形
    const polygons = [];

    // 监听绘制完成事件
    map.on('pm:create', e => {
      const layer = e.layer;
      polygons.push(layer);
    });

    // 合并多边形
    function combinePolygons() {
      if (polygons.length < 2) {
        alert('请绘制至少两个多边形进行组合');
        return;
      }

      // 获取所有多边形的 GeoJSON
      const geojsons = polygons.map(polygon => polygon.toGeoJSON());

      // 使用 turf.union 合并多边形
      let combined = geojsons[0];
      for (let i = 1; i < geojsons.length; i++) {
        combined = turf.union(combined, geojsons[i]);
      }

      // 清除地图上的多边形
      polygons.forEach(polygon => map.removeLayer(polygon));
      polygons.length = 0;

      // 添加合并后的多边形到地图
      const combinedLayer = L.geoJSON(combined).addTo(map);
      polygons.push(combinedLayer);
    }

    // 添加按钮进行多边形组合
    const combineButton = L.control({ position: 'topright' });
    combineButton.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      div.innerHTML = 'Combine Polygons';
      div.style.backgroundColor = 'white';
      div.style.padding = '5px';
      div.style.cursor = 'pointer';
      div.onclick = combinePolygons;
      return div;
    };
    combineButton.addTo(map);
  </script>
</body>
</html>
```

1. **初始化地图**：
   - 使用 Leaflet 初始化地图，并设置视图中心和缩放级别。
   - 添加 OpenStreetMap 图层。

2. **启用 GeoMan**：
   - 启用 GeoMan 控件，允许用户绘制、编辑和删除多边形。

3. **存储绘制的多边形**：
   - 监听 `pm:create` 事件，将绘制的多边形存储在 `polygons` 数组中。

4. **合并多边形**：
   - 定义 `combinePolygons` 函数，使用 `turf.union` 合并多边形。
   - 获取所有多边形的 GeoJSON 表示，并使用 `turf.union` 依次合并它们。
   - 清除地图上的原始多边形，并添加合并后的多边形。

5. **添加按钮进行多边形组合**：
   - 创建一个自定义控件按钮，点击按钮时调用 `combinePolygons` 函数。

### 使用时遇到的问题
#### `Error: Unable to complete output ring staring at`
发生这种情况是因为两个多边形的顶点并非 100% 相同，在将它们合并在一起时会产生一个小间隙。只有使多边形的顶点相同后，才可以使用 `turf.union` 方法将它们合并。

解决方案：将所有的顶点保留相同精度的小数([Unable to complete output ring](https://github.com/Turfjs/turf/issues/2048))
```ts
const item = list[2];

// 处理顶点为6位小数
const toFixed = (num: number, precision = 8): number => {
 return Math.trunc(num * Math.pow(10, precision)) / Math.pow(10, precision); // Math.trunc() 方法会将数字的小数部分去掉，只保留整数部分。
}
for (let i = 0; i < item.fenceInfoList.length; i++) {
 const feature = item.fenceInfoList[i].fenceGeoJson;
 // @ts-ignore
 turf.coordEach(feature, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
     logger.info('currentCoord前::', currentCoord)
     currentCoord[0] = toFixed(currentCoord[0]);
     currentCoord[1] = toFixed(currentCoord[1]);
     logger.info('currentCoord后::', currentCoord)
    //  currentCoord[0] = Number(currentCoord[0].toFixed(8));
    //  currentCoord[1] = Number(currentCoord[1].toFixed(8));
   }
 );
}

// 组合
if (item.fenceInfoList.length > 1) {
 let combined = item.fenceInfoList[0].fenceGeoJson;
 for (let j = 1; j < item.fenceInfoList.length; j++) {
   try {
     // @ts-ignore
     combined = turf.union(combined, item.fenceInfoList[j].fenceGeoJson);
   } catch (error) {
     logger.info('union error::', error)
   }
 }
 // @ts-ignore
 item.unionFence = { ...combined, properties: item.fenceInfoList[0].fenceGeoJson.properties };
} else {
 // @ts-ignore
 item.unionFence = item.fenceInfoList[0].fenceGeoJson;
}
```

#### union组合后内部有很多多余的线条
尝试缓冲(`turf.buffer`)少量正数和相同的负数后，线条消失了，但这使得多边形比原来的多边形有更多的点。

## 遍历 GeoJSON 对象中的每个坐标(`coordEach`)
`Turf.js` 的 `coordEach` 函数用于遍历 GeoJSON 对象中的每个坐标。它是一个非常有用的工具，可以让你轻松地对 GeoJSON 数据中的所有坐标进行操作。

`coordEach` 函数的签名如下：

```javascript
turf.coordEach(geojson, callback, excludeWrapCoord)
```

- `geojson`：输入的 GeoJSON 对象。
- `callback`：对每个坐标点执行的回调函数。这个回调函数接受以下参数：
  - `currentCoord`：当前的坐标点（数组形式）。
  - `coordIndex`：当前坐标点的索引。
  - `featureIndex`：当前特征的索引。
  - `multiFeatureIndex`：当前多特征的索引。
  - `geometryIndex`：当前几何体的索引。
- `excludeWrapCoord`（可选）：布尔值，如果为 `true`，则排除多边形的封闭环的重复坐标。

以下是一些使用 `coordEach` 的示例：

1. 遍历并打印所有坐标

   ```javascript
   const turf = require('@turf/turf');

   // 示例 GeoJSON 对象
   const geojson = {
     type: "FeatureCollection",
     features: [
       {
         type: "Feature",
         geometry: {
           type: "Point",
           coordinates: [102.0, 0.5]
         },
         properties: {
           prop0: "value0"
         }
       },
       {
         type: "Feature",
         geometry: {
           type: "LineString",
           coordinates: [
             [102.0, 0.0],
             [103.0, 1.0],
             [104.0, 0.0],
             [105.0, 1.0]
           ]
         },
         properties: {
           prop0: "value0",
           prop1: 0.0
         }
       }
     ]
   };

   // 使用 coordEach 遍历所有坐标
   turf.coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
     console.log('Current Coordinate:', currentCoord);
     console.log('Coordinate Index:', coordIndex);
     console.log('Feature Index:', featureIndex);
     console.log('Multi Feature Index:', multiFeatureIndex);
     console.log('Geometry Index:', geometryIndex);
   });
   ```

2. 修改所有坐标

   ```javascript
   const turf = require('@turf/turf');

   // 示例 GeoJSON 对象
   const geojson = {
     type: "FeatureCollection",
     features: [
       {
         type: "Feature",
         geometry: {
           type: "Point",
           coordinates: [102.0, 0.5]
         },
         properties: {
           prop0: "value0"
         }
       },
       {
         type: "Feature",
         geometry: {
           type: "LineString",
           coordinates: [
             [102.0, 0.0],
             [103.0, 1.0],
             [104.0, 0.0],
             [105.0, 1.0]
           ]
         },
         properties: {
           prop0: "value0",
           prop1: 0.0
         }
       }
     ]
   };

   // 使用 coordEach 修改所有坐标
   turf.coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
     // 将所有坐标的经度加1
     currentCoord[0] += 1;
   });

   console.log(JSON.stringify(geojson, null, 2));
   ```

3. 排除多边形的封闭环的重复坐标

   ```javascript
   const turf = require('@turf/turf');

   // 示例 GeoJSON 对象
   const geojson = {
     type: "Feature",
     geometry: {
       type: "Polygon",
       coordinates: [
         [
           [102.0, 0.0],
           [103.0, 1.0],
           [104.0, 0.0],
           [105.0, 1.0],
           [102.0, 0.0] // 重复的封闭环坐标
         ]
       ]
     },
     properties: {
       prop0: "value0"
     }
   };

   // 使用 coordEach 遍历所有坐标，排除封闭环的重复坐标
   turf.coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
     console.log('Current Coordinate:', currentCoord);
   }, true);
   ```

## 判断多边形是否有重叠(`booleanOverlap`)
在使用 Leaflet 和 Leaflet-Geoman 插件时，如果你需要判断多边形是否有重叠，可以借助 Turf.js 库来实现。Turf.js 提供了丰富的地理空间操作工具，其中包括检测多边形重叠的功能。

以下是一个示例，展示如何使用 Turf.js 来判断多边形是否有重叠：

1. **安装 Turf.js**:
   首先，你需要安装 Turf.js 库。你可以使用 npm 或 yarn 来安装：

   ```bash
   npm install @turf/turf
   ```

2. **初始化 Leaflet 和 Leaflet-Geoman**:
   初始化地图和 Leaflet-Geoman 插件，并设置绘制事件的监听器。

3. **使用 Turf.js 检测多边形重叠**:
   在绘制完成后，使用 Turf.js 的 `booleanOverlap` 方法来检测多边形是否有重叠。

以下是一个完整的示例代码：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet-Geoman Polygon Overlap Detection</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.css" />
  <style>
    #map {
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.min.js"></script>
  <script src="https://unpkg.com/@turf/turf"></script>
  <script>
    // 初始化地图
    const map = L.map('map').setView([51.505, -0.09], 13);

    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 启用 Leaflet-Geoman
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // 存储所有绘制的多边形
    let polygons = [];

    // 监听绘制完成事件
    map.on('pm:create', (e) => {
      const layer = e.layer;
      const newPolygon = layer.toGeoJSON();

      // 检查新绘制的多边形是否与现有多边形重叠
      let hasOverlap = false;
      for (const polygon of polygons) {
        if (turf.booleanOverlap(polygon.toGeoJSON(), newPolygon)) {
          hasOverlap = true;
          break;
        }
      }

      if (hasOverlap) {
        alert('新绘制的多边形与现有多边形重叠！');
        map.removeLayer(layer);
      } else {
        polygons.push(layer);
      }
    });
  </script>
</body>
</html>
```

在这个示例中，我们：

1. 初始化了一个 Leaflet 地图，并添加了 OpenStreetMap 图层。
2. 启用了 Leaflet-Geoman 插件，并配置了绘制多边形的控件。
3. 监听 `pm:create` 事件，当用户绘制完成一个多边形时，将其转换为 GeoJSON 格式。
4. 使用 Turf.js 的 `booleanOverlap` 方法检查新绘制的多边形是否与现有多边形重叠。如果有重叠，弹出提示并移除新绘制的多边形；否则，将新多边形添加到 `polygons` 数组中。

这样，当用户绘制多个重叠的多边形时，会自动检测并提示重叠情况。

## 检测线段与多边形的相交情况(`booleanCrosses`)
为了确保在使用 Leaflet 和 Leaflet-Geoman 插件绘制多边形时，线段不与现有多边形相交，可以使用 Turf.js 库来检测线段与多边形的相交情况，并在检测到相交时阻止新多边形的添加。

以下是一个完整的示例代码，展示如何实现这一功能：

1. **安装 Turf.js**:
   首先，你需要安装 Turf.js 库。你可以使用 npm 或 yarn 来安装：

   ```bash
   npm install @turf/turf
   ```

2. **初始化 Leaflet 和 Leaflet-Geoman**:
   初始化地图和 Leaflet-Geoman 插件，并设置绘制事件的监听器。

3. **使用 Turf.js 检测线段与多边形相交**:
   在绘制完成后，使用 Turf.js 的 `booleanCrosses` 方法来检测线段是否与现有多边形相交。

以下是一个完整的示例代码：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet-Geoman Polygon Line Intersection Detection</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.css" />
  <style>
    #map {
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.min.js"></script>
  <script src="https://unpkg.com/@turf/turf"></script>
  <script>
    // 初始化地图
    const map = L.map('map').setView([51.505, -0.09], 13);

    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 启用 Leaflet-Geoman
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // 存储所有绘制的多边形
    let polygons = [];

    // 监听绘制完成事件
    map.on('pm:create', (e) => {
      const layer = e.layer;
      const newPolygon = layer.toGeoJSON();

      // 检查新绘制的多边形是否与现有多边形相交
      let hasIntersection = false;
      for (const polygon of polygons) {
        if (turf.booleanCrosses(polygon.toGeoJSON(), newPolygon)) {
          hasIntersection = true;
          break;
        }
      }

      if (hasIntersection) {
        alert('新绘制的多边形与现有多边形相交！');
        map.removeLayer(layer);
      } else {
        polygons.push(layer);
      }
    });
  </script>
</body>
</html>
```

在这个示例中，我们：

1. 初始化了一个 Leaflet 地图，并添加了 OpenStreetMap 图层。
2. 启用了 Leaflet-Geoman 插件，并配置了绘制多边形的控件。
3. 监听 `pm:create` 事件，当用户绘制完成一个多边形时，将其转换为 GeoJSON 格式。
4. 使用 Turf.js 的 `booleanCrosses` 方法检查新绘制的多边形是否与现有多边形相交。如果有相交，弹出提示并移除新绘制的多边形；否则，将新多边形添加到 `polygons` 数组中。

这样，当用户绘制多边形时，会自动检测并阻止线段与现有多边形相交的情况。

## 判断点是否在多边形内部(`booleanPointInPolygon`)

## 判断两个几何图形的交集是否为空集(`booleanDisjoint`)

## 判断一个几何图形是否完全包含在另一个几何图形中(`booleanContains`)
`booleanOverlap` 方法在 Turf.js 中用于检测两个几何图形是否部分重叠，但它不会检测一个多边形是否完全包含另一个多边形。要检测一个多边形是否完全包含另一个多边形，可以使用 Turf.js 的 `booleanContains` 方法。

以下是一个示例代码，展示如何在 Leaflet 和 Leaflet-Geoman 中实现这一功能，并确保在绘制多边形时禁止与已有的多边形重叠或包含已有的多边形：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet-Geoman Detect Polygon Overlap and Containment</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.css" />
  <style>
    #map {
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.11.2/dist/leaflet-geoman.min.js"></script>
  <script src="https://unpkg.com/@turf/turf"></script>
  <script>
    // 初始化地图
    const map = L.map('map').setView([51.505, -0.09], 13);

    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 启用 Leaflet-Geoman
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // 存储所有绘制的多边形
    let polygons = [];

    // 监听绘制完成事件
    map.on('pm:create', (e) => {
      const newPolygon = e.layer.toGeoJSON();

      // 检查新绘制的多边形是否与现有多边形重叠或包含
      let hasOverlapOrContainment = false;
      for (const polygon of polygons) {
        const existingPolygon = polygon.toGeoJSON();
        const existingPolygons = existingPolygon.geometry.type === 'MultiPolygon'
          ? existingPolygon.geometry.coordinates.map(coords => turf.polygon(coords))
          : [existingPolygon];

        for (const poly of existingPolygons) {
          if (turf.booleanOverlap(poly, newPolygon) || turf.booleanContains(poly, newPolygon) || turf.booleanContains(newPolygon, poly)) {
            hasOverlapOrContainment = true;
            break;
          }
        }

        if (hasOverlapOrContainment) break;
      }

      if (hasOverlapOrContainment) {
        alert('新绘制的多边形与现有多边形重叠或包含！');
        map.removeLayer(e.layer);
      } else {
        polygons.push(e.layer);
      }
    });

    // 示例：添加一个已有的多边形
    const existingPolygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(map);
    polygons.push(existingPolygon);
  </script>
</body>
</html>
```

解释:
1. **初始化地图**：
   ```javascript
   const map = L.map('map').setView([51.505, -0.09], 13);
   ```

2. **添加 OpenStreetMap 图层**：
   ```javascript
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19
   }).addTo(map);
   ```

3. **启用 Leaflet-Geoman**：
   ```javascript
   map.pm.addControls({
     position: 'topleft',
     drawPolygon: true,
     editMode: true,
     dragMode: true,
     cutPolygon: false,
     removalMode: true
   });
   ```

4. **监听绘制完成事件**：
   ```javascript
   map.on('pm:create', (e) => {
     const newPolygon = e.layer.toGeoJSON();

     // 检查新绘制的多边形是否与现有多边形重叠或包含
     let hasOverlapOrContainment = false;
     for (const polygon of polygons) {
       const existingPolygon = polygon.toGeoJSON();
       const existingPolygons = existingPolygon.geometry.type === 'MultiPolygon'
         ? existingPolygon.geometry.coordinates.map(coords => turf.polygon(coords))
         : [existingPolygon];

       for (const poly of existingPolygons) {
         if (turf.booleanOverlap(poly, newPolygon) || turf.booleanContains(poly, newPolygon) || turf.booleanContains(newPolygon, poly)) {
           hasOverlapOrContainment = true;
           break;
         }
       }

       if (hasOverlapOrContainment) break;
     }

     if (hasOverlapOrContainment) {
       alert('新绘制的多边形与现有多边形重叠或包含！');
       map.removeLayer(e.layer);
     } else {
       polygons.push(e.layer);
     }
   });
   ```

5. **添加一个已有的多边形**：
   ```javascript
   const existingPolygon = L.polygon([
     [51.509, -0.08],
     [51.503, -0.06],
     [51.51, -0.047]
   ]).addTo(map);
   polygons.push(existingPolygon);
   ```

通过这种方式，你可以确保在绘制多边形时，检测新绘制的多边形是否与已有的多边形重叠或包含，并在检测到重叠或包含时阻止新多边形的添加。

### 使用时遇到的问题
`turf.booleanContains` 报错 `feature1 MultiPolygon geometry not supported`

`Turf.js` 的 `booleanContains` 方法在处理 `MultiPolygon` 几何类型时可能会遇到问题。为了处理这种情况，可以将 `MultiPolygon` 拆分为多个 `Polygon`，然后逐个进行包含检查。

以下是一个示例代码，展示如何在 Node.js 环境中处理 `MultiPolygon`，并判断其是否包含另一个几何图形：

```javascript
const turf = require('@turf/turf');
const { wktToGeoJSON } = require('@terraformer/wkt');

// 示例 WKT MultiPolygon
const wktMultiPolygon = 'MULTIPOLYGON (((-73.9580 40.8003, -73.9498 40.7968, -73.9737 40.7648, -73.9814 40.7681, -73.9580 40.8003)), ((-73.9580 40.8003, -73.9498 40.7968, -73.9737 40.7648, -73.9814 40.7681, -73.9580 40.8003)))';

// 将 WKT 转换为 GeoJSON
const multiPolygonGeoJSON = wktToGeoJSON(wktMultiPolygon);

// 示例点（GeoJSON 格式）
const point = turf.point([-73.96, 40.78]);

// 判断 MultiPolygon 是否包含该点
let isContained = false;
if (multiPolygonGeoJSON.geometry.type === 'MultiPolygon') {
  for (const coords of multiPolygonGeoJSON.geometry.coordinates) {
    const polygon = turf.polygon(coords);
    if (turf.booleanContains(polygon, point)) {
      isContained = true;
      break;
    }
  }
} else {
  isContained = turf.booleanContains(multiPolygonGeoJSON, point);
}

console.log(`MultiPolygon 是否包含该点: ${isContained}`);
```

解释：
1. **安装依赖**：
   ```bash
   npm install @turf/turf @terraformer/wkt
   ```

2. **导入依赖**：
   ```javascript
   const turf = require('@turf/turf');
   const { wktToGeoJSON } = require('@terraformer/wkt');
   ```

3. **示例 WKT MultiPolygon**：
   ```javascript
   const wktMultiPolygon = 'MULTIPOLYGON (((-73.9580 40.8003, -73.9498 40.7968, -73.9737 40.7648, -73.9814 40.7681, -73.9580 40.8003)), ((-73.9580 40.8003, -73.9498 40.7968, -73.9737 40.7648, -73.9814 40.7681, -73.9580 40.8003)))';
   ```

4. **将 WKT 转换为 GeoJSON**：
   ```javascript
   const multiPolygonGeoJSON = wktToGeoJSON(wktMultiPolygon);
   ```

5. **示例点（GeoJSON 格式）**：
   ```javascript
   const point = turf.point([-73.96, 40.78]);
   ```

6. **判断 MultiPolygon 是否包含该点**：
   ```javascript
   let isContained = false;
   if (multiPolygonGeoJSON.geometry.type === 'MultiPolygon') {
     for (const coords of multiPolygonGeoJSON.geometry.coordinates) {
       const polygon = turf.polygon(coords);
       if (turf.booleanContains(polygon, point)) {
         isContained = true;
         break;
       }
     }
   } else {
     isContained = turf.booleanContains(multiPolygonGeoJSON, point);
   }

   console.log(`MultiPolygon 是否包含该点: ${isContained}`);
   ```


如果你想判断一个 `MultiPolygon` 是否包含另一个 `Polygon`，可以使用类似的方法：

```javascript
const turf = require('@turf/turf');
const { wktToGeoJSON } = require('@terraformer/wkt');

// 示例 WKT MultiPolygon
const wktMultiPolygon = 'MULTIPOLYGON (((-73.9580 40.8003, -73.9498 40.7968, -73.9737 40.7648, -73.9814 40.7681, -73.9580 40.8003)), ((-73.9580 40.8003, -73.9498 40.7968, -73.9737 40.7648, -73.9814 40.7681, -73.9580 40.8003)))';

// 将 WKT 转换为 GeoJSON
const multiPolygonGeoJSON = wktToGeoJSON(wktMultiPolygon);

// 示例 Polygon（GeoJSON 格式）
const polygon = turf.polygon([[[-73.96, 40.78], [-73.95, 40.77], [-73.97, 40.76], [-73.96, 40.78]]]);

// 判断 MultiPolygon 是否包含该 Polygon
let isContained = false;
if (multiPolygonGeoJSON.geometry.type === 'MultiPolygon') {
  for (const coords of multiPolygonGeoJSON.geometry.coordinates) {
    const poly = turf.polygon(coords);
    if (turf.booleanContains(poly, polygon)) {
      isContained = true;
      break;
    }
  }
} else {
  isContained = turf.booleanContains(multiPolygonGeoJSON, polygon);
}

console.log(`MultiPolygon 是否包含该 Polygon: ${isContained}`);
```

通过这些方法，你可以在 Node.js 环境中将 WKT 格式的 `MultiPolygon` 转换为 GeoJSON 格式，并使用 Turf.js 的 `booleanContains` 方法判断其是否包含另一个几何图形。

## 简化GeoJSON(`simplify`)
获取 GeoJSON 对象并返回简化版本。内部使用 simple-js 的 2d 版本，使用 Ramer-Douglas-Peucker 算法执行简化。

## `bboxPolygon`
`Turf.js` 的 `turf.bboxPolygon` 方法返回一个 GeoJSON 对象，具体来说是一个 GeoJSON `Polygon` 对象。这个对象包含了一个多边形的几何信息，表示由给定的边界框（bounding box）生成的多边形。

以下是 `turf.bboxPolygon` 返回的 GeoJSON `Polygon` 对象的结构示例：

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [west, south],
        [west, north],
        [east, north],
        [east, south],
        [west, south]
      ]
    ]
  },
  "properties": {}
}
```

## 获取面积(`area`)
以平方米为单位

如下示例，使用地图的边界（bounds）来计算当前视图范围内的面积：
```js
const bounds = map.getBounds(); // map.getBounds() 返回一个 LatLngBounds 对象，该对象包含地图的西南和东北角的坐标。
// 使用地图的西南和东北角的坐标创建一个 GeoJSON 多边形
const bboxPolygon = turf.bboxPolygon([
  bounds.getWest(),
  bounds.getSouth(),
  bounds.getEast(),
  bounds.getNorth()
]);
const area = turf.area(bboxPolygon);
```

## (`featureCollection`)
`Turf.js` 是一个强大的地理空间分析库，用于处理 GeoJSON 数据。`Turf.featureCollection` 是一个用于创建 GeoJSON FeatureCollection 对象的函数。FeatureCollection 是一种 GeoJSON 对象类型，用于存储一组地理空间特征（Feature）。

以下是如何使用 `Turf.featureCollection` 创建一个包含多个特征的 FeatureCollection 的示例。

```javascript
const turf = require('@turf/turf');

// 创建一些示例特征
const point = turf.point([102.0, 0.5]);
const line = turf.lineString([
  [102.0, 0.0],
  [103.0, 1.0],
  [104.0, 0.0],
  [105.0, 1.0]
]);
const polygon = turf.polygon([[
  [100.0, 0.0],
  [101.0, 0.0],
  [101.0, 1.0],
  [100.0, 1.0],
  [100.0, 0.0]
]]);

// 创建 FeatureCollection
const featureCollection = turf.featureCollection([point, line, polygon]);

console.log(JSON.stringify(featureCollection, null, 2));
```

1. **创建特征**：
   - 使用 `turf.point` 创建一个点特征。
   - 使用 `turf.lineString` 创建一个线特征。
   - 使用 `turf.polygon` 创建一个多边形特征。

2. **创建 FeatureCollection**：
   - 使用 `turf.featureCollection` 函数将这些特征组合成一个 FeatureCollection 对象。

3. **输出结果**：
   - 使用 `JSON.stringify` 将 FeatureCollection 对象转换为 JSON 字符串，并打印到控制台。

`turf.featureCollection`输出的结果是一个 GeoJSON FeatureCollection 对象，包含了我们创建的点、线和多边形特征。

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [102.0, 0.5]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0]
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      },
      "properties": {}
    }
  ]
}
```

## 获取多边形交集(`intersect`)
获取 polygon 或 multi-polygon 的交集。如果它们不相交，则返回 `null`。

```js
const geoJson1 = {
  type: 'Polygon',
  coordinates: [
   [
     [ 116.30676269531251, 39.73392411634328 ],
     [ 116.4130210876465, 39.73392411634328 ],
     [ 116.4130210876465, 39.76408208417687 ],
     [ 116.30676269531251, 39.76408208417687 ],
     [ 116.30676269531251, 39.73392411634328 ]
   ]
  ]
}
const poly1 = turf.polygon(geoJson1.coordinates);

const geoJson2 = {
  type: 'MultiPolygon',
  coordinates: [
   [
    [
      [ 116.28075, 39.743884 ], [ 116.285666, 39.726658 ], [ 116.287294, 39.719206 ], [ 116.303361, 39.7101280000001 ], [ 116.299615, 39.7226840000001 ]
    ]
   ],
 ]
}

const intersections = [];

for (let j = 0; j < geoJson2.coordinates.length; j++) {
  const coordinate = geoJson2.coordinates[j];
  const poly2 = turf.polygon(coordinate);
  const intersection = turf.intersect(poly1, poly2);
  /*
  intersection的值为null或者为如下类型的数据：
   {
     type: 'Feature',
     properties: {},
     geometry: { type: 'Polygon', coordinates: [ [Array] ] }
   }
  */
  if (intersection) {
    intersections.push(intersection);
  }
}
```