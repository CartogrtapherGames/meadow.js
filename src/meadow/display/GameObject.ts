import {Container, Ticker} from "pixi.js";

export interface IComponent {
  active: boolean;

  initialize(_parent: GameObject): void;

  update(_time: Ticker): void;
}

// class ExampleComponent implements IComponent {
//   active: boolean;
//
//   _parent: GameObject;
//
//   constructor(parent: GameObject) {
//     this.active = true;
//     this._parent = parent;
//   }
//
//
//   initialize(): void {
//     throw new Error("Method not implemented.");
//   }
//
//   update(_time: Ticker): void {
//     throw new Error("Method not implemented.");
//   }
//
// }


/**
 * The Abstract class that define an game object in the game.
 * it come with an built-in component system which allow to inject specific game object without needing to
 * create inheritance type of approach. It can also be added and removed on the fly which could be used for behaviourals or
 * special effects
 */
export abstract class GameObject extends Container {

  private _components: IComponent[] = []; // allow us to get a fast checkup for update etc.
  private _componentsMap: Map<string, IComponent> = new Map(); // allow for fast lookup and references.

  public get active(): boolean {
    return this.visible;
  }

  public set active(value: boolean) {
    this.visible = value;
  }

  constructor() {
    super();
  }

  // called upon the scene is initialized.
  public initialize(): void {
    if (this._components.length > 0) {
      for (const component of this._components) {
        component.initialize(this);
      }
    }
  }

  public get components() {
    return this._components;
  }

  public addComponent(id: string, component: IComponent) {
    if (this._componentsMap.has(id))
      throw new Error("Component '" + id + "'already exist");

    this._components.push(component);
    this._componentsMap.set(id, component);
  }

  public getComponent<T extends IComponent>(id: string): T {
    if (!this._componentsMap.has(id))
      throw new Error("Component '" + id + "'does not exist");
    return this._componentsMap.get(id) as T;
  }

  public update(_time: Ticker) {
    if (this._components.length > 0) {
      for (const component of this._components) {
        if (component.active) {
          component.update(_time);
        }
      }
    }
  }

}
