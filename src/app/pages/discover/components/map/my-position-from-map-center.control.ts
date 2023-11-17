import {PoimaniaLeafletControl} from "../my-position-map/poimania-leaflet.control";
import {LatLon} from "../../../../data/lat-lon";
import {LatLng, Map} from "leaflet";

export class MyPositionFromMapCenterControl extends PoimaniaLeafletControl {

  constructor(private leafletMap: Map, private onUpdatePosition: (newPosition: LatLon) => void) {
    super('Kartenmitte als Standort', 'svg/contract-outline.svg', () => this.updateMyPosition(), {position: 'topright'});
    this.addTo(this.leafletMap)
  }

  private updateMyPosition() {
    const center: LatLng = this.leafletMap.getCenter();
    this.onUpdatePosition(new LatLon(center.lat, center.lng));
  }
}
