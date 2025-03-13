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

import { KeyboardKey } from "./KeyboardKey";

export class KeyState {

  public name: string;

  public isEnabled: boolean = true;

  public isDown: boolean = false;

  public isUp: boolean = false;

  public capture: boolean = false;

  public timeDown: number = 0;

  public timeUp: number = 0;

  constructor(key: KeyboardKey) {
    this.name = key;
  }

  public up(event: KeyboardEvent): void {
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

  public down(event: KeyboardEvent): void {
    if (!this.isEnabled) {
      return;
    }

    if (this.capture) {
      event.preventDefault();
    }

    this.timeDown = event.timeStamp;
    this.isDown = true;
    this.isUp = false;
  }

  public clear(): void {
    this.isDown = false;
    this.isUp = false;
  }
}
