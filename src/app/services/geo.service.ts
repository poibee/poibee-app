import {Injectable} from '@angular/core';
import {LatLng} from 'leaflet';

import {LatLon} from '../data/lat-lon';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  distanceToPositionInKm(thisPosition: LatLon, otherPosition: LatLon): number {
    const latLngThisPosition = new LatLng(thisPosition.lat, thisPosition.lon);
    const latLngOtherPosition = new LatLng(otherPosition.lat, otherPosition.lon);
    const distanceInKm = latLngThisPosition.distanceTo(latLngOtherPosition) / 1000;
    const number = Math.round(distanceInKm * 100) / 100;
    return number;
  }

}
