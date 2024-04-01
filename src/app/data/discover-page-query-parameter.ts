import {LatLon} from "./lat-lon";

export interface DiscoverPageQueryParameter {
  distance: number;
  category: string;
  position: LatLon;
}
