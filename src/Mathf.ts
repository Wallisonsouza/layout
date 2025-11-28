import type { Rect } from "./rect";

export class Mathf {

  static clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

  static lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

  static distanceToRect(px: number, py: number, rect: { x: number, y: number, width: number, height: number }): number {
    const dx = Math.max(rect.x - px, 0, px - (rect.x + rect.width));
    const dy = Math.max(rect.y - py, 0, py - (rect.y + rect.height));
    return Math.sqrt(dx * dx + dy * dy);
  }

  static convert_rect_to_element_space(rect: Rect, element: HTMLElement): Rect {


    // dont use bounds offset let | right
    const bound = element.getBoundingClientRect();

    const W = bound.width;
    const H = bound.height;

    const leftOffset = element.offsetLeft;
    const rightOffset = element.offsetTop;

    return {
      x: Math.round(W * rect.x + leftOffset),
      y: Math.round(H * rect.y + rightOffset),
      width: Math.round(W * rect.width),
      height: Math.round(H * rect.height)
    };
  }
}