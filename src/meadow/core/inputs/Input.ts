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
import { MouseButtonState } from "meadow.js";
import { MouseButton } from "./MouseButton.ts";
import { GamepadButton } from "./GamepadButton.ts";
import { KeyboardKey } from "./KeyboardKey.ts";
import { KeyState } from "./KeyState.ts";
import { GamepadButtonState } from "./GamepadButtonState.ts";
import { getEnumKeyByValue } from "meadow/utils/getEnumKeyByValue.ts";

type BindingType = GamepadButton | KeyboardKey | MouseButton;

export class Input extends EventEmitter {

  public static readonly shared = new Input();

  private _inputMap: Map<string, InputBinding[]>;
  /**
   * @deprecated
   * @private
   */
  private _playerIndex: number;

  private mouseUpHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
  private mouseDownHandler: { (event: MouseEvent): void; (this: Window, ev: MouseEvent): void };
  private keydownHandler: { (event: KeyboardEvent): void; (this: Window, ev: KeyboardEvent): void };
  private keyupHandler: { (event: KeyboardEvent): void; (this: Window, ev: KeyboardEvent): void };

  constructor(playerIndex: number = 0) {
    super();
    this._inputMap = new Map();
    this._playerIndex = playerIndex;

    this.mouseUpHandler = (event: MouseEvent): void => this.onMouseUp(event);
    this.mouseDownHandler = (event: MouseEvent): void => this.onMouseDown(event);
    this.keydownHandler = (event: KeyboardEvent): void => this.onKeyDown(event);
    this.keyupHandler = (event: KeyboardEvent): void => this.onKeyUp(event);
    window.addEventListener('mouseup', this.mouseUpHandler);
    window.addEventListener('mousedown', this.mouseDownHandler);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  public bindAction(action: string, ...bindings: BindingType[]) {
    let bindingList: InputBinding[] = [];
    for (let binding of bindings) {
      if (getEnumKeyByValue(KeyboardKey, binding as KeyboardKey)) {
        bindingList.push(this._bindKeyboardInput(binding as KeyboardKey));
      }

      if (binding in MouseButton) {
        bindingList.push(this._bindMouseInput(binding as MouseButton));
      }
      if (binding in GamepadButton) {
        bindingList.push(this._bindGamepadInput(binding as GamepadButton));
      }
    }
    this._inputMap.set(action, bindingList);
  }

  public unbindAction(action: string) {
    this._inputMap.delete(action);
  }

  public unbindKey(action: string, binding: BindingType) {
    let act = this._inputMap.get(action);
    if (act) {
      let index = act.findIndex(b => b.keycode == binding);
      if (index != -1)
        act.splice(index, 1);
    }
  }

  public isPressed(action: string): boolean {
    if (!this._inputMap.has(action)) throw Error("Action not found");
    const input = this._inputMap.get(action);
    return input.some((e) => e.state.isDown);
  }

  public isReleased(action: string): boolean {
    if (!this._inputMap.has(action)) throw Error("Action not found");
    const input = this._inputMap.get(action);
    // important here to make sure that
    return input.every((e) => e.state.isUp);
  }


  public clear(){
    for(let binding of this._inputMap.values()){
      for(let b of binding){
        b.state.clear();
      }
    }
    this.emit("clear");
  }

  public destroy(){
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    this.clear();
  }

  private _createBinding<T extends KeyState | MouseButtonState | GamepadButtonState>(
    inputType: "keyboard" | "mouse" | "gamepad",
    key: KeyboardKey | MouseButton | GamepadButton,
    state: T
  ): InputBinding {
    return { inputType, keycode: key, state };
  }

  private _bindKeyboardInput(binding: KeyboardKey): InputBinding {
    return this._createBinding('keyboard', binding, new KeyState(binding));
  }

  private _bindMouseInput(binding: MouseButton): InputBinding {
    return this._createBinding('mouse', binding, new MouseButtonState(binding.toString(), binding));
  }

  private onMouseUp(event: MouseEvent) {
    for (let binding of this._inputMap.values()) {
      let obj;
      let key = binding.find(b => {
        if (b.inputType !== "mouse") return;
        if (event.button == b.keycode) {
          return b;
        }
      });
      if (!key) continue;
      if (key.state)
        obj = key.state as MouseButtonState;
        obj.isUp = true;
        obj.isDown = false;
        this.emit("mouseup", key);
        break;
    }
  }
  
  private onMouseDown(event: MouseEvent) {
    for (let binding of this._inputMap.values()) {
      let obj;
      let key = binding.find(b => {
        if (b.inputType !== "mouse") return;
        if (event.button == b.keycode) {
          return b;
        }
      });
      if (!key) continue;
      if (key.state)
        obj = key.state as MouseButtonState;
        obj.isDown = true;
        obj.isUp = false;
        this.emit("mousedown", key);
        break;
    }
  }

  // TODO : make  the controllerButton. Also we have no choice to name it controller since the standard gamepad class is
  // global
  private _bindGamepadInput(binding: GamepadButton): InputBinding {
    return this._createBinding('gamepad', binding, new GamepadButtonState(binding));
  }

  private onKeyDown(event: KeyboardEvent) {
    for (let binding of this._inputMap.values()) {
      let obj;
      let key = binding.find(b => {
        if (event.key == b.keycode) {
          return b;
        }
      });
      if (!key) continue;
      if (key.state)
        obj = key.state as KeyState;
        obj.isDown = true;
        obj.isUp = false;
        this.emit("keydown", key);
        break;
    }
  }

  private onKeyUp(event:KeyboardEvent){
    for(let binding of this._inputMap.values()){
      let obj;
      let key = binding.find(b => {
        if (event.key == b.keycode) {
          return b;
        }
      });
      if (!key) continue;
      if (key.state)
        obj = key.state as KeyState;
        obj.isUp = true;
        obj.isDown = false;
        this.emit("keyup", key);
        break;
    }
  }
}

interface InputBinding {
  inputType: "keyboard" | "mouse" | "gamepad";
  keycode: GamepadButton | KeyboardKey | MouseButton;
  state: KeyState | MouseButtonState | GamepadButtonState;
}

