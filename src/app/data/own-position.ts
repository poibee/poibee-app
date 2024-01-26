import {LatLon} from './lat-lon';
import {DirectionTypes} from './direction';

export class OwnPosition {

  constructor(
    public readonly coordinates: LatLon,
    public readonly distance: number,
    public readonly direction: DirectionTypes,
  ) {
  }

}
