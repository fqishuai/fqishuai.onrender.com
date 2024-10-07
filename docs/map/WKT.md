## WKT
WKT（Well-Known Text）是一种用于表示地理对象的文本标记语言。它由OGC（Open Geospatial Consortium，开放地理空间信息联盟）定义，广泛用于地理信息系统（GIS）中。WKT可以表示点、线、多边形等几何形状。

以下是一些常见的WKT格式示例：

1. **点（Point）**：
   ```wkt
   POINT (30 10)
   ```

2. **线串（LineString）**：
   ```wkt
   LINESTRING (30 10, 10 30, 40 40)
   ```

3. **多边形（Polygon）**：
   ```wkt
   POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))
   ```

4. **多点（MultiPoint）**：
   ```wkt
   MULTIPOINT ((10 40), (40 30), (20 20), (30 10))
   ```

5. **多线串（MultiLineString）**：
   ```wkt
   MULTILINESTRING ((10 10, 20 20, 10 40), (40 40, 30 30, 40 20, 30 10))
   ```

6. **多多边形（MultiPolygon）**：
   ```wkt
   MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))
   ```

7. **几何集合（GeometryCollection）**：
   ```wkt
   GEOMETRYCOLLECTION (POINT (40 10), LINESTRING (10 10, 20 20, 10 40))
   ```

每种几何类型都有其特定的语法和结构。WKT格式简洁明了，便于在不同的GIS系统之间传递和交换地理数据。

## 在Leaflet中使用WKT
在Leaflet中使用WKT（Well-Known Text）格式的几何数据，可以借助以下几种常见的第三方插件：

1. **leaflet-omnivore**：
   `leaflet-omnivore`是一个非常流行的插件，可以解析多种格式的地理数据，包括WKT、KML、GeoJSON等。它使用简单，功能强大。

   ```html
   <script src="https://unpkg.com/leaflet-omnivore/leaflet-omnivore.min.js"></script>
   ```

   示例代码：
   ```javascript
   var wkt = 'POLYGON ((-0.09 51.505, -0.08 51.505, -0.08 51.51, -0.09 51.51, -0.09 51.505))';
   var layer = omnivore.wkt.parse(wkt).addTo(map);
   map.fitBounds(layer.getBounds());
   ```

   :::tip
   - npm包`leaflet-omnivore`已被弃用。改为安装 `@mapbox/leaflet-omnivore`
   - Weekly Downloads: 1385
   :::

2. **terraformer-wkt-parser**：
   `terraformer-wkt-parser`是一个专门用于解析和生成WKT格式的JavaScript库。你可以将WKT转换为GeoJSON，然后在Leaflet中使用。

   ```html
   <script src="https://unpkg.com/terraformer-wkt-parser/terraformer-wkt-parser.min.js"></script>
   ```

   示例代码：
   ```javascript
   var wkt = 'POLYGON ((-0.09 51.505, -0.08 51.505, -0.08 51.51, -0.09 51.51, -0.09 51.505))';
   var geojson = Terraformer.WKT.parse(wkt);
   L.geoJSON(geojson).addTo(map);
   ```

   :::tip
   - npm包`terraformer-wkt-parser`已被弃用。改为安装 `@terraformer/wkt`
   - Weekly Downloads: 82798
   - TS类型包：`@types/terraformer__wkt`
   :::

3. **wellknown**：
   `wellknown`是另一个用于解析和生成WKT格式的JavaScript库。它也可以将WKT转换为GeoJSON格式。

   ```html
   <script src="https://unpkg.com/wellknown/wellknown.min.js"></script>
   ```

   示例代码：
   ```javascript
   var wkt = 'POLYGON ((-0.09 51.505, -0.08 51.505, -0.08 51.51, -0.09 51.51, -0.09 51.505))';
   var geojson = wellknown.parse(wkt);
   L.geoJSON(geojson).addTo(map);
   ```

   :::tip
   npm包`wellknown` Weekly Downloads: 65755
   :::

4. **Wicket**：
   `Wicket`是一个用于解析和生成WKT格式的库，并且可以与Leaflet直接集成。

   ```html
   <script src="https://unpkg.com/wicket/wicket.js"></script>
   <script src="https://unpkg.com/wicket/wicket-leaflet.js"></script>
   ```

   示例代码：
   ```javascript
   var wkt = 'POLYGON ((-0.09 51.505, -0.08 51.505, -0.08 51.51, -0.09 51.51, -0.09 51.505))';
   var wicket = new Wkt.Wkt();
   wicket.read(wkt);
   var obj = wicket.toObject();
   L.geoJSON(obj).addTo(map);
   ```

   :::tip
   npm包`wicket` Weekly Downloads: 6172
   :::

