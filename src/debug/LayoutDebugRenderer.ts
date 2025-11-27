// import type { Project } from "../Project";

// export class LayoutDebugRenderer {
//   private canvas: HTMLCanvasElement;
//   private ctx: CanvasRenderingContext2D;
//   private container: HTMLElement;
//   private dpr = window.devicePixelRatio || 1;

//   enabled = true;

//   // ✅ ESTILO CENTRALIZADO (PROFISSIONAL)
//   style = {
//     gridColor: "#00aaff",
//     textColor: "#00ddff",
//     dash: [6, 6],
//     baseLineWidth: 1,
//     overlapBoost: 0.8,
//     font: "12px monospace",
//     highlightColor: "#ffaa00",
//   };

//   // ✅ SLOT ATIVO (PARA SNAP / DRAG)
//   activeSlotId?: string;

//   constructor(container: HTMLElement) {
//     this.container = container;

//     this.canvas = document.createElement("canvas");
//     this.canvas.style.position = "absolute";
//     this.canvas.style.inset = "0";
//     this.canvas.style.pointerEvents = "none";
//     this.canvas.style.zIndex = "9998";

//     container.appendChild(this.canvas);

//     const ctx = this.canvas.getContext("2d");
//     if (!ctx) throw new Error("Canvas 2D não suportado");
//     this.ctx = ctx;

//     this.resize();
//     window.addEventListener("resize", this.resize);
//   }

//   private resize = () => {
//     const w = this.container.clientWidth;
//     const h = this.container.clientHeight;

//     this.canvas.width = Math.round(w * this.dpr);
//     this.canvas.height = Math.round(h * this.dpr);

//     this.canvas.style.width = w + "px";
//     this.canvas.style.height = h + "px";

//     this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
//   };

//   render(project: Project, activeLayoutId?: string) {
//     if (!this.enabled || !activeLayoutId) {
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//       return;
//     }

//     const layout = project.layouts.get(activeLayoutId);
//     if (!layout) return;

//     const W = this.container.clientWidth;
//     const H = this.container.clientHeight;

//     this.ctx.clearRect(0, 0, W, H);

//     type LineKey = string;
//     const lines = new Map<LineKey, number>();

//     // ✅ COLETA INTELIGENTE DE BORDAS
//     for (const slot of layout.slots) {
//       const x1 = slot.rect.x * W;
//       const y1 = slot.rect.y * H;
//       const x2 = (slot.rect.x + slot.rect.width) * W;
//       const y2 = (slot.rect.y + slot.rect.height) * H;

//       const edges: [number, number, number, number][] = [
//         [x1, y1, x2, y1],
//         [x2, y1, x2, y2],
//         [x1, y2, x2, y2],
//         [x1, y1, x1, y2],
//       ];

//       for (const [a, b, c, d] of edges) {
//         const key = `${a},${b},${c},${d}`;
//         lines.set(key, (lines.get(key) ?? 0) + 1);
//       }
//     }

//     // ✅ DESENHO PROFISSIONAL DAS LINHAS
//     this.ctx.setLineDash(this.style.dash);

//     for (const [key, strength] of lines) {
//       const [x1, y1, x2, y2] = key.split(",").map(Number);

//       this.ctx.lineWidth =
//         this.style.baseLineWidth + strength * this.style.overlapBoost;

//       this.ctx.strokeStyle = this.style.gridColor;

//       this.ctx.beginPath();
//       this.ctx.moveTo(x1, y1);
//       this.ctx.lineTo(x2, y2);
//       this.ctx.stroke();
//     }

//     this.ctx.setLineDash([]);

//     // ✅ LABELS + HIGHLIGHT
//     this.ctx.font = this.style.font;

//     for (const slot of layout.slots) {
//       const x = slot.rect.x * W;
//       const y = slot.rect.y * H;
//       const w = slot.rect.width * W;
//       const h = slot.rect.height * H;

//       const isActive = slot.id === this.activeSlotId;

//       if (isActive) {
//         this.ctx.fillStyle = this.style.highlightColor + "22";
//         this.ctx.fillRect(x, y, w, h);

//         this.ctx.strokeStyle = this.style.highlightColor;
//         this.ctx.lineWidth = 2;
//         this.ctx.strokeRect(x, y, w, h);
//       }

//       this.ctx.fillStyle = this.style.textColor;
//       this.ctx.fillText(slot.id, x + 8, y + 16);
//     }
//   }

//   destroy() {
//     this.canvas.remove();
//     window.removeEventListener("resize", this.resize);
//   }
// }
