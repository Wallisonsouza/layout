export class Mathf {

  static clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

  static lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

  static distanceToRect(px: number, py: number, rect: { x: number, y: number, width: number, height: number }): number {
    const dx = Math.max(rect.x - px, 0, px - (rect.x + rect.width));
    const dy = Math.max(rect.y - py, 0, py - (rect.y + rect.height));
    return Math.sqrt(dx * dx + dy * dy);
  }

  static toLocalCoords(container: HTMLElement, x: number, y: number) {
    const rect = container.getBoundingClientRect();
    return {
      x: x - rect.left,
      y: y - rect.top
    };
  }

  static slotRectToPixels(container: HTMLElement, slotRect: { x: number; y: number; width: number; height: number }) {
    const W = container.clientWidth;
    const H = container.clientHeight;

    return {
      x: Math.round(slotRect.x * W),
      y: Math.round(slotRect.y * H),
      width: Math.round(slotRect.width * W),
      height: Math.round(slotRect.height * H)
    };
  }

  static slotRectToAbsolute(container: HTMLElement, slotRect: { x: number; y: number; width: number; height: number }) {
    const rect = container.getBoundingClientRect();
    const pixels = this.slotRectToPixels(container, slotRect);
    return {
      x: pixels.x + rect.left,
      y: pixels.y + rect.top,
      width: pixels.width,
      height: pixels.height
    };

  }
}