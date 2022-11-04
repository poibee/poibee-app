import {Injectable} from '@angular/core';
import {Icon} from 'leaflet';

// https://leafletjs.com/examples/custom-icons/
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  loadMarkerIcon(): Icon {
    return new Icon({
      iconUrl: 'assets/marker/marker-icon.png',
      shadowUrl: 'assets/marker/marker-shadow.png',
      iconSize: [25, 41],     // size of the icon
      shadowSize: [41, 41],   // size of the shadow
      iconAnchor: [12, 41],   // point of the icon which will correspond to markers location
      shadowAnchor: [12, 41], // the same for the shadow
      popupAnchor: [0, -33]   // point from which the popup should open relative to the iconAnchor
    })
  }

  loadSelectedMarkerIcon() {
    return new Icon({
      iconUrl: 'assets/marker/poi-selection-mask.png',
      iconSize: [32, 37],     // size of the icon
      iconAnchor: [16, 37],   // point of the icon which will correspond to markers location
      popupAnchor: [32, 20]   // point from which the popup should open relative to the iconAnchor
    })
  }

  loadCategoryIcon(category: string) {
    return new Icon({
      iconUrl: 'assets/category/' + category + '.png',
      shadowUrl: 'assets/pois-shadow.png',
      iconSize: [32, 37],     // size of the icon
      shadowSize: [51, 37],   // size of the shadow
      iconAnchor: [16, 37],   // point of the icon which will correspond to markers location
      shadowAnchor: [24, 37], // the same for the shadow
      popupAnchor: [32, 20]   // point from which the popup should open relative to the iconAnchor
    });
  }

}
