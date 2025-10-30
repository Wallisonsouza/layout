type Rect = { x: number; y: number; width: number; height: number };

class Mathf {
  static clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
  static lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
}

enum DragMode { None, Move, Resize }

interface LayoutPreset { id: string; name: string; slots: LayoutSlot[]; }


interface LayoutSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  alignDirection?: 'horizontal' | 'vertical';
  windows?: WindowNode[];
}

type SizeMode = 'fill' | 'preserve';

class WindowNode {
  id: string;
  title: string;
  element: HTMLDivElement;
  rect: Rect;
  animTarget?: Rect;
  animSpeed = 0.22;
  minimized = false;
  prevRect?: Rect;
  widthMode: SizeMode = 'fill';
  heightMode: SizeMode = 'fill';

  constructor(id: string, title: string, rect: Rect, widthMode: SizeMode = 'fill', heightMode: SizeMode = 'fill') {
    this.id = id;
    this.title = title;
    this.rect = { ...rect };
    this.widthMode = widthMode;
    this.heightMode = heightMode;
    this.element = this._createElement();
    this.updatePosition();
  }

  updatePosition() {
    const e = this.element.style;
    e.left = `${this.rect.x}px`;
    e.top = `${this.rect.y}px`;
    e.width = `${this.rect.width}px`;
    e.height = `${this.rect.height}px`;
  }

  private _createElement() {
    const win = document.createElement('div');
    win.className = 'window';
    win.id = this.id;
    win.innerHTML = `
      <div class="titlebar">
        <span class="title">${this.title}</span>
        <div class="controls">
          <button class="min">_</button>
          <button class="max">□</button>
          <button class="close">×</button>
        </div>
      </div>
      <div class="content">Conteúdo da janela</div>
    `;
    document.getElementById('desktop')!.appendChild(win);
    return win;
  }
}


class LayoutManager {
  windows: WindowNode[] = [];
  focused?: WindowNode;
  dragState?: { node: WindowNode; mode: DragMode; startMouse: { x: number, y: number }; startRect: Rect; offset: { x: number, y: number } };
  configKey = 'layout_manager_html_v5';
  animationRequest = 0;

  layouts: LayoutPreset[] = [];
  layoutSelecionado: LayoutPreset;
  previewEl: HTMLDivElement;

  constructor() {
    this._initLayouts();
    this.layoutSelecionado = this.layouts[1]; // quadrants
    this.previewEl = this._createPreviewElement();
    this._wireGlobalMouse();
    this.loop();
  }

  private _initLayouts() {
    this.layouts = [
      {
        id: "half",
        name: "Metade (esq/dir)",
        slots: [
          { id: "left", x: 0, y: 0, width: 0.5, height: 1, windows: [] },
          { id: "right", x: 0.5, y: 0, width: 0.5, height: 1, windows: [] },
        ]
      },
      {
        id: "quadrants",
        name: "4 Quadrantes",
        slots: [
          { id: "tl", x: 0, y: 0, width: 0.5, height: 0.5, windows: [] },
          { id: "tr", x: 0.5, y: 0, width: 0.5, height: 0.5, windows: [] },
          { id: "bl", x: 0, y: 0.5, width: 0.5, height: 0.5, windows: [] },
          { id: "br", x: 0.5, y: 0.5, width: 0.5, height: 0.5, windows: [] },
        ]
      },
      {
        id: "triple",
        name: "3 Colunas",
        slots: [
          { id: "left", x: 0, y: 0, width: 0.33, height: 1, windows: [] },
          { id: "center", x: 0.33, y: 0, width: 0.34, height: 1, windows: [] },
          { id: "right", x: 0.67, y: 0, width: 0.33, height: 1, windows: [] },
        ]
      },
      {
        id: "unity_top_bar",
        name: "Barra Superior (Unity)",
        slots: [
          { id: "topbar", x: 0, y: 0, width: 1, height: 0.08, windows: [] },
          { id: "left_panel", x: 0, y: 0.08, width: 0.25, height: 0.92, windows: [] },
          { id: "main_area", x: 0.25, y: 0.08, width: 0.5, height: 0.92, windows: [] },
          { id: "right_panel", x: 0.75, y: 0.08, width: 0.25, height: 0.92, windows: [] },
        ]
      },
      {
        id: "unity_left_bar",
        name: "Painel Lateral Esquerdo",
        slots: [
          { id: "toolbar", x: 0, y: 0, width: 0.08, height: 1, windows: [] },
          { id: "main_area", x: 0.08, y: 0, width: 0.92, height: 1, windows: [] },
        ]
      },
      {
        id: "unity_bottom_console",
        name: "Console Inferior",
        slots: [
          { id: "main_area", x: 0, y: 0, width: 1, height: 0.7, windows: [] },
          { id: "console", x: 0, y: 0.7, width: 1, height: 0.3, windows: [] },
        ]
      },
      {
        id: "unity_editor_mix",
        name: "Editor Completo",
        slots: [
          { id: "topbar", x: 0, y: 0, width: 1, height: 0.08, windows: [] },
          { id: "left_panel", x: 0, y: 0.08, width: 0.2, height: 0.72, windows: [] },
          { id: "scene_view", x: 0.2, y: 0.08, width: 0.6, height: 0.72, windows: [] },
          { id: "right_panel", x: 0.8, y: 0.08, width: 0.2, height: 0.72, windows: [] },
          { id: "bottom_panel", x: 0, y: 0.8, width: 1, height: 0.2, windows: [] },
        ]
      },
      {
        id: "vs_code_style",
        name: "IDE (Estilo VSCode)",
        slots: [
          { id: "activity_bar", x: 0, y: 0, width: 0.05, height: 1, windows: [] },
          { id: "sidebar", x: 0.05, y: 0, width: 0.2, height: 1, windows: [] },
          { id: "editor", x: 0.25, y: 0, width: 0.55, height: 0.85, windows: [] },
          { id: "terminal", x: 0.25, y: 0.85, width: 0.55, height: 0.15, windows: [] },
          { id: "right_sidebar", x: 0.8, y: 0, width: 0.2, height: 1, windows: [] },
        ],
      },
    ];
  }

