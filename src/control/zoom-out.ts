import { Actor, Color, Engine, Input, Rectangle, Scene, vec, Vector } from "excalibur";
import { ExtEvent } from "../interface/ext-events";
import { UITool, UIToolManager } from "../interface/ui-tool";

/**
 * 拖到矩形框的方式进行放大
 */
export class ZoomOut extends Actor implements ExtEvent,UITool
{
    showInCenter = true;
    mouseUp: (event: any) => void;
    mouseDown: (event: any) => void;
    mouseMove: (event: any) => void;
    constructor(secondCursorOffset:number = 0) {
        super({
          anchor:vec(0, 0),
          pos: vec(64, 64),
          width: 10,
          height: 10,
          color: new Color(255, 255, 255),
          z:50000,
        });
      }
    private uiactive:boolean = false;
    uiManager: UIToolManager;
    mouseDownPos: Vector = null;
    mouseDownScreenPos: Vector = null;
    rect: Rectangle;
    
    initUITool(uiManager: UIToolManager): boolean {
        this.uiManager = uiManager;
        return true
    }
    activeUITool(): boolean {
        if(this.uiactive){
            return true;
        }
        this.engine.input.pointers.primary.on('move', this.mouseMove)
        this.engine.input.pointers.primary.on('down', this.mouseDown)
        this.engine.input.pointers.primary.on('up', this.mouseUp)
        this.uiactive = true;
        return true;
    }
    deactivateUITool(): void {
        this.engine.input.pointers.primary.off('move', this.mouseMove)
        this.engine.input.pointers.primary.off('down', this.mouseDown)
        this.engine.input.pointers.primary.off('up', this.mouseUp)
        this.uiactive = false;
    }
    engine: Engine;
    getName(): string {
        return "zoomOut";
    }
    flag: "ExtEvent" = "ExtEvent";
    onAfterInitialize(engine: Engine) {
        
    }
    onPostKill(_scene: Scene<unknown>): void {
        this.deactivateUITool();
    }
    onInitialize(engine: Engine): void {
        this.engine = engine;
        this.rect = new Rectangle({
            width:10,
            height:10,
            lineWidth:1,
            strokeColor: Color.Green,
            lineDash:[0.1,0.1],
            //color:Color.Transparent,
            color:Color.fromRGB(0,100,0,0.1),
            smoothing:false,
          })
          this.graphics.use(this.rect)
          this.graphics.hide();
          engine.currentScene.add(this)

        this.mouseUp = (event: any): void => {
            if (event.pointerType !== Input.PointerType.Mouse) return;
            this.engine.currentScene.camera.clearAllStrategies()
            if(this.mouseDownPos !== null){
                const secondPointPos = event.coordinates.worldPos
                const camera = this.engine.currentScene.camera
                this.rect.lineWidth = 1/camera.zoom
                 const mouseDownScreenPos2 = event.coordinates.screenPos;
                 const d1 = Math.abs(this.mouseDownScreenPos.x - mouseDownScreenPos2.x)*Math.abs(this.mouseDownScreenPos.y - mouseDownScreenPos2.y);
                 const d2 = this.engine.canvasWidth * this.engine.canvasHeight
                 //让相机对着操作矩形的中心,而不是屏幕中心
                //计算放缩前操作矩形中心到屏幕的屏幕像素距离
                let offset = vec((this.mouseDownPos.x + secondPointPos.x)/2 - camera.pos.x,(this.mouseDownPos.y + secondPointPos.y)/2 - camera.pos.y)
                offset = this.engine.worldToScreenCoordinates(offset)
                camera.pos.x = (this.mouseDownPos.x + secondPointPos.x)/2;  
                camera.pos.y = (this.mouseDownPos.y + secondPointPos.y)/2; 
                camera.zoom *= Math.pow(d1 / d2,1/4);
                //计算缩放后要移动的世界坐标的距离
                if(!this.showInCenter){
                    offset = this.engine.screenToWorldCoordinates(offset)
                    camera.pos.x -= offset.x/camera.zoom
                    camera.pos.y -= offset.y/camera.zoom
                }
                this.engine.emit("camera.object.change",{"props":JSON.stringify({"x":camera.pos.x,"y":camera.pos.y,"rotation":camera.rotation,"viewPort":camera.viewport,"zoom":camera.zoom},null,2)})
                this.engine.emit("cursor.object.change",{"props":JSON.stringify({"x":this.pos.x,"y":this.pos.y},null,2)})
                this.graphics.hide();
                this.mouseDownPos = null;
            }
        }
        this.mouseDown = (event: any): void => {
            if (event.pointerType !== Input.PointerType.Mouse) return;
            this.mouseDownPos = event.coordinates.worldPos;
            this.mouseDownScreenPos = event.coordinates.screenPos;
            console.log("mouseDown",this.mouseDownPos)
            //Pointer.lastPagePos, Pointer.lastScreenPos or Pointer.lastWorldPos
        }
        this.mouseMove = (event: any): void =>{
            if (event.pointerType !== Input.PointerType.Mouse) return;
            if(this.mouseDownPos !== null){
                //draw a rectangle
                const secondPointPos = event.coordinates.worldPos
                this.pos.x = this.mouseDownPos.x;
                this.pos.y = this.mouseDownPos.y;
                const camera = this.engine.currentScene.camera
                this.rect.lineWidth = 1/camera.zoom
                
                const from = this.engine.worldToScreenCoordinates(this.mouseDownPos)
                const to = this.engine.worldToScreenCoordinates(secondPointPos)
                this.rect.height = Math.abs(to.y - from.y)/camera.zoom
                this.rect.width = Math.abs(to.x - from.x)/camera.zoom
                this.graphics.show(this.rect);
            }
            // if(this.mouseDownPos !== null){
            //     this.pos.x = event.coordinates.worldPos.x;
            //     this.pos.y = event.coordinates.worldPos.y;
            //     this.engine.currentScene.camera.strategy.lockToActor(this);
            //     this.engine.currentScene.camera.x = this.pos.x;
            //     this.engine.currentScene.camera.y = this.pos.y;
            //     this.graphics.show(this.rect);
            // }

        }
    

    }
}



