import { TiledMapResource } from "@excaliburjs/plugin-tiled";
import { Actor, IsometricEntityComponent, IsometricEntitySystem, IsometricMap, Scene, TileMap } from "excalibur";
import { Resources } from "../resources";
export class FloorMap extends Actor {
    getFirstIsoMapLayer(): IsometricMap {
        const layers = this.getIsoMapLayers();
        if(layers.length >0){
            return layers[0];
        }
    }
    getLastIsoMapLayer(): IsometricMap {
        const layers = this.getIsoMapLayers();
        if(layers.length >0){
            return layers[layers.length-1];
        }
    }
    getIsoMapLayers(): IsometricMap[] {
        if(!this.tileMap) return [];
        if(!this.tileMap.isoLayers) return [];
        if(this.tileMap.isoLayers.length == 0) return []; 
        return this.tileMap.isoLayers
    }
    getFirstCommonMapLayer(): TileMap {
        const layers = this.getCommonMapLayers();
        if(layers.length >0){
            return layers[0];
        }
    }
    getLastCommonMapLayer(): TileMap {
        const layers = this.getCommonMapLayers();
        if(layers.length >0){
            return layers[0];
        }
    }

    getCommonMapLayers(): TileMap[] {
        if(!this.tileMap) return null;
        if(!this.tileMap.layers) return null;
        if(this.tileMap.layers.length == 0) return null; 
        return this.tileMap.layers
    }
    initMap(scene: Scene) {
        // const roomMap = Resources.RoomMap;
        // const roomiso = new IsometricEntityComponent(roomMap.isoLayers[0]);
        // roomiso.elevation = 2;
        // roomMap.addTiledMapToScene(scene)

        this.tileMap = Resources.FloorMap;
        //设置好第一层的高度值,其他层会自动的+1,这决定了zIndex的数值
        const iso = new IsometricEntityComponent(this.tileMap.isoLayers[0]);
        iso.elevation = 0;
        this.tileMap.addTiledMapToScene(scene)

        // console.log("isoLayers[0] of map is ",this.tileMap.isoLayers[0])
        // console.log("graphi of tiles[0] of isoLayers[0] of map is ",this.tileMap.isoLayers[0].tiles[0].getGraphics()[0])
        // console.log("tiles[0] of isoLayers[0] of map is ",this.tileMap.isoLayers[0].tiles[0])
        // console.log("pos of tiles[0] of isoLayers[0] of map is ",this.tileMap.isoLayers[0].tiles[0].pos)
        // console.log("data of map is ",this.tileMap.data)
        // console.log("map is ",this.tileMap)
    }
    public tileMap:TiledMapResource
    onInitialize() {
        // this.tileMap = Resources.FloorMap;
        // if(this.scene.isCurrentScene){
        //     this.tileMap.addTiledMapToScene(this.scene);
        // }
    }
}