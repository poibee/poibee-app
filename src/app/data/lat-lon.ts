export class LatLon {
  constructor(public readonly lat: number, public readonly lon: number) {}

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
