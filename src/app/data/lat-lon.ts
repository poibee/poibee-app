export class LatLon {
  constructor(public readonly lat: number, public readonly lon: number) {}

  static ofPosition(position: string): LatLon {
    const positionParts = position.split(',');
    return new LatLon(Number.parseInt(positionParts[0]), Number.parseInt(positionParts[1]));
  }

  asLatLng() {
    return {
      lat: this.lat,
      lng: this.lon
    }
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
