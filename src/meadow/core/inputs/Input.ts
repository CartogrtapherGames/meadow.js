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
import {KeyboardKey} from "./Key.ts";
import {ControllerButton, GamepadButtons} from "./ControllerButton.ts";

type BindingType = GamepadButtons | KeyboardKey | MouseButton;

export class Input extends EventEmitter {

  public static readonly shared = new Input();

  private _inputMap: Map<string, AbstractKeyBinding[]>;
  private _playerIndex: number;

  private keydownHandler: { (event: KeyboardEvent): void; (this: Window, ev: KeyboardEvent): void };
  private keyupHandler: { (event: KeyboardEvent): void; (this: Window, ev: KeyboardEvent): void };

  constructor(playerIndex: number = 0) {
    super();
    this._inputMap = new Map();
    this._playerIndex = playerIndex;

    this.keydownHandler = (event: KeyboardEvent): void => this.onKeyDown(event);
    this.keyupHandler = (event: KeyboardEvent): void => this.onKeyUp(event);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }


  public bindAction(action: string, ...bindings: BindingType[]) {
    let bindingList: AbstractKeyBinding[] = [];
    for (let binding of bindings) {
      if (binding in KeyboardKey)
        bindingList.push(this._bindKeyboardInput(binding as KeyboardKey));

      if (binding in MouseButton) {
        bindingList.push(this._bindMouseInput(binding as MouseButton));
      }
      if (binding in GamepadButtons) {
        bindingList.push(this._bindGamepadInput(binding as GamepadButtons));
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
    return input.some((e) => e.obj.isDown);
  }

  public isReleased(action: string): boolean {
    if (!this._inputMap.has(action)) throw Error("Action not found");
    const input = this._inputMap.get(action);
    return input.some((e) => e.obj.isUp);
  }


  public clear(){
    for(let binding of this._inputMap.values()){
      for(let b of binding){
        b.obj.clear();
      }
    }
    this.emit("clear");
  }

  public destroy(){
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    this.clear();
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
    let obj = new Button(binding.toString(), MouseButton[key]);
    return {
      inputType: "mouse",
      keycode: MouseButton[key],
      obj: obj
    }
  }

  // TODO : make  the controllerButton. Also we have no choice to name it controller since the standard gamepad class is
  // global
  private _bindGamepadInput(binding: GamepadButtons): AbstractKeyBinding {
    let key = GamepadButtons[binding] as keyof typeof GamepadButtons;
    let obj = new ControllerButton(GamepadButtons[key]);
    return {
      inputType: "gamepad",
      keycode: GamepadButtons[key],
      obj: obj
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    for (let binding of this._inputMap.values()) {
      let obj;
      let key = binding.find(b => {
        if (event.key == KeyboardKey[b.keycode as keyof typeof KeyboardKey]) {
          return b;
        }
      });
      if (!key) continue;
      if (key.obj)
        obj = key.obj as Key;
        obj.isDown = true;
        this.emit("keydown", key);
        break;
    }
  }

  private onKeyUp(event:KeyboardEvent){
    for(let binding of this._inputMap.values()){
      let obj;
      let key = binding.find(b => {
        if (event.key == KeyboardKey[b.keycode as keyof typeof KeyboardKey]) {
          return b;
        }
      });
      if (!key) continue;
      if (key.obj)
        obj = key.obj as Key;
        obj.isUp = false;
        this.emit("keyup", key);
        break;
    }
  }
}

interface AbstractKeyBinding {
  inputType: "keyboard" | "mouse" | "gamepad";
  keycode: GamepadButtons | KeyboardKey | MouseButton;
  obj: Key | Button | ControllerButton;
}


export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}