  private _createPreviewElement() {
    const preview = document.createElement('div');
    preview.id = 'snap-preview';
    preview.style.position = 'fixed';
    preview.style.background = 'rgba(0,120,215,0.28)';
    preview.style.border = '2px solid rgba(0,120,215,0.55)';
    preview.style.pointerEvents = 'none';
    preview.style.transition = 'opacity 0.12s';
    preview.style.opacity = '0';
    preview.style.zIndex = '99999';
    document.body.appendChild(preview);
    return preview;
  }

  addWindow(node: WindowNode) {
    node.element.style.zIndex = (this.windows.length + 1).toString();
    this.windows.push(node);
    this._wireWindowEvents(node);
    if (this.layoutSelecionado) {
      this.applyLayout(this.layoutSelecionado.id);
    }
  }

  bringToFront(node: WindowNode) {
    const maxZ = Math.max(...this.windows.map(w => parseInt(w.element.style.zIndex || '0')), 0);
    node.element.style.zIndex = (maxZ + 1).toString();
    this.focused = node;
  }

  private _wireWindowEvents(node: WindowNode) {
    const titlebar = node.element.querySelector('.titlebar') as HTMLDivElement;
    const minBtn = node.element.querySelector('.min') as HTMLButtonElement;
    const maxBtn = node.element.querySelector('.max') as HTMLButtonElement;
    const closeBtn = node.element.querySelector('.close') as HTMLButtonElement;

    titlebar.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.dragState = {
        node,
        mode: DragMode.Move,
        startMouse: { x: e.clientX, y: e.clientY },
        startRect: { ...node.rect },
        offset: { x: e.clientX - node.rect.x, y: e.clientY - node.rect.y }
      };
      this.bringToFront(node);
    });

    minBtn.addEventListener('click', e => { e.stopPropagation(); this.toggleMinimize(node); });
    maxBtn.addEventListener('click', e => { e.stopPropagation(); this.toggleMaximize(node); });
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      node.element.style.display = 'none';
      this._removeWindowFromSlots(node);
      this.windows = this.windows.filter(w => w !== node);
    });
  }

  applyLayout(layoutId: string) {
    const layout = this.layouts.find(l => l.id === layoutId);
    if (!layout) return;
    this.layoutSelecionado = layout;

    // limpar janelas de todos os slots
    for (const s of layout.slots) s.windows = [];

    // distribuir janelas existentes
    for (let i = 0; i < this.windows.length; i++) {
      const w = this.windows[i];
      const s = layout.slots[i % layout.slots.length];
      s.windows!.push(w);
    }

    // redistribuir todas as janelas
    for (const s of layout.slots) this._updateSlotWindows(s);
  }

  private _handleSnap(mx: number, my: number, node: WindowNode) {
    const slot = this._getClosestSlot(mx, my, node);
    if (!slot) return;

    // remover node de qualquer slot anterior
    this._removeWindowFromSlots(node);

    // adicionar ao novo slot
    if (!slot.windows) slot.windows = [];
    slot.windows.push(node);
    this._updateSlotWindows(slot);
  }

  private _updateSlotWindows(slot: LayoutSlot) {
    if (!slot.windows || slot.windows.length === 0) return;

    const W = window.innerWidth, H = window.innerHeight;
    const count = slot.windows.length;
    const isHorizontal = slot.width >= slot.height;

    for (let i = 0; i < count; i++) {
      const w = slot.windows[i];
      let winX = W * slot.x;
      let winY = H * slot.y;
      let winWidth = W * slot.width;
      let winHeight = H * slot.height;

      if (isHorizontal) winWidth = (W * slot.width) / count;
      else winHeight = (H * slot.height) / count;

      // aplicar preservação de tamanho
      if (w.widthMode === 'preserve') winWidth = Math.min(winWidth, w.rect.width);
      if (w.heightMode === 'preserve') winHeight = Math.min(winHeight, w.rect.height);

      if (isHorizontal) winX += i * ((w.widthMode === 'fill') ? winWidth : 0);
      else winY += i * ((w.heightMode === 'fill') ? winHeight : 0);

      w.animTarget = {
        x: Math.round(winX),
        y: Math.round(winY),
        width: Math.round(winWidth),
        height: Math.round(winHeight)
      };
    }
  }

  private _removeWindowFromSlots(node: WindowNode) {
    for (const s of this.layoutSelecionado!.slots) {
      if (s.windows) {
        const idx = s.windows.indexOf(node);
        if (idx !== -1) {
          s.windows.splice(idx, 1);
          this._updateSlotWindows(s);
        }
      }
    }
  }

  toggleMinimize(node: WindowNode) {
    if (!node.minimized) {
      node.prevRect = { ...node.rect };
      node.minimized = true;
      node.animTarget = { x: node.rect.x, y: node.rect.y, width: node.rect.width, height: 28 };
    } else {
      node.minimized = false;
      if (node.prevRect) node.animTarget = { ...node.prevRect };
    }
  }

  toggleMaximize(node: WindowNode) {
    if (node.animTarget && Math.abs(node.animTarget.width - window.innerWidth) < 1) {
      if (node.prevRect) node.animTarget = { ...node.prevRect };
    } else {
      node.prevRect = { ...node.rect };
      node.animTarget = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
    }
  }

  private _getClosestSlot(mx: number, my: number, excludeNode?: WindowNode): LayoutSlot | null {
    if (!this.layoutSelecionado) return null;
    const W = window.innerWidth, H = window.innerHeight;
    const influence = 80;
    let closest: LayoutSlot | null = null;
    let minDist = Infinity;

    for (const slot of this.layoutSelecionado.slots) {
      const rect = { x: W * slot.x, y: H * slot.y, width: W * slot.width, height: H * slot.height };
      const dx = Math.max(rect.x - mx, 0, mx - (rect.x + rect.width));
      const dy = Math.max(rect.y - my, 0, my - (rect.y + rect.height));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist && dist < influence) {
        minDist = dist;
        closest = slot;
      }
    }

    return closest;
  }

  private _updateSnapPreview(mx: number, my: number) {
    const slot = this._getClosestSlot(mx, my);
    if (!slot) {
      this.previewEl.style.opacity = '0';
      return;
    }

    const W = window.innerWidth, H = window.innerHeight;
    this.previewEl.style.opacity = '1';
    this.previewEl.style.left = `${W * slot.x}px`;
    this.previewEl.style.top = `${H * slot.y}px`;
    this.previewEl.style.width = `${W * slot.width}px`;
    this.previewEl.style.height = `${H * slot.height}px`;
  }


  private _wireGlobalMouse() {
    window.addEventListener('mousemove', (e) => {
      if (!this.dragState) return;
      const s = this.dragState;
      const dx = e.clientX - s.startMouse.x;
      const dy = e.clientY - s.startMouse.y;
      s.node.rect.x = s.startRect.x + dx;
      s.node.rect.y = s.startRect.y + dy;
      s.node.updatePosition();
      this._updateSnapPreview(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', (e) => {
      if (!this.dragState) return;
      const node = this.dragState.node;
      this._handleSnap(e.clientX, e.clientY, node);
      this.dragState = undefined;
      this.previewEl.style.opacity = '0';
    });
  }

  updateAnimations() {
    for (const w of this.windows) {
      if (w.animTarget) {
        w.rect.x = Mathf.lerp(w.rect.x, w.animTarget.x, w.animSpeed);
        w.rect.y = Mathf.lerp(w.rect.y, w.animTarget.y, w.animSpeed);
        w.rect.width = Mathf.lerp(w.rect.width, w.animTarget.width, w.animSpeed);
        w.rect.height = Mathf.lerp(w.rect.height, w.animTarget.height, w.animSpeed);

        if (
          Math.abs(w.rect.x - w.animTarget.x) < 0.5 &&
          Math.abs(w.rect.y - w.animTarget.y) < 0.5 &&
          Math.abs(w.rect.width - w.animTarget.width) < 0.5 &&
          Math.abs(w.rect.height - w.animTarget.height) < 0.5
        ) {
          w.rect = { ...w.animTarget };
          w.animTarget = undefined;
        }
        w.updatePosition();
      }
    }
  }

  loop() {
    const tick = () => {
      this.updateAnimations();
      this.animationRequest = requestAnimationFrame(tick);
    };
    this.animationRequest = requestAnimationFrame(tick);
  }

  saveLayout() {
    const data = this.windows.map(w => ({ id: w.id, title: w.title, rect: w.rect, minimized: w.minimized }));
    localStorage.setItem(this.configKey, JSON.stringify(data));
  }

  restoreLayout() {
    const raw = localStorage.getItem(this.configKey);
    if (!raw) return;
    try {
      const arr = JSON.parse(raw);
      const desktop = document.getElementById('desktop')!;
      desktop.innerHTML = '';
      this.windows = [];
      for (const it of arr) {
        const w = new WindowNode(it.id, it.title, it.rect);
        w.minimized = it.minimized;
        this.addWindow(w);
      }
    } catch (e) { console.warn('restore failed', e); }
  }
}

