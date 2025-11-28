import { DragSystem } from "./DragSystem";
import { Input } from "./input/Input";
import { InputEventDispacher } from "./InputEvents";
import { LayoutEngine } from "./LayoutEngine";
import { Collision } from "./physics/Collision";
import type { Project } from "./Project";
import { WindowRenderer } from "./WindowRenderer";

export class Runtime {

  readonly project: Project;
  readonly layoutEngine: LayoutEngine;
  readonly dragSystem: DragSystem;
  readonly container: HTMLElement;
  readonly InputEvents: InputEventDispacher;



  // readonly debugRenderer: LayoutDebugRenderer;

  private raf = 0;
  private activeLayout?: string;

  constructor(project: Project, container: HTMLElement) {
    this.project = project;
    this.container = container;

    this.layoutEngine = new LayoutEngine(container);
    this.dragSystem = new DragSystem(project, container);

    this.InputEvents = new InputEventDispacher();

    this.InputEvents.onMouseButtonClick = (_code) => {
      this.request_update_tick();
    }

    this.InputEvents.onMouseMove = (_pos) => {
      this.request_update_tick();
    }

    Input.initialize(container);
    // this.debugRenderer = new LayoutDebugRenderer(container);


    this.dragSystem.onDrop = (win, x, y) => {
      if (!this.activeLayout) return;
      this.layoutEngine.processDrop(this.project, this.activeLayout, win, x, y);
    };

    this.dragSystem.onDragMove = () => {

    }
  }

  applyLayout(id: string) {
    const layout = this.project.layouts.get(id);
    if (!layout) return;

    this.activeLayout = id;
    this.layoutEngine.applyLayout(this.project, id);
  }

  request_update_tick() {
    Collision.update(this.project);
    WindowRenderer.render(this.project, this.container);
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    this.dragSystem.destroy();
  }
}
