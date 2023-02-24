import { Actor, Color, Shape, Sprite, vec,Text } from 'excalibur';
import { Font,Engine, TransformComponent } from 'excalibur';
import { Resources } from '../../resources';
import { ActorLabel } from '../../utils/ActorLabel';
import { Device } from './Device';

export class Pin extends Actor {
  textActor: Actor;
  actorLabel: ActorLabel;
  title:string = "";
  sprite:Sprite
  constructor(x:number,y:number,sprite:Sprite) {
    super({
      pos: vec(x, y),
      width: 64,
      height: 64,
      color: Color.Transparent,
      z:1000000
    });
    this.sprite = sprite;
  }

  onInitialize(engine:Engine) {
    this.actorLabel = new ActorLabel(this,{color:Color.Blue,pos:vec(-30,10),text:this.title})
    this.graphics.add(this.sprite);
  }
}