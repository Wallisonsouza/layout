import type { Rect } from "./rect";
import { Entity, type WindowEntity } from "./Window";

export class LayoutPreset extends Entity {
  name: string;
  slots: LayoutSlot[];

  constructor(name: string, slots: LayoutSlot[]) {
    super();
    this.name = name;
    this.slots = slots;
  }
}

export interface LayoutSlot extends Entity {
  id: string;
  rect: Rect;
  activeWindow?: WindowEntity;
  tabWindows?: WindowEntity[];
}