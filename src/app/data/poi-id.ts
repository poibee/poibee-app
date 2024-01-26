export class PoiId {

  static of(id: string): PoiId {
    const parts = id.split('-');
    return new PoiId(parts[0], parts[1]);
  }

  static ofOsm(id: string): PoiId {
    const parts = id.split('/');
    return new PoiId(parts[0], parts[1]);
  }

  isNode(): boolean {
    return this.type == 'node';
  }

  isWay(): boolean {
    return this.type == 'way';
  }

  isRelation(): boolean {
    return this.type == 'relation';
  }

  toOsm(): string {
    return `${this.type}/${this.id}`;
  }

  toString(): string {
    return `${this.type}-${this.id}`;
  }

  public equals(obj: PoiId): boolean {
    return obj && this.toString() === obj.toString();
  }

  private constructor(public readonly type: string, public readonly id: string) {}

}
