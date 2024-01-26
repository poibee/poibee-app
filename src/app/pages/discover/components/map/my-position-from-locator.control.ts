import {PoimaniaLeafletControl} from '../my-position-map/poimania-leaflet.control';
import {ErrorEvent, LocationEvent, Map} from 'leaflet';
import {LatLon} from '../../../../data/lat-lon';
import {ToastController} from '@ionic/angular';

export class MyPositionFromLocatorControl extends PoimaniaLeafletControl {

  constructor(private leafletMap: Map, private toastController: ToastController, private onUpdatePosition: (newPosition: LatLon) => void) {
    super('Standort lokalisieren', 'svg/aperture-sharp.svg', () => this.myPositionLocate(), {position: 'topright'});
    this.addTo(this.leafletMap);
  }

  private myPositionLocate() {
    this.leafletMap.locate({}).on('locationfound', (e: LocationEvent) => {
      const myPosition = new LatLon(e.latlng.lat, e.latlng.lng);
      this.onUpdatePosition(myPosition);
    }).on('locationerror', (err: ErrorEvent) => {
      const message: string = err.message;
      const toast: Promise<HTMLIonToastElement> = this.toastController.create({
        header: 'Fehler bei Standort-Ermittlung',
        message,
        position: 'bottom',
        duration: 3000,
        buttons: [{text: 'Ok', role: 'cancel'}]
      });
      toast.then(t => t.present());
    });
  }
}
