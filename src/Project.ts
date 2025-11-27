import { EntityManager } from "./EntityManager";
import type { LayoutPreset } from "./LayoutManager";
import type { WindowEntity } from "./Window";

export class Project {
  windows: EntityManager<WindowEntity> = new EntityManager();
  layouts: EntityManager<LayoutPreset> = new EntityManager();
}

