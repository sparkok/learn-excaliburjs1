import { Canvas, Color, ExcaliburGraphicsContext, Graphic, GraphicOptions, Line, LineOptions, RasterOptions, vec } from "excalibur";

export class ArrowLine extends Line {
    public zoomOfCamera = 1;
    constructor(options: LineOptions & GraphicOptions & RasterOptions){
        super(options)
        options.smoothing = true;
        options.quality = 8;
    }
    protected _drawImage(ctx: ExcaliburGraphicsContext, x: number, y: number): void {
        super._drawImage(ctx, x, y);
        let r = Math.sqrt((this.end.x - this.start.x) * (this.end.x - this.start.x) + (this.end.y - this.start.y) * (this.end.y - this.start.y))
        const minR = 15;
        if(r > minR){
            r = minR;
            //绘制箭头两侧
            this.drawHeads(r/this.zoomOfCamera, ctx);
        }
        
    }
    

    private drawHeads(r: number, ctx: ExcaliburGraphicsContext) {
        
        const angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
        let x = this.end.x - Math.cos(angle - Math.PI / 12) * r;
        let y = this.end.y - Math.sin(angle - Math.PI / 12) * r;
        ctx.drawLine(vec(x, y), this.end, this.color, this.thickness);
        x = this.end.x - Math.cos(angle + Math.PI / 12) * r;
        y = this.end.y - Math.sin(angle + Math.PI / 12) * r;
        ctx.drawLine(vec(x, y), this.end, this.color, this.thickness);
    }
}