5. **wkt**：
   `wkt`是一个用于解析和生成WKT格式的库，可以将 WKT (Well-known text) 和 GeoJSON 相互转换。

   ```js
   const wkt = require('wkt');
   const { parse } = require('wkt');
    
   //  将WKT解析为GeoJSON
   wkt.parse('POINT(1 2)');
   parse("POINT Z (58.51466818909509 8.629797415591964 61.77237)");
   parse("LINESTRING (30 10, 10 30, 40 40)");
   parse("POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))");
   ```
   ```js
   const { stringify } = require('wkt');
 
   const geometry = {
     type: "Point",
     coordinates: [125.6, 10.1, 54.2]
   };
   const geometry2 = { 
     type: 'LineString',
     coordinates: [ [ 30, 10 ], [ 10, 30 ], [ 40, 40 ] ] 
   };
    
   //  将GeoJSON转换为WKT
   stringify(geometry);
   stringify(geometry2);
   ```

   :::tip
   npm包`wkt` Weekly Downloads: 4814
   :::

这些插件和库都可以帮助你在Leaflet中使用WKT格式的几何数据。选择哪一个取决于你的具体需求和偏好。

## 获取 WKT POLYGON 的中心点
要获取 WKT (Well-Known Text) 表示的 `POLYGON` 的中心点，可以使用一些地理信息系统（GIS）库来解析 WKT 并计算中心点。以下是一些常用的 JavaScript 库和方法：

### 使用 Turf.js

[Turf.js](https://turfjs.org/) 是一个强大的地理空间分析库，可以轻松处理 GeoJSON 数据。你可以使用 Turf.js 将 WKT 转换为 GeoJSON，然后计算中心点。

首先，确保你已经安装了 Turf.js：

```bash
npm install @turf/turf
```

然后，你可以使用以下代码来计算 `POLYGON` 的中心点：

```javascript
import * as turf from '@turf/turf';
import { wktToGeoJSON } from '@terraformer/wkt'

// 示例 WKT POLYGON
const wktPolygon = 'POLYGON((-73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681))';

// 将 WKT 转换为 GeoJSON
const geojsonPolygon = wktToGeoJSON(wktPolygon);

// 计算中心点，结果是GeoJSON格式
const center = turf.center(geojsonPolygon);

// 输出中心点坐标
console.log(center.geometry.coordinates);
```

### 使用 OpenLayers

[OpenLayers](https://openlayers.org/) 是一个功能强大的开源地图库，也可以用来解析 WKT 并计算中心点。

首先，确保你已经安装了 OpenLayers：

```bash
npm install ol
```

然后，你可以使用以下代码来计算 `POLYGON` 的中心点：

```javascript
import WKT from 'ol/format/WKT';
import { getCenter } from 'ol/extent';

// 示例 WKT POLYGON
const wktPolygon = 'POLYGON((-73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681))';

// 解析 WKT
const format = new WKT();
const feature = format.readFeature(wktPolygon);

// 获取多边形的边界框
const extent = feature.getGeometry().getExtent();

// 计算中心点
const center = getCenter(extent);

// 输出中心点坐标
console.log(center);
```

### 使用 JSTS

[JSTS](https://github.com/bjornharrtell/jsts) 是一个 JavaScript 拓扑套件，可以用来解析 WKT 并计算几何中心。

首先，确保你已经安装了 JSTS：

```bash
npm install jsts
```

然后，你可以使用以下代码来计算 `POLYGON` 的中心点：

```javascript
import jsts from 'jsts';

// 示例 WKT POLYGON
const wktPolygon = 'POLYGON((-73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681, -73.981149 40.7681))';

// 解析 WKT
const reader = new jsts.io.WKTReader();
const polygon = reader.read(wktPolygon);

// 计算中心点
const centroid = polygon.getCentroid();
const center = [centroid.getX(), centroid.getY()];

// 输出中心点坐标
console.log(center);
```

通过这些方法，你可以轻松地从 WKT 表示的 `POLYGON` 中获取中心点。选择哪种方法取决于你的具体需求和使用的库。