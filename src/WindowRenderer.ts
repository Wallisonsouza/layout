import type { Project } from "./Project";
import type { WindowEntity } from "./Window";

export class WindowRenderer {

  private static _windowsCache: Map<string, HTMLDivElement> = new Map();

  public static getWindowElement(id: string): HTMLDivElement | null {
    return this._windowsCache.get(id) || null;
  }

  public static createWindowElement(
    windowNode: WindowEntity,
    parent: HTMLElement
  ): HTMLDivElement {

    if (this._windowsCache.has(windowNode.id)) {
      return this._windowsCache.get(windowNode.id)!;
    }

    const win = document.createElement('div');
    win.className = 'window-container';
    win.id = windowNode.id;
    win.innerHTML = `
  <div class="window">

    <div class="titlebar">
      <span class="title">Minha Janela</span>

      <div class="controls">
        <button class="min">—</button>
        <button class="max">▢</button>
        <button class="close">✕</button>
      </div>
    </div>

    <div class="content">
      ${windowNode.context?.innerHTML}
    </div>

  </div>

    `;

    parent.appendChild(win);
    this._windowsCache.set(windowNode.id, win);
    return win;
  }

  static render(project: Project, parent: HTMLElement) {

    for (const w of project.windows.get_iterator()) {

      let el = WindowRenderer.getWindowElement(w.id);

      if (!el) {
        el = this.createWindowElement(w, parent);
      }

      el.style.left = `${Math.round(w.rect.x)}px`;
      el.style.top = `${Math.round(w.rect.y)}px`;
      el.style.width = `${Math.round(w.rect.width)}px`;
      el.style.height = `${Math.round(w.rect.height)}px`;
      el.style.zIndex = w.z.toString();
    }
  }
}
