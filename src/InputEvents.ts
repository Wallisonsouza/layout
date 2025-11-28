import type { Vec2 } from "./input/Input";

export class InputEventDispacher {
  public onMouseMove?: (win: Vec2) => void;
  public onMouseButtonClick?: (code: number) => void;

  constructor() {
    window.addEventListener("mouseup", (e) => {
      this.onMouseButtonClick?.(e.button);
    });

    window.addEventListener("mousemove", (e) => {
      this.onMouseMove?.({ x: e.clientX, y: e.clientY });
    })
  }
}