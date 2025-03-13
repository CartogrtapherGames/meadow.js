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

/**
 * the class that shape the state of a mouse button
 * contrary to the keyboard, mouse button are integer based.
 * In this case we both have a name and a id to the button.
 * the name being an alias while the id is the true integer value
 */
export class MouseButtonState {

  /**
   * the button real id.
   * @type {number}
   */
  public id: number;

  /**
   * the button name
   * @type {string}
   */
  public name: string;

  /**
   * wether the button is enabled or not
   * @type {boolean}
   */
  public isEnabled: boolean = true;

  /**
   * whether the button is pressed down or not
   */
  public isDown: boolean = false;

  /**
   * whether the button is released or not
   * @type {boolean}
   */
  public isUp: boolean = false;

  /**
   * whether the current event is captured and prevent default event to fire
   * @type {boolean}
   */
  public capture: boolean = false;

  /**
   * the number of frames that the button is pressed down
   * @type {number}
   */
  public timeDown: number = 0;

  /**
   * the number of frames that the button is released
   * @type {number}
   */
  public timeUp: number = 0;

  /**
   * create a new instance of a button
   * @param {string} name - the button name
   * @param {number} value - the button id
   */
  constructor(name: string, value: number) {
    this.name = name;
    this.id = value;
  }

  /**
   * the action to execute when a button is clicked
   * @param {MouseEvent} event - the event to fire
   */
  public up(event: MouseEvent): void {
    if (!this.isEnabled) {
      return;
    }

    if (this.capture) {
      event.preventDefault();
    }
    this.timeUp = event.timeStamp;
    this.isDown = false;
    this.isUp = true;
  }

  /**
   * the action to execute when a button is released
   * @param {MouseEvent} event - the event to fire
   */
  public down(event: MouseEvent): void {
    if (!this.isEnabled) {
      return;
    }


    if (this.capture) {
      event.preventDefault();
    }
    this.timeUp = event.timeStamp;
    this.isDown = true;
    this.isUp = false;
  }

  /**
   * clear the button data
   */
  public clear(): void {
    this.isDown = false;
    this.isUp = false;
  }
}
