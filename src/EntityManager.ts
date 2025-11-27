import type { Entity } from "./Window";

export class EntityManager<T extends Entity> {

  private data: Map<string, T> = new Map();

  public add(w: T) {

    if (this.data.has(w.id)) return;

    this.data.set(w.id, w);
  }

  public get_iterator() {
    return this.data.values();
  }

  public get(id: string) {
    return this.data.get(id) ?? null;
  }
}