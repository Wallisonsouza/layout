import type { WindowEntity } from "../Window";

export class SpatialHash<T extends WindowEntity> {
  private invCellSize: number;
  private buckets: Map<number, T[]> = new Map();

  constructor(cellSize: number) {
    this.invCellSize = 1 / cellSize;
  }

  private hash(cx: number, cy: number): number {
    return cx * 73856093 ^ cy * 19349663;
  }

  clear() {
    for (const bucket of this.buckets.values()) {
      bucket.length = 0;
    }
  }

  insert(item: T) {
    const minX = Math.floor(item.rect.x * this.invCellSize);
    const minY = Math.floor(item.rect.y * this.invCellSize);
    const maxX = Math.floor((item.rect.x + (item.rect.width ?? 0)) * this.invCellSize);
    const maxY = Math.floor((item.rect.y + (item.rect.height ?? 0)) * this.invCellSize);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = this.hash(x, y);

        let bucket = this.buckets.get(key);
        if (!bucket) {
          bucket = [];
          this.buckets.set(key, bucket);
        }

        bucket.push(item);
      }
    }
  }

  query(x: number, y: number, out: T[] = []): T[] {
    out.length = 0;

    const cx = Math.floor(x * this.invCellSize);
    const cy = Math.floor(y * this.invCellSize);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = this.hash(cx + dx, cy + dy);
        const bucket = this.buckets.get(key);

        if (!bucket) continue;

        for (let i = 0; i < bucket.length; i++) {
          out.push(bucket[i]);
        }
      }
    }

    return out;
  }
}
