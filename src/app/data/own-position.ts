import {LatLon} from "./lat-lon";

export class OwnPosition {

  constructor(
    public readonly coordinates: LatLon,
    public readonly distance: number,
  ) {
  }

}
