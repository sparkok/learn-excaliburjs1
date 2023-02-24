import { Engine, GraphicsComponent, IsometricMap, Scene } from 'excalibur';
import { FloorMap } from '../../map/floor-map';
import { ExtEvent, toExtEvent } from '../../interface/ext-events';
import { ZoomIn } from '../../control/zoom-in';
import { UIToolManager } from '../../interface/ui-tool';
import { UIToolManagerImpl } from '../../control/ui-tool-manager';
import { Pan } from '../../control/pan';
import { ZoomOut } from '../../control/zoom-out';
//import { Player } from '../../actors/player/player1';
import { Move } from '../../control/move';
import { TerrainDetail } from '../../actors/player/terrain-detail';
import { NoOperation } from '../../actors/player/no-operation';
import { TransformComponent, vec } from 'excalibur';
import { Player } from '../../actors/player/player';
/**
 * Managed scene
 */
export class LevelOne extends Scene implements ExtEvent{
  public toolManager: UIToolManager = new UIToolManagerImpl(this);
  flag: "ExtEvent" = "ExtEvent";
  onAfterInitialize(engine: Engine) {
     this.entities.forEach(it =>{
      const ext = toExtEvent(it)
      if(ext){
        ext.onAfterInitialize(engine)
      }
    });
  }
  engine: Engine;
  floorMap: FloorMap;
  ui: HTMLElement;
  setUI(ui: HTMLElement) {
    this.ui = ui;
  }
  public onInitialize(engine: Engine) {
    this.engine = engine;
    const zoomIn = new ZoomIn()
    this.toolManager.addUITool(zoomIn);

    const zoomOut = new ZoomOut()
    this.toolManager.addUITool(zoomOut);

    const pan = new Pan()
    this.toolManager.addUITool(pan);

    const move = new Move()
    this.toolManager.addUITool(move);

    const terrainDetail = new TerrainDetail();
    this.toolManager.addUITool(terrainDetail);
    
    const noOperation = new NoOperation();
    this.toolManager.addUITool(noOperation);

    this.floorMap = new FloorMap();
    this.add(this.floorMap);
    
    (this.toolManager as UIToolManagerImpl).onInitialize(this.engine)

    this.floorMap.initMap(this)
    const isoMap = this.floorMap.getLastIsoMapLayer();
    terrainDetail.isoMap = isoMap
    this.focusCenterOfMap(isoMap);
  }
  focusCenterOfMap(isoMap:IsometricMap) {
        //focus the center of the map
        if(isoMap != null){
          let c:number = Math.floor(isoMap.columns/2)
          let r = Math.floor(isoMap.rows/2)
          let remainderOfR = isoMap.rows/2 == 0
          let remainderOfC = isoMap.columns/2 == 0
          if(remainderOfC){
            c++;
          }
          if(remainderOfR){
            r++;
          }
          let eyeX = 0,eyeY = 0
          if(remainderOfC){
            eyeX = isoMap.getTile(c,r).pos.x
          } else {
            eyeX = isoMap.getTile(c+1,r).pos.x
          }
          if(remainderOfR){
            eyeX = isoMap.getTile(c,r).center.y
          } else {
            eyeY = isoMap.getTile(c,r+1).pos.y
          }
          this.camera.pos.x = eyeX
          this.camera.pos.y = eyeY
        }
    
  }

  public testPlaceTinInCenterOfTile() {
    const lastIsoLayer = this.floorMap.getLastIsoMapLayer()
    const c = 0,r = 0
    const tile = lastIsoLayer.getTile(c,r)
    const graphi = tile.get(GraphicsComponent)
    const bound = graphi.recalculateBounds()
    console.log("bound",bound)
    const pos = lastIsoLayer.tileToWorld(vec(c,r))
    const play = new Player()
    play.pos = pos
    play.z = tile.get(TransformComponent).z - 0.1
    this.add(play)
    this.camera.zoom = 0.5
  }
  public executeAction(action:string) {
      switch(action) {
        case 'test':{
            this.testPlaceTinInCenterOfTile()    
        }   
        break; 
      }

  }
  public onActivate() {
    

  }
  public onDeactivate() {}
}
