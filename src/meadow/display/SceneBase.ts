import {Assets, Container} from "pixi.js";
import {IScene} from "meadow.js";


export abstract class SceneBase extends Container implements IScene {

  isPaused: boolean;

  constructor() {
    super();
    this.isPaused = false;
  }

  async preload(): Promise<void> {
    console.log("preload");
  }

  async create(): Promise<void> {
    console.log("create");
  }

  async start(): Promise<void> {
    console.log("start");
  }

  async pause(): Promise<void> {
    console.log("pause");
  }

  async resume(): Promise<void> {
    console.log("resume");
    this.isPaused = false;
  }

  resize?(): void {
    throw new Error("Method not implemented.");
  }

  update(): void {
    console.log("update");
  }

  async terminate(): Promise<void> {
    for (const child of this.children) {
      child.destroy({children: true});
    }
  }

  hide?(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  protected queue(alias: string, url: string){
    Assets.add({alias, url});
  }


}
