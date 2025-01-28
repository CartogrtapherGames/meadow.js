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
 * Enum representing all standard keyboard keys based on the 2024 standard.
 */
export enum KeyboardKey {
  // Alphanumeric Keys
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
  H = "h",
  I = "i",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  O = "o",
  P = "p",
  Q = "q",
  R = "r",
  S = "s",
  T = "t",
  U = "u",
  V = "v",
  W = "w",
  X = "x",
  Y = "y",
  Z = "z",

  Digit0 = "0",
  Digit1 = "1",
  Digit2 = "2",
  Digit3 = "3",
  Digit4 = "4",
  Digit5 = "5",
  Digit6 = "6",
  Digit7 = "7",
  Digit8 = "8",
  Digit9 = "9",

  // Punctuation and Symbols
  Backquote = "`",
  Minus = "-",
  Equal = "=",
  BracketLeft = "[",
  BracketRight = "]",
  Backslash = "\\",
  Semicolon = ";",
  Quote = "'",
  Comma = ",",
  Period = ".",
  Slash = "/",

  // Special Keys
  Escape = "Escape",
  Tab = "Tab",
  CapsLock = "CapsLock",
  ShiftLeft = "Shift",
  ShiftRight = "Shift",
  ControlLeft = "Control",
  ControlRight = "Control",
  AltLeft = "Alt",
  AltRight = "Alt",
  MetaLeft = "Meta",
  MetaRight = "Meta",
  Space = " ",
  Enter = "Enter",
  Backspace = "Backspace",

  // Arrow Keys
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",

  // Navigation Keys
  Insert = "Insert",
  Delete = "Delete",
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",

  // Function Keys
  F1 = "F1",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5 = "F5",
  F6 = "F6",
  F7 = "F7",
  F8 = "F8",
  F9 = "F9",
  F10 = "F10",
  F11 = "F11",
  F12 = "F12",

  // Additional Keys
  NumLock = "NumLock",
  ScrollLock = "ScrollLock",
  Pause = "Pause",
  PrintScreen = "PrintScreen",
  ContextMenu = "ContextMenu",

  // Numpad Keys
  Numpad0 = "0",
  Numpad1 = "1",
  Numpad2 = "2",
  Numpad3 = "3",
  Numpad4 = "4",
  Numpad5 = "5",
  Numpad6 = "6",
  Numpad7 = "7",
  Numpad8 = "8",
  Numpad9 = "9",
  NumpadAdd = "+",
  NumpadSubtract = "-",
  NumpadMultiply = "*",
  NumpadDivide = "/",
  NumpadDecimal = ".",
  NumpadEnter = "Enter",
}

export class Key {

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
