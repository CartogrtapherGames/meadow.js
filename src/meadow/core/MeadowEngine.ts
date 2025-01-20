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

import {
  Application,
  ApplicationOptions,
  DestroyOptions,
  extensions,
  RendererDestroyOptions,
  ResizePlugin
} from "pixi.js";

import {SceneManager} from "meadow.js";
import {sound} from "@pixi/sound";
import {AssetManager} from "./AssetManager.ts";
import {CreationResizePlugin} from "@engine/resize/ResizePlugin.ts";
import {CreationAudioPlugin} from "@engine/audio/AudioPlugin.ts";
import {CreationNavigationPlugin} from "@engine";

extensions.remove(ResizePlugin);
extensions.add(CreationResizePlugin);
extensions.add(CreationAudioPlugin);
extensions.add(CreationNavigationPlugin);

export class MeadowEngine extends Application  {


  private _width: number = 0;
  private _height: number = 0;

  public async init(opts: Partial<ApplicationOptions>,width: number = 680,height: number = 680): Promise<void> {
    opts.resizeTo ??= window;
    opts.resolution ??= MeadowEngine.getResolution();
    await super.init(opts);
    this._width = width;
    this._height = height;

    document.getElementById("pixi-container")!.append(this.canvas);
    document.addEventListener("visibilitychange",this.visibilityChange);

    await AssetManager.init();
    AssetManager.schedulePreloadBundles("preload");
    await AssetManager.preload();
    await SceneManager.initialize(this);
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }
  public static getResolution(): number {
    let resolution = Math.max(window.devicePixelRatio, 2);

    if (resolution % 1 !== 0) {
      resolution = 2;
    }
    return resolution;
  }

  protected visibilityChange = () => {
    if (document.hidden) {
      sound.pauseAll();
      SceneManager.blur();
    } else {
      sound.resumeAll();
      SceneManager.focus();
    }
  }

  public override destroy(
      rendererDestroyOptions: RendererDestroyOptions = false,
      options: DestroyOptions = false,
  ): void {
    document.removeEventListener("visibilitychange", this.visibilityChange);
    super.destroy(rendererDestroyOptions, options);
  }

}

let eg: MeadowEngine;

export function setEngine(engine: MeadowEngine) {
  eg = engine;
}

export function meadowEngine(){
  return eg;
}
