### 开发过程中发现的信息

**1.如何列出来自tmx的对象**

```
在tiled编辑器中,设置excalibur图层会被导入到场景中,使用场景中的entities属性枚举它们,他们的类型都是actor
的，只要自己不直接使用actor的对象(简单的封装一层或者加个接口,就可以区分出来)。
如果不设置这个选项为true则不会产生这些actor，也不会显示它们在地图上。
```

**2.如何给摄像头对象增加点击事件**

```
给actor对象直接增加on("printerdown")就可以增加点击事件了
```

**3.如何把excalibur对象的属性和actor建立关系**

```
需要自己通过tilemap的data.getExcaliburObjects()获取这些对象之后,自己建立这种联系,它们有相同
的name和坐标map.data.getExcaliburObjects()
```

**4.做一个右键菜单,其中有选项直接查看视频,或者双击直接打开某个子页面**

```
window.open("/子页面的路由")
```

**5.新增的设备的提交问题**

```
新增的设备设置一个标志dirty=true提交以后设置成false，同时讲tmx数据文件从服务器上重新拉取。
```

**6.如何改变瓦片对象**

```javascript
//改变瓦片对象所在的层
let layer = this.engine.currentScene.tileMaps[0];
//获取瓦片对象
let tile = layer.getTileByPoint(vec(pe.coordinates.worldPos.x,pe.coordinates.worldPos.y))
tile.removeGraphic(tile.getGraphics()[0]);
tile.addGraphic(Resources.Video.toSprite());
```

**7.如何嵌入网页,引擎只是在index.ejs内容基础上加上下面这个head节**

```
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<script defer src="vendors-node_modules_excaliburjs_plugin-tiled_dist_excalibur-tiled_min_js-node_modules_webpac-9180a4.js">
</script>
<script defer src="main.js">
</script>
</head>
```

**8.当编辑某个地物的属性时,如何填写？**

```
将通过回调函数接口获取该地物需要填写的属性值,然后内置的编辑器将使用这些属性值构建属性表达
来决定用户应该录入什么，录入完毕以后，在通过回调接口把结果传递给业务系统。
```

**9.集成vue**

```
使用了httpVueLoader载入的vue
```

**10.系统是如何给每个tiled对象设置z值的**

```typescript
export class IsometricEntitySystem extends System<TransformComponent | IsometricEntityComponent> {
  public readonly types = ['ex.transform', 'ex.isometricentity'] as const;
  public readonly systemType = SystemType.Update;
  priority: number = 99;
  update(entities: Entity[], _delta: number): void {
    let transform: TransformComponent;
    let iso: IsometricEntityComponent;
    for (const entity of entities) {
      transform = entity.get(TransformComponent);
      iso = entity.get(IsometricEntityComponent);
      const maxZindexPerElevation = Math.max(iso.map.columns * iso.map.tileWidth, iso.map.rows * iso.map.tileHeight);

      const newZ = maxZindexPerElevation * iso.elevation + transform.pos.y;
      transform.z = newZ;
    }
  }
}
```

关键在于

```
const maxZindexPerElevation = 
Math.max(iso.map.columns * iso.map.tileWidth, iso.map.rows * iso.map.tileHeight);
const newZ = maxZindexPerElevation * iso.elevation + transform.pos.y;
首先每一层的iso.elevation就是层索引,逐层+1。而随着x方向和y方向的增加1,z都会+1。
这样就基本能保证，不会有任何临近的tile的z相同,当然大物体就除外了。
```

但是thing添加的时候为什么z不对呢？多半是算错了位置。
