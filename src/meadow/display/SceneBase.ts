import {Assets, Container} from "pixi.js";
import {IScene} from "meadow.js";


export abstract class SceneBase extends Container implements IScene {

  isPaused: boolean;

  constructor() {
    super();
    this.isPaused = false;
  }

  preload(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  start(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  pause(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  resume(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  resize?(): void {
    throw new Error("Method not implemented.");
  }

  update(): void {
    throw new Error("Method not implemented.");
  }

  terminate?(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  hide?(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  protected queue(alias: string, url: string){
    Assets.add({alias, url});
  }


}
