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

import {EventEmitter, Point} from "pixi.js";
import {Button} from "./Button.ts";

/**
 * the class that handle mouse movement and interactions
 * @todo maybe include touch input for mobile devices
 * @extends EventEmitter
 */
export class MouseInput extends EventEmitter {

  public static readonly shared = new MouseInput();

  private readonly _registry: Map<string, Button>;

  private mousedownHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
  private mouseupHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
  private mousemoveHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void }
  private mousewheelHandler: { (event: WheelEvent): void; (this: Window, ev: WheelEvent): void }

  public realTransform: Point = new Point();
  public transform: Point = new Point();
  public wheelTransform: Point = new Point();


  constructor() {
    super();
    this._registry = new Map();
    this.setupEvents();
  }

  private setupEvents() {
    this.mousedownHandler = (event: MouseEvent): void => this.onMouseDown(event);
    this.mouseupHandler = (event: MouseEvent): void => this.onMouseUp(event);
    this.mousemoveHandler = (event: MouseEvent): void => this.onMouseMove(event);
    this.mousewheelHandler = (event: WheelEvent): void => this.onMouseWheel(event);
    window.addEventListener('mousedown', this.mousedownHandler);
    window.addEventListener('mouseup', this.mouseupHandler);
    window.addEventListener('mousemove', this.mousemoveHandler)
    window.addEventListener('wheel', this.mousewheelHandler);
  }

  public addButton(button: Button): void {
    this._registry.set(button.name, button);
  }

  public get(name: string): Button {
    if( !this._registry.has(name))
      throw new Error(`Button ${name} does not exist`);
    return this._registry.get(name);
  }
  public buttons(): Map<string, Button> {
    return this._registry;
  }

  public has(name: string): boolean {
    return this._registry.has(name);
  }

  /**
   * the function that is called when a button is pressed down
   * @param {MouseEvent} event - the mouse event to catch
   * @private
   */
  private onMouseDown(event: MouseEvent): void {
    const buttonName = this.fetchButtonName(event.button);
    if (this._registry.has(buttonName)) {
      const button = this._registry.get(buttonName);
      button.down(event);
      this.emit('mousedown', button);
    }
  }

  /**
   * the function that is called when a button is released
   * @param {MouseEvent} event - the mouse event to catch
   * @private
   */
  private onMouseUp(event: MouseEvent): void {
    const buttonName = this.fetchButtonName(event.button);
    if (this._registry.has(buttonName)) {
      const button = this._registry.get(buttonName);
      button.up(event);
      this.emit('mouseup', button);
    }
  }

  /**
   * the function that is called when the mouse is moving
   * @param {MouseEvent} event - the mouse event to catch
   * @private
   */
  private onMouseMove(event: MouseEvent): void {
    this.transform.x = event.clientX;
    this.transform.y = event.clientY;
    this.realTransform.x = event.pageX;
    this.realTransform.y = event.pageY;
    this.emit('mousemove');
  }

  /**
   * the function that is called when the scroll wheel is used
   * @param {WheelEvent} event - the wheel event to catch
   * @private
   */
  private onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    this.wheelTransform.x = event.deltaX;
    this.wheelTransform.y = event.deltaY;
    this.emit('wheel');
  }

  /**
   * return wether the button is enabled or not
   * @param {Button} button - the button to check its state
   * @returns {boolean}
   */
  public isEnabled(button: Button): boolean {
    if (this._registry.has(button.name)) {
      return button.isEnabled;
    }
    return false;
  }

  /**
   * return wether the button is pressed or not
   * @param {Button} button - the button to check its state
   * @returns {boolean}
   */
  public isPressed(button: Button): boolean {
    if (this._registry.has(button.name)) {
      return button.isDown;
    }
    return false;
  }

  /**
   * return wether the button is released or not
   * @param {Button} button - the button to check its state
   * @returns {boolean}
   */
  public isReleased(button: Button): boolean {
    if (this._registry.has(button.name)) {
      return button.isDown;
    }
    return false;
  }

  /**
   * clear all the registered data for the mouse buttons.
   */
  public clear() {
    this._registry.forEach((button) => button.clear());
    this.emit('clear');
  }

  /**
   * destroy the mouse event listener
   */
  public destroy() {
    window.removeEventListener('mousedown', this.mousedownHandler);
    window.removeEventListener('mouseup', this.mouseupHandler);
    window.removeEventListener('mousemove', this.mousemoveHandler);
    window.removeEventListener('wheel', this.mousewheelHandler);
  }

  /**
   * return the button name based on it's id
   * @param {number} id - the button id
   * @private
   * @returns {string}
   */
  private fetchButtonName(id: number): string {
    for (const [key, button] of this._registry.entries()) {
      if (button.id === id) {
        return key;
      }
    }
    return null;
  }

}
