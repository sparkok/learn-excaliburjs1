import { Engine, DisplayMode, Input, Color } from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { loader } from './resources';
import './hook-vue';
import './just-to-copy-them.js';
import { ControlPanel } from './control/control-panel';
import axios from 'axios';

/**
 * Managed game class
 */
export class Game extends Engine {
  public levelOne: LevelOne;
  zoom: number = 2;
  public controlPanel: ControlPanel;
  public axios = axios;
  constructor() {
    super({
      canvasElementId: "game",
      displayMode: DisplayMode.FillContainer,
      pointerScope: Input.PointerScope.Canvas,
      antialiasing: true,//平滑
      suppressPlayButton: true,//不用点击直接进入游戏
      //阻止性能优化,否则有时会自动切换到gl硬件加速模式,导致滚轮失效
      //这时要开启 https://excaliburjs.com/docs/performance/,但是不总是能成功
      configurePerformanceCanvas2DFallback: {
        allow: false, // opt-out of the fallback
        showPlayerMessage: false, // opt-in to a player pop-up message
        threshold: { fps: 20, numberOfFrames: 100 } // configure the threshold to trigger the fallback
      }
    });
  }

  public start() {
    const ui: HTMLElement = document.getElementById('ui')
    this.levelOne = new LevelOne();
    this.levelOne.setUI(ui);
    game.add('levelOne', this.levelOne);
    //将game对象开放
    document["game"] = game
    return super.start(loader);
  };
}
const game = new Game();
game.start().then(() => {
  game.goToScene('levelOne');
  game.controlPanel = new ControlPanel(game);
  game.levelOne.onAfterInitialize(game);
  game.emit("loaded", { "res": true });
})
game.on("camera.object.change", (ev) => {
  let _ev: any;
  let _props: any;
  if (!(ev instanceof Array)) {
    _ev = JSON.parse(JSON.stringify(ev));
    _props = JSON.parse(_ev.props);
  }
})
