import { Actor, Color, Shape, Sprite, vec,Text, GraphicsComponent } from 'excalibur';
import { Vector,Font,Engine, TransformComponent } from 'excalibur';
import { Resources } from '../../resources';
import { ActorLabel } from '../../utils/ActorLabel';
import { Device } from './Device';
import {v1} from 'uuid';

export class Thing extends Actor implements Device {
  textActor: Actor;
  actorLabel: ActorLabel;
  bid: string;
  desp():string {
    return JSON.stringify({
      "x":this.pos.x,
      "y":this.pos.y,
      "title":this.title,
      "z":this.z,
      "token": this.bid
    })
  }
  setZ(z:number):void {
    const transform = this.get(TransformComponent);
    transform.z = z

  }
  public sprite: Sprite;
  public title:string = "";
  constructor(x:number,y:number,sprite:Sprite) {
    super({
      pos: vec(x, y),
      width: 64,
      height:128,
      color: Color.Transparent,
    });
    this.bid = v1();
    this.sprite = sprite;
  }
  resetAuchor(): void{
    /**
     * 原理说明:假设是一个墙壁,图是64x128的,但是对isometric方式的投影地图，上放置tile。
     * 那么这个图片可以看成是放在一个64x32的一个菱形的地形瓦片上的。
     * 因此这张图片的绘制点应该是图像坐标(左上角为原点), x=32,y=128-16=112处
     */

    //in my opnion,anchor shound be vec(32/64,(128-16)/128),why the following line -16 is ok?
    const y = (128 - 16 - 16) / 128;
    const x =  32/64;
    this.anchor = vec(x,y)
  }

  onInitialize(engine:Engine) {
    this.actorLabel = new ActorLabel(this,{color:Color.Blue,pos:vec(0,0),text:this.title})
    this.actorLabel.anchor = vec(0.5,1)
    const g = this.actorLabel.get(GraphicsComponent)
    g.offset = vec(0,-50)
    this.graphics.add(this.sprite);
  }
}