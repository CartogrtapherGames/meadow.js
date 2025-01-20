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


//TODO : remove the destroy as texture and object are automatically handled so terminate can be used for end of scene usage.
import {Stack} from "./index.ts";
import {Container, ContainerChild, Ticker} from "pixi.js";
import {IScene} from "./IScene.ts";
import {AssetManager} from "./AssetManager.ts";
import {MeadowEngine} from "./MeadowEngine.ts";

/**
 * The `SceneManager` class manages the lifecycle of all scenes (or *screens*) within the game.
 * It implements a stack-based system, enabling seamless transitions between scenes while
 * retaining the state of previous scenes. This allows developers to push new scenes onto the stack
 * or return to previous ones without needing to unload and reload resources.
 *
 * Key functionality includes:
 * - Adding new scenes on top of the existing stack ({@link push}).
 * - Replacing the current scene by clearing the existing stack (`goto`).
 * - Removing the top scene to return to the previous one (`pop`).
 * - Initializing and managing the creation, updating, pausing, resuming, and destruction of scenes.
 *
 * It is important to note that this class does not manage in-scene GUI systems or components,
 * which must be handled within individual scenes themselves.
 */
export class SceneManager {

  private static _stack: Stack<IScene>;
  private static _app: MeadowEngine;
  private static _root: Container<ContainerChild> = new Container();

  /**
   * return the current scene
   */
  public static get currentScene(): IScene {
    return this._stack.peek();
  }

  /**
   * initialize the sceneManager
   * @param app - the pixi application
   */
  public static async  initialize(app: MeadowEngine): Promise<void> {
    this._stack = new Stack<IScene>();
    this._app = app;
    this._app.ticker.add(this.update.bind(this));
    this._app.ticker.stop();
  }

  /**
   * Will load a new scene and erase the current stack.
   * Meaning it will unload all previous scene and its content if any scene exist.
   * @remark do take in context that resources have to be disposed/destroyed in the dispose function in
   * every scene.
   * @param scene - the new scene to load
   */
  public static async goto(scene: SceneCtor) {
    this._app.ticker.stop();

    if(!this._stack.isEmpty())
      await this.dispose();

    this._stack.push(new scene());

    if(!this._root.parent){
      this._app.stage.addChild(this._root);
    }
    this._root.addChild(this.currentScene);
    await this.initializeScene();
  }

  /**
   * push and initialize a scene onto the stack and pause the previous scene.
   * @remarks push does not unload the scene.
   * @param scene
   */
  public static async push(scene: SceneCtor) {
    this._app.ticker.stop();
    await this.currentScene.pause();
    this._stack.push(new scene());
    if(!this._root.parent){
      this._app.stage.addChild(this._root);
    }
    this._root.addChild(this.currentScene);
    await this.initializeScene();
  }

  /**
   * pop the scene from the stack and dispose it
   */
  public static async pop() {
    if(this._stack.size() <= 1)
    {
      process.exit(0);
    }
    await this.currentScene.terminate();
    let oldScene = this._stack.pop();
    this._root.removeChild(oldScene as IScene);
    oldScene?.destroy();
    await this.currentScene.resume();
  }

  /**
   * Clear the scene stack and dispose of all of them.
   */
  public static clear(){
    this._stack.clear();
    this.dispose();
  }

  /**
   * called when the scene lose focus.
   */
  public static blur(){
    if(this.currentScene.blur)
    this.currentScene.blur();
  }

  /**
   * called when the scene regain focus
   */
  public static focus(){
    if(this.currentScene.focus)
    this.currentScene.focus();
  }

  // @ts-ignore
  private static update(ticker: Ticker) {
    if (this._stack.isEmpty() || this.currentScene.isPaused) return;
    this.currentScene.update(ticker);
  }

  private static async initializeScene() {
    this.currentScene.interactiveChildren = false;
    await this.currentScene.preload();
    await this.load();
    await this.currentScene.create();
    await this.currentScene.start();
    this.currentScene.interactiveChildren = true;
    this.currentScene.isPaused = false; // TODO : do we really need this anymore?
    this._app.ticker.start();
  }

  private static async load(){
    await AssetManager.load();
  }

  private static async dispose() : Promise<void> {
    for (const child of this._root.children as IScene[]) {
      await child.terminate();
      this._root.removeChild(child);
      child.destroy();
    }
    this._stack.clear();
  }
}

interface SceneCtor {
  new (): IScene;
}
