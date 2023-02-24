import { AsepriteResource } from '@excaliburjs/plugin-aseprite';
import { TiledMapResource } from '@excaliburjs/plugin-tiled';
import { vec,Color,Graphic, ImageSource, Loader, Resource } from 'excalibur';

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const floorFile = "test1.tmx";
const Resources = {
    FloorMap : new TiledMapResource(floorFile, { startingLayerZIndex: -1 }),
    pin :new ImageSource('./PinPink.png'),
}
const loader = new Loader();
for (const res in Resources) {
    loader.addResource((Resources as any)[res]);
}
export { Resources,loader }