// ----------------- bootstrap / UI -----------------
function main() {
  if (!document.getElementById('toolbar')) {
    const tool = document.createElement('div');
    tool.id = 'toolbar';
    tool.innerHTML = `
      <select id="layout-select" style="margin-right:8px"></select>
      <button id="add">Adicionar Janela</button>
      <button id="save">Salvar</button>
      <button id="restore">Restaurar</button>
      <button id="clear">Limpar</button>
    `;
    document.body.appendChild(tool);
  }

  if (!document.getElementById('desktop')) {
    const d = document.createElement('div');
    d.id = 'desktop';
    d.style.position = 'relative';
    d.style.width = '100vw';
    d.style.height = '100vh';
    d.style.overflow = 'hidden';
    d.style.background = '#1e1e1e';
    document.body.appendChild(d);
  }

  const manager = new LayoutManager();

  const select = document.getElementById('layout-select') as HTMLSelectElement;
  manager.layouts.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = l.name;
    select.appendChild(opt);
  });
  select.onchange = () => manager.applyLayout(select.value);

  (document.getElementById('add') as HTMLButtonElement).onclick = () => {
    const id = `win-${Date.now()}`;
    const w = new WindowNode(id, `Janela ${manager.windows.length + 1}`, {
      x: 60 + Math.random() * 200, y: 60 + Math.random() * 200,
      width: 260 + Math.random() * 240, height: 140 + Math.random() * 200
    });
    manager.addWindow(w);
  };

  (document.getElementById('save') as HTMLButtonElement).onclick = () => { manager.saveLayout(); alert('Layout salvo'); };
  (document.getElementById('restore') as HTMLButtonElement).onclick = () => { manager.restoreLayout(); alert('Layout restaurado'); };
  (document.getElementById('clear') as HTMLButtonElement).onclick = () => { localStorage.removeItem(manager.configKey); alert('Layout limpo'); };

  if (manager.windows.length === 0) {
    manager.addWindow(new WindowNode('win-1', 'Janela A', { x: 60, y: 60, width: 360, height: 240 }));
    manager.addWindow(new WindowNode('win-2', 'Janela B', { x: 440, y: 120, width: 320, height: 200 }));
    manager.addWindow(new WindowNode('win-3', 'Console', { x: 120, y: 340, width: 640, height: 180 }));
    manager.addWindow(new WindowNode('win-3', 'Console', { x: 120, y: 340, width: 640, height: 180 }));

  }
}

window.onload = main;
