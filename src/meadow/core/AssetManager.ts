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

import manifest from "../../manifest.json"; // fix that later
import {Assets} from "pixi.js";
import {SceneManager} from "meadow.js";

/**
 * The middleware class that handle the boilerplate of the AssetManager.
 * it also ensure proper typing safety and such. It also allow to create an
 * queue system which allow to bulk preload assets and keep all their references to unload them
 * when needed.
 */
export class AssetManager {

  public static root: string = "assets";

  public static preloadAssets: string[] = [];

  private static _queue: string[] = []

  public static async init(){
    await Assets.init({ manifest, basePath: "assets" });
    await this.preload();
  }

  public static async preload(){
    await Assets.loadBundle(this.preloadAssets);
    const allBundles = manifest.bundles.map(item => item.name);
    Assets.backgroundLoadBundle(allBundles);
  }

  public static schedulePreloadBundles(...bundles: string[]){
    this.preloadAssets.push(...bundles);
  }
  /**
   * Allow to queue the loading of assets on the fly if needed.
   * it is similar to ```Assets.add``` but its differences is that
   * it is added to an array and is automatically loaded after preload is done.
   * @param alias
   * @param url
   */
  public static queue(alias: string, url: string){
    const src = this.root + "/" + url;
    this._queue.push(alias);
    Assets.add({alias,src});
  }

  public static get<T>(alias: string): T{
    return Assets.get(alias) as T;
  }

  public static async load(): Promise<void> {
    await Assets.load(this._queue, (progress) => {
      if(SceneManager.currentScene?.onLoad){
        SceneManager.currentScene.onLoad(progress * 100);
      }
    });
  }

  // we request an unloading of the queue
  public static async unload(): Promise<void> {
    await Assets.unload(this._queue);
    this._queue = [];
  }

  public static async loadBundle(bundle: string): Promise<void> {
    await Assets.loadBundle(bundle, (progress) => {
      if(SceneManager.currentScene?.onLoad){
        SceneManager.currentScene.onLoad(progress * 100);
      }
    });
  }

  public static async unloadBundle(bundle: string): Promise<void> {
    await Assets.unloadBundle(bundle);
  }
}


