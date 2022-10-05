import {LatLon} from "./lat-lon";

export class SearchAttributes {

  constructor(
    public readonly position: LatLon,
    public readonly distance: number,
    public readonly category: string,
  ) {
  }
}

export const INITIAL_SEARCH_ATTRIBUTES = new SearchAttributes(new LatLon(52.908, 8.588), 1000, 'restaurant');
