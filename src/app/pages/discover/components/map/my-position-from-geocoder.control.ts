import {LatLon} from '../../../../data/lat-lon';
import {Map} from 'leaflet';
import {Geocoder} from 'leaflet-control-geocoder';

export class MyPositionFromGeocoderControl {

  constructor(private leafletMap: Map, private onUpdatePosition: (newPosition: LatLon) => void) {
    const onUpdatePositionLocal = (pos: LatLon) => this.onUpdatePosition(pos);
    new Geocoder({
      defaultMarkGeocode: false
    }).on('markgeocode', (e) => {
      onUpdatePositionLocal(new LatLon(e.geocode.center.lat, e.geocode.center.lng));
    }).addTo(this.leafletMap);
  }
}
