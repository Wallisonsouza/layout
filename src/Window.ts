import type { Rect } from "./rect";

export class Entity {
  id: string = crypto.randomUUID();
}

export class WindowEntity extends Entity {
  title: string;
  animTarget?: Rect;
  animSpeed = 0.05;
  minimized = false;
  prevRect?: Rect;
  z: number = 0;
  rect: Rect;
  context?: HTMLElement;

  constructor(title: string, rect: Rect) {
    super();
    this.title = title;
    this.rect = rect;
  }
}