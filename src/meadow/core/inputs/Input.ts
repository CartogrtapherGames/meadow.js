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

import {EventEmitter} from "pixi.js";
import {Button, Key} from "meadow.js";

type BindingType = GamepadButtons | KeyboardKey | MouseButton;

export class Input extends EventEmitter {

  public static readonly shared = new Input();

  private _inputMap: Map<string, AbstractKeyBinding[]>;
  private _playerIndex: number;

  constructor(playerIndex: number = 0) {
    super();
    this._inputMap = new Map();
    this._playerIndex = playerIndex;
  }


  public bindAction(action: string, ...bindings: BindingType[]) {
    let bindingList: AbstractKeyBinding[] = [];
    for (let binding of bindings) {
      if(binding in KeyboardKey)
        bindingList.push(this._bindKeyboardInput(binding as KeyboardKey));

      if(binding in MouseButton){
        bindingList.push(this._bindMouseInput(binding as MouseButton));
      }
      if(binding in GamepadButtons){}
    }
    this._inputMap.set(action, bindingList);
  }

  private _bindKeyboardInput(binding: KeyboardKey): AbstractKeyBinding {
    let key = binding as keyof typeof KeyboardKey;
    let bindingObj = new Key(KeyboardKey[key]);
    return {
      inputType: "keyboard",
      keycode: KeyboardKey[key],
      obj: bindingObj
    };
  }

  private _bindMouseInput(binding: MouseButton): AbstractKeyBinding {

      let key = MouseButton[binding] as keyof typeof MouseButton;
      let obj = new Button(binding.toString(),MouseButton[key]);
      return {
        inputType: "mouse",
        keycode: MouseButton[key],
        obj: obj
      }
  }

  private  _bindGamepadInput(binding: GamepadButtons): AbstractKeyBinding {
    let key = GamepadButtons[binding] as keyof typeof  GamepadButtons;
    let obj = new ControllerButton(binding.toString(),GamepadButtons[key]);
    return {
      inputType: "gamepad",
      keycode: GamepadButtons[key],
      obj: obj
    }
  }
}

interface AbstractKeyBinding {
  inputType: "keyboard" | "mouse" | "gamepad";
  keycode : GamepadButtons | KeyboardKey | MouseButton;
  obj : Key | Button | GamepadButton;
}

// Enum for Gamepad Buttons
enum GamepadButtons {
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

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}


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
