import { Actor, Color, Engine, Input, Scene, vec, Vector } from "excalibur";
import { ExtEvent } from "../interface/ext-events";
import { UITool, UIToolManager } from "../interface/ui-tool";
import { ArrowLine } from "../utils/arrow";

//拖动地图进行漫游
export class Move extends Actor implements ExtEvent,UITool
{
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
    cursor: ArrowLine;
    
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
        this.uiactive = false;
        this.engine.input.pointers.primary.off('move', this.mouseMove)
        this.engine.input.pointers.primary.off('down', this.mouseDown)
        this.engine.input.pointers.primary.off('up', this.mouseUp)
        
    }
    engine: Engine;
    getName(): string {
        return "move";
    }
    flag: "ExtEvent" = "ExtEvent";
    onAfterInitialize(engine: Engine) {
        
    }
    onPostKill(_scene: Scene<unknown>): void {
        this.deactivateUITool();
    }
    onInitialize(engine: Engine): void {
        this.engine = engine;
        this.cursor = new ArrowLine({
            thickness:2.7,
            color:Color.Green,
            start: vec(0, 0),
            end: vec(200, 200),
            
            
          })
          this.graphics.use(this.cursor)
          this.graphics.hide();
          engine.currentScene.add(this)

        this.mouseMove = (event: any): void => {
            if (event.pointerType !== Input.PointerType.Mouse) return;
            if(this.mouseDownPos !== null){
                //划线
                const secondPointPos = event.coordinates.worldPos
                const from = this.mouseDownPos
                const to = secondPointPos
                //相机中心移动到目标点处,这里有个问题，应该让操作的中心对着目标点处
                const camera = this.engine.currentScene.camera
                camera.pos.x += from.x - to.x;  
                camera.pos.y += from.y - to.y; 
                console.log('pan to ',this.engine.currentScene.camera.pos)
                
                this.engine.emit("camera.object.change",{"props":JSON.stringify({"x":camera.pos.x,"y":camera.pos.y,"rotation":camera.rotation,"viewPort":camera.viewport,"zoom":camera.zoom},null,2)})
                this.engine.emit("cursor.object.change",{"props":JSON.stringify({"x":this.pos.x,"y":this.pos.y},null,2)})
                this.graphics.hide();
                
            }
        }
        this.mouseUp = (event: any): void => {
            this.mouseDownPos = null;
            this.mouseDownScreenPos = null;
        }
        this.mouseDown = (event: any): void => {
            if (event.pointerType !== Input.PointerType.Mouse) return;
            this.mouseDownPos = event.coordinates.worldPos;
            this.mouseDownScreenPos = event.coordinates.screenPos;
            console.log("mouseDown",this.mouseDownPos)
            //Pointer.lastPagePos, Pointer.lastScreenPos or Pointer.lastWorldPos
        }
        // this.mouseMove = (event: any): void =>{
        //     if (event.pointerType !== Input.PointerType.Mouse) return;
        //     if(this.mouseDownPos !== null){
        //         //draw a rectangle
        //         const secondPointPos = event.coordinates.worldPos
        //         this.pos.x = this.mouseDownPos.x;
        //         this.pos.y = this.mouseDownPos.y;
        //         const from = this.engine.worldToScreenCoordinates(this.mouseDownPos)
        //         const to = this.engine.worldToScreenCoordinates(secondPointPos)
        //         const zoom = this.engine.currentScene.camera.zoom
        //         this.cursor.end.x = (to.x - from.x) / zoom
        //         this.cursor.end.y = (to.y - from.y) / zoom
        //         this.cursor.thickness = 2 / zoom;
        //         this.cursor.zoomOfCamera = zoom
        //         this.graphics.show(this.cursor);
        //     }
        // }
    }
}

