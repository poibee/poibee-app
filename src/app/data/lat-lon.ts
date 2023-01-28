export class LatLon {
  constructor(public readonly lat: number, public readonly lon: number) {}

  static ofPosition(position: string): LatLon {
    const positionParts = position.split(',');
    const latTemp = Number.parseFloat(positionParts[0]);
    const lonTemp = Number.parseFloat(positionParts[1]);
    return positionParts.length == 2 && latTemp && lonTemp ? new LatLon(latTemp, lonTemp) : undefined;
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
