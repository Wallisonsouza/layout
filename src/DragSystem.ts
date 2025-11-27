import { Collision } from "./physics/Collision";
import type { Project } from "./Project";
import type { WindowEntity } from "./Window";

export class DragSystem {

  private project: Project;
  private container: HTMLElement;

  private dragging: {
    window: WindowEntity;
    offsetX: number;
    offsetY: number;
  } | null = null;


  public onDragStart?: (win: WindowEntity) => void;
  public onDragMove?: (win: WindowEntity) => void;
  public onDrop?: (win: WindowEntity, x: number, y: number) => void;

  constructor(project: Project, container: HTMLElement) {
    this.project = project;
    this.container = container;
    this.bind();
  }

  private bringToFront(win: WindowEntity) {
    let maxZ = 0;

    for (const w of this.project.windows.get_iterator()) {
      if (w.z > maxZ) maxZ = w.z;
    }

    win.z = maxZ + 1;
  }

  private bind() {
    this.container.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  }

  private onMouseDown = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = Collision.mouseHitTest(x, y);
    if (!hit) return;

    this.bringToFront(hit);

    this.dragging = {
      window: hit,
      offsetX: x - hit.rect.x,
      offsetY: y - hit.rect.y
    };

    this.onDragStart?.(hit);
  };


  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;

    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const win = this.dragging.window;

    win.rect = {
      ...win.rect,
      x: Math.round(x - this.dragging.offsetX),
      y: Math.round(y - this.dragging.offsetY)
    };

    this.onDragMove?.(win);
  };


  private onMouseUp = (e: MouseEvent) => {
    if (!this.dragging) return;

    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const win = this.dragging.window;

    this.dragging = null;

    this.onDrop?.(win, x, y);
  };

  destroy() {
    this.container.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  }
}
