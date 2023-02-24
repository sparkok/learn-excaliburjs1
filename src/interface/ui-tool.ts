export interface UITool {
    initUITool(uiManager:UIToolManager):boolean
    activeUITool():boolean
    deactivateUITool():void
    getName():string
}
export interface UIToolManager {
    activeUITool(name:string):boolean
    addUITool(tool : UITool):boolean
}

