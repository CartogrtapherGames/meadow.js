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


import {PlayOptions, sound, Sound} from "@pixi/sound";
import {animate} from "motion";

/**
 * the static class that handle Audio such as BGM, ME and SE
 */
export class Audio {

  private static currentAlias: string;
  private static current: Sound;
  private static volume: number;

  public static basePath = "assets/audio/";

  public static async init(){
    this.currentAlias = "";
    this.current = null;
    this.volume = 1;
  }

  public static async playBgm(file: string, options?: PlayOptions){
    if(this.currentAlias === file) return;

    if(this.current){
      const current = this.current;
      animate(current, {volume: 0}, {duration: 1, ease: "linear"}).then(() => {
        current.stop();
      });
    }

    this.current = sound.find(file);
    this.currentAlias = file;
    this.current.play({loop: true, ...options});
    this.current.volume = 0;
    animate(
        this.current,
        {volume: this.volume},
        {duration: 1, ease: "linear"}
    );
  }

  public static async playSe(file: string, options?: PlayOptions){
  }

  public static async playMe(file: string, options?: PlayOptions){
  }

  /**
   * Stops the current audio. If fadeOut is enabled, the volume will decrease gradually over the specified duration before stopping.
   *
   * @param {boolean} [fadeOut=false] Indicates whether the stop action should fade out the volume before stopping the playback.
   * @param {number} [_duration=1] The duration of the fade-out effect in seconds when fadeOut is enabled.
   * @return {Promise<void>} Resolves when the fade-out animation completes and the playback has stopped, or immediately if fadeOut is disabled.
   */
  public static async stop(fadeOut: boolean = false, _duration = 1){
    if(this.current){
      if(fadeOut){
        animate(this.current, {volume: 0}, {duration: _duration, ease: "linear"}).then(() => {
          this.current.stop();
        })
      } else {
        this.current.stop();
      }
    }
  }

}
