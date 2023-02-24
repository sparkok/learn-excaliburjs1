import { Actor, Color, Engine, Input, IsometricMap, IsometricTile, Line, Polygon, Rectangle, Shape, Tile, TileMap, vec, Vector } from 'excalibur';
import { TransformComponent } from 'excalibur';
import { FolderApi } from 'tweakpane';
import { Game } from '../..';
import { ExtEvent } from '../../interface/ext-events';
import { UITool, UIToolManager } from '../../interface/ui-tool';
import { LevelOne } from '../../scenes/level-one/level-one';
import { Resources } from '../../resources'; 
import { Pin } from './pin';
export class TerrainDetail extends Actor implements UITool,ExtEvent{
    isoMap: IsometricMap;
    static IsIsometric = true
    static w = 32
    public tileMap:TileMap
    pointerdownHandler: (pe: any) => void;
    mouseMoveHandler: (pe: any) => void;
    deleteKeyHandler: (evt: any) => void;
    keyHandler: (evt: any) => void;
    private uiactive:boolean = false;
    engine: Engine;
    uiManager: UIToolManager;
    placeThingPanel: FolderApi;
    getName(): string {
        return this.name;
    }
    getTopTileByPoint(x:number,y:number) :IsometricTile {
      const layer = (this.engine.currentScene as LevelOne).floorMap.getLastIsoMapLayer();
      if(layer == null) return null
      return layer.getTileByPoint(vec(x,y))
    }
    getBottomTileByPoint(x:number,y:number) :IsometricTile {
      const layer = (this.engine.currentScene as LevelOne).floorMap.getFirstIsoMapLayer();
      if(layer == null) return null
      return layer.getTileByPoint(vec(x,y))
    }
    getTilesByPoint(x:number,y:number) :IsometricTile[] {
      const layers:IsometricMap[] = (this.engine.currentScene as LevelOne).floorMap.getIsoMapLayers()
      if(layers == null || layers.length == 0) return []
      const tiles = []
      for (const iterator of layers) {
        const tile = iterator.getTileByPoint(vec(x,y))
        if(tile != null) tiles.push(tile)
      }
      return tiles
    }

    getTileZIndex(tile:IsometricTile) :number {
      if(tile == null) return 0;
      const transform = tile.get(TransformComponent)
      return transform.z
    }
    
    activeUITool(): boolean {
      if(this.uiactive){
          return true;
      }
      this.on("pointerdown",this.pointerdownHandler)
      this.scene.engine.input.pointers.primary.on('move', this.mouseMoveHandler)  
      //this.scene.engine.input.keyboard.on("press", this.keyHandler);
      this.uiactive = true;
      return true;
  }
  getScene():LevelOne {
    return this.scene as LevelOne;
  }
  getGame():Game {
    return this.engine as Game;
  }
  deactivateUITool(): void {
      this.uiactive = false;
      this.off("pointerdown",this.pointerdownHandler)
      this.scene.engine.input.pointers.primary.off('move',this.mouseMoveHandler)
      this.scene.engine.input.keyboard.off('press',this.keyHandler)

      this.graphics.visible = false;
  }
    initUITool(uiManager: UIToolManager): boolean {
        this.uiManager = uiManager;
        return true
    }
    constructor() {
        super({
          width: 64,//TerrainDetail.w,
          height: 32,//TerrainDetail.w,
          z:50000,
          name:"terrainDetail",
          anchor: Vector.Half
        });
      }
  onAfterInitialize(engine: Engine) {
  }
  flag: 'ExtEvent' = "ExtEvent";
      static fixto(value:number,fix:number):number{
        return value - (value % fix) + fix;
      }
      onInitialize(engine: Engine): void {
        this.engine = engine;
        if(TerrainDetail.IsIsometric) {
          let frame1 = new Polygon({
            points: [vec(-TerrainDetail.w,0), vec(0,-TerrainDetail.w/2), vec(TerrainDetail.w,0),vec(0,TerrainDetail.w/2)],
            lineWidth:1,
            strokeColor: Color.Blue,
            lineDash:[0.1,0.1],
            //color:Color.Transparent,
            color:Color.fromRGB(0,0,255,0.2),
          })
          
          this.graphics.anchor = vec(0.5,1)
          //this.graphics.offset = vec(100,200)
          this.graphics.add(frame1)
          const cursor = Resources.pin.toSprite()
          //cursor.scale = vec(0.5,0.5)
          this.graphics.add(cursor)
          this.graphics.visible = false;
        } else {
          this.graphics.use(Resources.pin.toSprite())
          this.graphics.visible = false;
        }
        
        this.mouseMoveHandler = pe => {
          if (pe.pointerType === Input.PointerType.Mouse) {
              const pos = this.snapMouse2Grid(pe.coordinates.worldPos);
              this.pos = pos;
              this.graphics.visible = true;
            }
          }
        this.pointerdownHandler = (pe) => {
          //alert('pointerdown TerrainDetail')
          let x = this.pos.x 
          let y = this.pos.y // -TerrainDetail.w
          const tile = this.isoMap.getTileByPoint(this.pos)
          if(tile){
            const transform = tile.get(TransformComponent)
            if(transform){
              this.clickAction(x,y,tile.x,tile.y,transform.z,"",x,y);
            }
          }
      }  
      }  
    private clickAction(x: number, y: number,tileX:number,tileY:number,tileZ:number,layerName:string,worldX,worldY):void {
      const id = this.addPin(x,y,layerName+"tile=("+tileX+","+tileY+","+tileZ+"),world=("+worldX+","+worldY+")");
    }
  
  /**
   * 
   * @param x - 网格对齐的横坐标
   * @param y - 网格对齐的横坐标
   * @returns 
   */
  private addPin(x :number,y :number,tile:string):number{
    const pin = new Pin(x, y, Resources.pin.toSprite());
    pin.title = tile;
    this.scene.add(pin);
    return pin.id
  }
  // private deleteThing(thing :Thing){
  //   this.entityStore.store.delete(EntityStore.extractLoc(thing));
  //   thing.kill();
  // }
  // private replaceSprite(x :number,y :number){
  //   if (TerrainDetail.IsIsometric) {
  //     if (this.isoMap) {
  //       const tile:IsometricTile = this.isoMap.getTileByPoint(vec(x,y))
  //       if(tile) {
  //         const targetTile = this.isoMap.getTile(tile.x+1,tile.y+1);
  //         //把指定层的tile的图片换成咱们的graphi,这样就没有视差的问题了
  //         targetTile.clearGraphics();
  //         //绘制
  //         targetTile.addGraphic(this.iconList.getActiveSprint());
  //         console.log('its pos',targetTile.pos,'my pos',vec(x,y))
  //         console.log('targetTile',targetTile)
          
  //       }
  //     }
  //   }
  // }
  private snapMouse2Grid(worldPos: Vector){
    if (TerrainDetail.IsIsometric) {
      if (this.isoMap) {
        const isometile = this.isoMap.getTileByPoint(worldPos);
        if (isometile) {
          return this.isoMap.tileToWorld(vec(isometile.x, isometile.y));
        } else {
          return worldPos;
        }
      } else{
        return worldPos
      }

    } else {
      return worldPos
    }
  }
}
