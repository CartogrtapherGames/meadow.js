/**
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

import {EventEmitter} from "pixi.js";
import {Key} from "./Key.ts";

/**
 * The class that handle keyboard input.
 */
export class Input extends EventEmitter {

  public static readonly shared = new Input();

  private _registry: Map<string,Key>;

  private keydownHandler: { (event: KeyboardEvent): void; (this: Window, ev: KeyboardEvent): void };

  private keyupHandler: { (event: KeyboardEvent): void; (this: Window, ev: KeyboardEvent): void };


  constructor() {
    super();
    this.setupEvents();
  }

  /**
   * setup the keyboards events
   * @private
   */
  private setupEvents(){
    this.keydownHandler = (event: KeyboardEvent): void => this.onKeyDown(event);
    this.keyupHandler = (event: KeyboardEvent): void => this.onKeyUp(event);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  /**
   * will register a new key input to the registry
   * @param {Key} key - the key to register
   */
  public addKey(key: Key){
    this._registry.set(key.name, key);
  }

  /**
   * return the list of registered keyboard input
   * @returns {Map<string,Key>}
   */
  public keys():Map<string,Key>{
    return this._registry;
  }

  /**
   * return if the button is already registered
   * @param name - the button name
   * @returns {boolean}
   */
  public has(name:string): boolean{
    return this._registry.has(name);
  }

  /**
   * the function that is called when a key is pressed
   * @param {KeyboardEvent} event - the keyboard event to catch
   * @private
   */
  private onKeyDown(event: KeyboardEvent): void {
    if (this._registry.has(event.key)) {
      const key = this._registry.get(event.key);
      key.down(event);
      this.emit('keydown', key);
    }
  }

  /**
   * the function that is called when a key is released
   * @param {KeyboardEvent} event - the keyboard event to catch
   */
  private onKeyUp(event: KeyboardEvent): void {
    if (this._registry.has(event.key)) {
      const key = this._registry.get(event.key);
      key.up(event);
      this.emit('keyup', key);
    }
  }

  /**
   * return wether the key is pressed or not
   * @param {Key} key - the key to check its state
   * @returns {boolean}
   */
  public isPressed(key: Key): boolean {
    if (this._registry.has(key.name)) {
      return key.isDown;
    }
    return false;
  }

  /**
   * return wether the key is released or not
   * @param {Key} key - the key to check its state
   * @returns
   */
  public isReleased(key: Key): boolean {
    if (this._registry.has(key.name)) {
      return key.isUp;
    }
    return false;
  }

  /**
   * clear all data from the registered Input key
   */
  public clear(): void {
    this._registry.forEach((key) => key.clear());
    this.emit('clear');
  }

  /**
   * destroy the mouse event listener
   */
  public destroy(): void {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    this.clear();
  }
}

