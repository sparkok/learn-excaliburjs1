import { Engine } from "excalibur";

export interface ExtEvent {
    flag: 'ExtEvent';
    onAfterInitialize(engine: Engine);
}
export function toExtEvent(obj:any) : ExtEvent 
{
    try {
        if(obj.flag === 'ExtEvent'){
            return obj as ExtEvent;
        }
        
    } catch (error) {
        return null;        
    }
}

