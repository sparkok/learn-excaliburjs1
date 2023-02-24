import { Vector } from "excalibur";
import { IsometricTile } from "./IsomtrcTile";

export class IsometricMap {
    tiledWidth:number;
    tiledHeight:number;
    col:number;
    row:number;
    getTileByPoint(x:number,y:number):IsometricTile {
        return new IsometricTile(0,0)
    }
    tileToWorld(col:number,row:number):Vector{
        return new Vector(0,0)
    }
}