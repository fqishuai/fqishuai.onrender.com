[Mapbox](https://www.mapbox.com/) 是一个强大的地图服务平台，提供了丰富的地图和地理空间数据处理工具。它允许开发者在网页和移动应用中嵌入自定义地图，并提供了多种 API 和 SDK 来实现复杂的地理空间功能。

主要功能:
- 自定义地图样式: 通过 Mapbox Studio，可以创建和编辑自定义地图样式。
- 丰富的地图数据: 提供全球范围内的高精度地图数据，包括道路、地形、卫星图像等。
- 地理编码和逆地理编码: 将地址转换为地理坐标，或将地理坐标转换为地址。
- 路线规划: 提供多种交通方式的路线规划，包括驾车、步行和骑行。
- 数据可视化: 支持在地图上进行数据可视化，如热力图、聚合点等。
- 离线地图: 支持在移动设备上使用离线地图。

## Mapbox Web Maps(Mapbox GL JS)
Mapbox GL JS 通过动态渲染功能、强大的地图控件以及大规模自定义数据的快速处理，为web端最引人注目的地图体验提供支持。

Mapbox GL JS 是一个用于在 Web 上创建交互式地图的 JavaScript 库。它基于 WebGL 技术，能够渲染高性能的矢量地图，并支持丰富的交互功能和自定义样式。

### 安装和使用

首先，你需要在项目中引入 Mapbox GL JS。你可以通过 CDN 或 npm 安装。

#### 通过 CDN 引入

在 HTML 文件中添加以下代码：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Mapbox GL JS Example</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  </script>
</body>
</html>
```

#### 通过 npm 安装

如果你使用 npm，可以通过以下命令安装：

```bash
npm install mapbox-gl
```

然后在你的 JavaScript 文件中引入并使用：

```jsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 9
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
```

### 基本功能

#### 添加标记

你可以使用 `mapboxgl.Marker` 添加标记：

```javascript
const marker = new mapboxgl.Marker()
  .setLngLat([lng, lat])
  .addTo(map);
```

#### 添加弹出框

你可以使用 `mapboxgl.Popup` 添加弹出框：

```javascript
const popup = new mapboxgl.Popup({ offset: 25 })
  .setText('Hello, Mapbox!')
  .setLngLat([lng, lat])
  .addTo(map);
```

#### 添加自定义图层

你可以使用 `map.addLayer` 添加自定义图层：

```javascript
map.on('load', () => {
  map.addLayer({
    id: 'custom-layer',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  });
});
```

#### 添加多边形
```jsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 9
    });

    map.on('load', () => {
      // 添加 GeoJSON 数据源
      map.addSource('polygon', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [lng1, lat1],
                [lng2, lat2],
                [lng3, lat3],
                [lng4, lat4],
                [lng1, lat1] // 闭合多边形
              ]
            ]
          }
        }
      });

      // 添加图层以显示多边形
      map.addLayer({
        'id': 'polygon',
        'type': 'fill',
        'source': 'polygon',
        'layout': {},
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.8
        }
      });

      // 添加边框图层
      map.addLayer({
        'id': 'polygon-outline',
        'type': 'line',
        'source': 'polygon',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 2
        }
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
```

1. 添加数据源：使用 map.addSource 方法添加一个 GeoJSON 数据源。这个数据源包含一个多边形的坐标。

2. 添加填充图层：使用 map.addLayer 方法添加一个填充图层，以显示多边形。fill-color 属性设置多边形的填充颜色，fill-opacity 属性设置填充的不透明度。

3. 添加边框图层：使用 map.addLayer 方法添加一个线图层，以显示多边形的边框。line-color 属性设置边框的颜色，line-width 属性设置边框的宽度。

通过这些步骤，你可以在 Mapbox GL JS 中绘制一个多边形，并自定义其样式。你可以根据需要调整多边形的坐标和样式属性。

### 结论

Mapbox GL JS 是一个功能强大且灵活的库，适用于创建各种交互式地图应用。通过其丰富的 API 和自定义功能，你可以轻松地实现复杂的地图需求。

## 比较 Mapbox GL JS 与 leaflet
Mapbox GL JS 和 Leaflet 是两个流行的 JavaScript 库，用于在 Web 上创建交互式地图。虽然它们都有相似的目标，但在技术实现、功能和使用场景上有一些显著的区别。

### Mapbox GL JS

#### 优点

1. **高性能渲染**：基于 WebGL 技术，能够渲染高性能的矢量地图，支持平滑的缩放和旋转。
2. **丰富的样式**：支持 Mapbox 样式规范，可以轻松自定义地图样式。
3. **3D 支持**：支持 3D 地形和建筑物渲染。
4. **矢量瓦片**：支持矢量瓦片，能够在客户端进行样式应用和动态更新。
5. **强大的 API**：提供丰富的 API，支持复杂的交互和动画效果。

#### 缺点

1. **学习曲线**：由于功能强大，API 复杂，学习曲线较陡。
2. **文件大小**：由于使用 WebGL，库的文件大小较大。
3. **浏览器兼容性**：需要现代浏览器支持 WebGL。

#### 示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Mapbox GL JS Example</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  </script>
</body>
</html>
```

### Leaflet

#### 优点

1. **轻量级**：库的文件大小较小，加载速度快。
2. **易于使用**：API 简单易用，学习曲线平缓。
3. **插件丰富**：有大量的社区插件，能够扩展功能。
4. **浏览器兼容性**：支持较老版本的浏览器。

#### 缺点

1. **性能限制**：基于 DOM 渲染，性能不如 WebGL，尤其在处理大量数据时。
2. **样式限制**：不支持矢量瓦片和复杂的样式自定义。
3. **3D 支持有限**：不支持 3D 地形和建筑物渲染。

#### 示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Leaflet Example</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  </script>
</body>
</html>
```

### 选择指南

- **性能和复杂性**：如果你需要高性能渲染、复杂的交互和动画效果，或者需要支持 3D 地形和建筑物，Mapbox GL JS 是更好的选择。
- **轻量级和易用性**：如果你需要一个轻量级、易于使用的库，并且不需要复杂的样式和高性能渲染，Leaflet 是更好的选择。
- **浏览器兼容性**：如果你需要支持较老版本的浏览器，Leaflet 是更好的选择。

总的来说，选择哪个库取决于你的具体需求和项目要求。两者都有各自的优点和适用场景。