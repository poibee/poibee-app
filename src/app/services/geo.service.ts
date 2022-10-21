import {Injectable} from '@angular/core';
import {LatLng} from "leaflet";

import {LatLon} from "../data/lat-lon";

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  distanceToPositionInKm(thisPosition: LatLon, otherPosition: LatLon): number {
    let latLngThisPosition = new LatLng(thisPosition.lat, thisPosition.lon);
    let latLngOtherPosition = new LatLng(otherPosition.lat, otherPosition.lon);
    let distanceInKm = latLngThisPosition.distanceTo(latLngOtherPosition) / 1000;
    let number = Math.round(distanceInKm * 100) / 100;
    return number;
  }

}
