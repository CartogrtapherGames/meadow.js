
import {userSettings} from "./app/utils/userSettings";
import {MeadowEngine, SceneManager, setEngine} from "meadow.js";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
import {SceneBase} from "./meadow/display";
import {Graphics, Sprite, Texture} from "pixi.js";

import {initDevtools} from "@pixi/devtools";
// import "@esotericsoftware/spine-pixi-v8";


const engine = new MeadowEngine();
setEngine(engine);

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#add8e6",
    resizeOptions: {minWidth: 768, minHeight: 1024, letterbox: false},
  },768,1024 );


  // Initialize the user settings
  userSettings.init();

  await SceneManager.goto(SceneLoading);
  /*
  // Show the load screen
  await engine.navigation.showScreen(LoadScreen);
  // Show the main screen once the load screen is dismissed
  await engine.navigation.showScreen(MainScreen);
  */

  await initDevtools({app: engine});
})();

//=====================================================================================

// @ts-ignore
let isMousePressed = false;
class SceneLoading extends SceneBase {

  // @ts-ignore
  private sprite: Sprite;

  override async create(): Promise<void> {
    super.create();

    const graphics = new Graphics()
        .rect(0,0, engine.width, engine.height)
        .fill(0x000000);

    this.addChild(graphics);
    /// todo improve the loading of that?
    this.sprite = new Sprite({
      texture: Texture.from("logo.svg"),
      anchor: 0.5,
      scale: 0.2,
    });

    this.sprite.x = engine.width / 2;
    this.sprite.y = engine.height / 2;
    this.addChild(this.sprite);
  }

  public override async start(): Promise<void> {
    super.start();

  }

  public override update() {
    super.update();
    if(isMousePressed){
      SceneManager.push(SceneTest);
    }
  }

  public override async pause(): Promise<void> {
    return super.pause();
  }
}

class SceneTest extends SceneBase {

  private timer: number;
  override async create(): Promise<void> {
      super.create();
      this.timer = 200;
    const graphics = new Graphics()
        .rect(0,0, engine.width, engine.height)
        .fill(0x000003);

    this.addChild(graphics);
    }

    override update() {
      super.update();
      if(this.timer <= 0){
         SceneManager.pop();
      }
      this.timer--;
    }
}



// Event listener for mouse down
document.addEventListener("mousedown", (event) => {
  if (event.button === 0) { // 0 indicates the left mouse button
    isMousePressed = true;
    console.log("Mouse is pressed!");
  }
});

// Event listener for mouse up
document.addEventListener("mouseup", (event) => {
  if (event.button === 0) {
    isMousePressed = false;
    console.log("Mouse is released!");
  }
});

// Check the value of isMousePressed as needed


