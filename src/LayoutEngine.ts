import type { LayoutSlot } from "./LayoutManager";
import type { Project } from "./Project";
import type { WindowEntity } from "./Window";

export class LayoutEngine {

  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  applyLayout(project: Project, layoutId: string) {
    const layout = project.layouts.get(layoutId);
    if (!layout) return;

    for (const s of layout.slots) {
      s.activeWindow = undefined;
      s.tabWindows = [];
    }

    const windows = Array.from(project.windows.get_iterator());

    for (let i = 0; i < windows.length; i++) {
      const w = windows[i];
      const s = layout.slots[i % layout.slots.length];

      if (!s.activeWindow) s.activeWindow = w;
      else {
        s.tabWindows ??= [];
        s.tabWindows.push(w);
      }
    }

    for (const s of layout.slots) {
      if (s.activeWindow) {
        this.updateSlotWindow(s, s.activeWindow);
      }
    }
  }


  processDrop(
    project: Project,
    layoutId: string,
    win: WindowEntity,
    x: number,
    y: number
  ) {
    const layout = project.layouts.get(layoutId);
    if (!layout) return;

    const slot = this.getSlotAtPoint(layout.slots, x, y);

    if (!slot) {
      this.detachFromSlots(layout.slots, win);
      return;
    }

    this.detachFromSlots(layout.slots, win);

    if (!slot.activeWindow) {
      slot.activeWindow = win;
      this.updateSlotWindow(slot, win);
      return;
    }

    slot.tabWindows ??= [];

    if (slot.activeWindow !== win && !slot.tabWindows.includes(win)) {
      slot.tabWindows.push(win);
    }

    this.updateSlotWindow(slot, slot.activeWindow);
  }



  private getSlotAtPoint(slots: LayoutSlot[], x: number, y: number): LayoutSlot | null {

    const rect = this.container.getBoundingClientRect();

    const W = rect.width - rect.x;
    const H = this.container.clientHeight;

    for (const s of slots) {
      const rx = s.rect.x * W;
      const ry = s.rect.y * H;
      const rw = s.rect.width * W;
      const rh = s.rect.height * H;

      if (
        x >= rx &&
        x <= rx + rw &&
        y >= ry &&
        y <= ry + rh
      ) {
        return s;
      }
    }

    return null;
  }

  // ✅ REMOVE JANELA DE TODOS OS SLOTS
  private detachFromSlots(slots: LayoutSlot[], win: WindowEntity) {
    for (const s of slots) {
      if (s.activeWindow === win) {
        s.activeWindow = undefined;
      }

      if (s.tabWindows) {
        const i = s.tabWindows.indexOf(win);
        if (i !== -1) s.tabWindows.splice(i, 1);
      }
    }
  }

  private updateSlotWindow(slot: LayoutSlot, node: WindowEntity) {
    const rect = this.container.getBoundingClientRect();

    const W = rect.width;
    const H = rect.height;

    node.rect = {
      x: Math.round(W * slot.rect.x),
      y: Math.round(H * slot.rect.y),
      width: Math.round(W * slot.rect.width),
      height: Math.round(H * slot.rect.height)
    };
  }

}
