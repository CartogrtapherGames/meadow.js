/*
 *
 *  Copyright (c) 2025 Nio Kasgami. All rights reserved.
 *
 *  Meadow Engine is a 2D game engine built with PixiJS as its foundation.
 *  This engine is licensed under the MIT License, the same terms as PixiJS.
 *
 *  Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute,
 *  sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  - The above copyright notice and this permission notice shall be included in all copies or
 *    substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 *  PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 *  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 *  ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 */

import {Stack} from "./index.ts";
import {Assets, Container, ContainerChild} from "pixi.js";
import {CreationEngine} from "@engine";
import {IScene} from "./IScene.ts";

/**
 * The class that handle every scene or *screen* in the game.
 * It has a stack system that allow for adding and removing scene on top of another
 * without unloading  the previous one. However it is not to be confused with
 * an in scene GUI system which is made in scene.
 */
export class SceneManager {

  private static _stack: Stack<IScene>;
  private static _app: CreationEngine;
  private static _root: Container<ContainerChild> = new Container();
  //private static _background;

  public static get currentScene(): IScene {
    return this._stack.peek();
  }

  public static async  initialize(app: CreationEngine): Promise<void> {
    this._stack = new Stack<IScene>();
    this._app = app;
    this._app.ticker.add(this.update.bind(this));
    this._app.ticker.stop();
  }



  // @ts-ignore
  private static update() {
    if (this._stack.isEmpty() || this.currentScene.isPaused) return;

    this.currentScene.update();
  }


  /**
   * Will load a new scene and erase the current stack.
   * Meaning it will unload all previous scene and its content if any scene exist.
   * @param scene - the new scene to load
   */
  public static async goto(scene: SceneCtor) {
    if(!this._stack.isEmpty()) // in this case we dont need to unload since the stack is empty
      // here we terminate the scene and unload
      await this.terminate(true);

    // we push the new scene to the stack
    this._stack.push(new scene());

    if(!this._root.parent){
      this._app.stage.addChild(this.currentScene);
    }

    this._root.addChild(this.currentScene);
    await this.initializeScene();
  }


  private static async initializeScene() {
    this.currentScene.interactiveChildren = false;
    await this.currentScene.preload().then(this.load);
    await this.currentScene.create();
    this.currentScene.resize?.();
    await this.currentScene.start();

    this.currentScene.interactiveChildren = true;
    this.currentScene.isPaused = false;
    this._app.ticker.start();
  }

  private static async load(){
    await Assets.loadBundle("");
  }
  private static async terminate(unloadAll : boolean = false) : Promise<void> {
    if(unloadAll) {
      // todo : implement the unloading of all the scenes ressources.
      this._stack.clear();
    } else {
      // todo : implement the scene unloading but NOT all ressources
      this._stack.pop();
    }
  }
  /* add on top of the stack and pause the previous scene */
  public push(_scene: IScene) {
  }

  public static clear(){
    this._stack.clear();
  }
}

interface SceneCtor {
  new (): IScene;
}
