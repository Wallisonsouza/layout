export type Vec2 = { x: number, y: number };
import type { KeyCode } from "./KeyCode";

export class Input {
  private static key = new Map<string, boolean>();
  private static keyDown = new Map<string, boolean>();
  private static keyUp = new Map<string, boolean>();

  private static button = new Map<number, boolean>();
  private static buttonDown = new Map<number, boolean>();
  private static buttonUp = new Map<number, boolean>();

  private static position: Vec2 = { x: 0, y: 0 };
  private static movement: Vec2 = { x: 0, y: 0 };
  private static scrollDelta: Vec2 = { x: 0, y: 0 };
  private static scrollCallback: ((delta: Vec2) => void) | null = null;

  private static target: HTMLElement;

  public static initialize(target: HTMLElement) {
    this.target = target;
    this.enable();
  }

  private static onKeyDown = (e: KeyboardEvent) => {
    if (!this.key.get(e.code)) {
      this.key.set(e.code, true);
      this.keyDown.set(e.code, true);
    }
  };

  private static onKeyUp = (e: KeyboardEvent) => {
    this.key.set(e.code, false);
    this.keyUp.set(e.code, true);
  };

  private static onMouseDown = (e: MouseEvent) => {
    if (!this.button.get(e.button)) {
      this.button.set(e.button, true);
      this.buttonDown.set(e.button, true);
    }
  };

  private static onMouseUp = (e: MouseEvent) => {
    this.button.set(e.button, false);
    this.buttonUp.set(e.button, true);
  };

  private static onMouseMove = (e: MouseEvent) => {
    const rect = this.target.getBoundingClientRect();
    this.position = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.movement = { x: e.movementX, y: e.movementY }
  };

  private static onWheel = (e: WheelEvent) => {
    this.scrollDelta = { x: e.deltaX, y: e.deltaY };
    if (this.scrollCallback) this.scrollCallback(this.scrollDelta);
  };

  public static enable() {
    if (!this.target) throw new Error("Input target não inicializado. Use Input.initialize(canvas).");

    this.target.addEventListener("mouseout", () => this.clear());
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
    this.target.addEventListener("mousedown", this.onMouseDown);
    this.target.addEventListener("mouseup", this.onMouseUp);
    this.target.addEventListener("mousemove", this.onMouseMove);
    this.target.addEventListener("wheel", this.onWheel);
    this.target.focus();
  }

  public static disable() {
    if (!this.target) return;

    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
    this.target.removeEventListener("mousedown", this.onMouseDown);
    this.target.removeEventListener("mouseup", this.onMouseUp);
    this.target.removeEventListener("mousemove", this.onMouseMove);
    this.target.removeEventListener("wheel", this.onWheel);
    this.clear();
  }

  public static getKey(code: KeyCode) { return this.key.get(code) ?? false; }
  public static getKeyDown(code: KeyCode) { return this.keyDown.get(code) ?? false; }
  public static getKeyUp(code: KeyCode) { return this.keyUp.get(code) ?? false; }

  public static getMouseButton(button: number) { return this.button.get(button) ?? false; }
  public static getMouseButtonDown(button: number) { return this.buttonDown.get(button) ?? false; }
  public static getMouseButtonUp(button: number) { return this.buttonUp.get(button) ?? false; }

  public static getMousePosition(): Vec2 { return this.position; }
  public static getMouseMovement(): Vec2 { return this.movement; }
  public static getScrollDelta(): Vec2 { return this.scrollDelta; }

  public static onMouseScroll(callback: (delta: Vec2) => void) {
    this.scrollCallback = callback;
  }

  public static clear() {
    this.keyDown.clear();
    this.keyUp.clear();
    this.buttonDown.clear();
    this.buttonUp.clear();
    this.movement = { x: 0, y: 0 };
    this.scrollDelta = { x: 0, y: 0 };
  }
}
