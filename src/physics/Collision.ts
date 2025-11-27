import type { Project } from "../Project";
import type { WindowEntity } from "../Window";

import { AABB } from "./AABB";
import { SpatialHash } from "./SpatialHash";

export class Collision {
  private static spatial: SpatialHash<WindowEntity> = new SpatialHash(64);
  private static buffer: WindowEntity[] = [];

  public static update(project: Project) {
    this.spatial.clear();

    for (const entity of project.windows.get_iterator()) {
      this.spatial.insert(entity);
    }
  }

  public static mouseHitTest(
    mouseX: number,
    mouseY: number
  ): WindowEntity | null {
    this.spatial.query(mouseX, mouseY, this.buffer);

    let top: WindowEntity | null = null;

    for (const win of this.buffer) {
      if (AABB.containsPoint(win.rect, mouseX, mouseY)) {
        if (!top || (win.z ?? 0) > (top.z ?? 0)) {
          top = win;
        }
      }
    }

    return top;
  }

}
