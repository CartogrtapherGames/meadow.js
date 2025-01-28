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

// Enum for Gamepad Buttons
export enum GamepadButtons {
  A = 0,            // Bottom button (e.g., Xbox 'A', PlayStation 'Cross')
  B = 1,            // Right button (e.g., Xbox 'B', PlayStation 'Circle')
  X = 2,            // Left button (e.g., Xbox 'X', PlayStation 'Square')
  Y = 3,            // Top button (e.g., Xbox 'Y', PlayStation 'Triangle')
  LeftBumper = 4,   // Left shoulder button (LB / L1)
  RightBumper = 5,  // Right shoulder button (RB / R1)
  LeftTrigger = 6,  // Left trigger (LT / L2)
  RightTrigger = 7, // Right trigger (RT / R2)
  Back = 8,         // Back/View button
  Start = 9,        // Start/Menu button
  LeftStick = 10,   // Left stick clickable
  RightStick = 11,  // Right stick clickable
  DPadUp = 12,      // D-pad up
  DPadDown = 13,    // D-pad down
  DPadLeft = 14,    // D-pad left
  DPadRight = 15,   // D-pad right
  Home = 16         // Center (e.g., XBox 'Guide', PlayStation 'Home')
}

export class ControllerButton {

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

  constructor(button: GamepadButtons) {
    this.name = GamepadButtons[button].toString();
    this.id = button;
  }

  public up(event: GamepadEvent) {
    if(!this.isEnabled){
      return;
    }
    if(this.capture){
      event.preventDefault();
    }
    this.timeUp = event.timeStamp;
    this.isDown = false;
    this.isUp = true;
  }

  public down(event: GamepadEvent) {
    if(!this.isEnabled){
      return;
    }
    if(this.capture){
      event.preventDefault();
    }
    this.isDown = true;
    this.isUp = false;
  }

  public clear(){
    this.isDown = false;
    this.isUp = false;
  }
}
