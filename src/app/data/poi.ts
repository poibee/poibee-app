import {LatLon} from "./lat-lon";

export class Poi {

  constructor(
    public readonly id: string,
    public readonly category: string,
    public readonly name: string,
    public readonly coordinates: LatLon,
    public readonly tags: Record<string, string>
  ) {
  }

}
