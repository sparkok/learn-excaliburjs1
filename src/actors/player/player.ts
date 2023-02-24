import { Entity, ExcaliburGraphicsContext,Actor, BoundingBox, Canvas, Color, Line, vec } from 'excalibur';

export class Player extends Actor {
  tileWidth = 64
  tileHeight = 32
  graphic :Canvas
  constructor() {
    super({
      width: 64,
      height: 128,
      z:15000,
      //in my opnion,anchor shound be vec(32/64,(128-16)/128),why the following line +16 is ok?
      //anchor: vec(32/64,(128-16-16)/128), it is matched
      anchor: vec(32/64,(128-16)/128), // it is not matched,but why?
    });
  }
  onInitialize() {
    this.graphic = new Canvas({
      width: this.width,
      height: this.height,
      cache: true,  
      draw: (context) => {
          context.lineWidth=2.7;
          context.strokeStyle="#ff0000"

          context.moveTo(0, 0);
          context.lineTo(this.width,0);
          context.lineTo(this.width,this.height);
          context.lineTo(0,this.height);
          context.lineTo(0,0);
          context.stroke();

          context.moveTo(this.width/2, 0);
          context.lineTo(this.width/2,this.height);
          context.stroke();

          context.moveTo(0,this.height/2);
          context.lineTo(this.width,this.height/2);
          context.stroke();
      }
  })
    this.graphics.use(this.graphic);
  }
}
