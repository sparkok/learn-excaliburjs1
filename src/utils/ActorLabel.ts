import { Actor, ActorArgs, Engine, Events, EventTypes, HiddenEvent, Label, LabelOptions, PostKillEvent, TransformComponent, vec } from "excalibur";

export class ActorLabel extends Label {
    owner: Actor;
    constructor(owner: Actor,options?: LabelOptions & ActorArgs){
        super({...options,
            z:owner.get(TransformComponent).z+1
        })
        this.owner = owner
        this.owner.addChild(this)
    }
    public onInitialize(engine: Engine) {
        this.owner.on(EventTypes.PostKill,(event: PostKillEvent) => {
            this.kill()
        });
        
        this.on(EventTypes.PreUpdate,(ev) => {
          this.graphics.visible = this.owner.graphics.visible
        });
    }

    
}