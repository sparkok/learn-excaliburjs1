import { Actor, Engine } from "excalibur"
import { Extend } from "schema-utils/declarations/validate"
import { ExtEvent } from "../interface/ext-events";
import { UITool, UIToolManager } from "../interface/ui-tool"

export class UIToolManagerImpl extends Actor implements UIToolManager {
    private tools : Map<String,UITool> = new Map<String,UITool>;
    private activeTool : UITool;
    owner: any;
    constructor(owner : any){
        super()
        this.owner = owner;
    }
    flag: "ExtEvent";
    onInitialize(engine:Engine): void {
        this.activeTool = null;
        this.tools.forEach(tool => tool.initUITool(this))
        this.tools.forEach(tool => {
            const actor = tool as unknown as Actor
            const uiTool = tool as unknown as UITool
            engine.add(actor)
        })
    }
    addUITool(tool : UITool):boolean{
        if(this.tools.has(tool.getName())){
            return false;
        }
        this.tools.set(tool.getName(),tool);
        return true;
    }
    activeUITool(name: string): boolean {
        // if(!this.tools.has(name)){
        //     return false;
        // }
        if(this.activeTool != null && this.activeTool.getName().localeCompare(name) === 0){
            return true;
        }
        if(this.activeTool != null){
            this.activeTool.deactivateUITool();
        }
        const tool = this.tools.get(name)
        if(tool != null && tool.activeUITool()) {
            this.activeTool = tool;
            return true;
        }
        return false;
    }
}