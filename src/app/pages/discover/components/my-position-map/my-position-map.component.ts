import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Control, control, ErrorEvent, LatLng, LayerGroup, LocationEvent, Map, Marker, TileLayer} from "leaflet";
import {Geocoder} from "leaflet-control-geocoder";

import {ImageService} from "../../../../services/image.service";
import {ToastController} from "@ionic/angular";
import {PoimaniaLeafletControl} from "./poimania-leaflet.control";
import {LatLon} from "../../../../data/lat-lon";

const osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
const MAP_ZOOM = 13;

@Component({
  selector: 'app-my-position-map',
  templateUrl: './my-position-map.component.html',
  styleUrls: ['./my-position-map.component.scss'],
})
export class MyPositionMapComponent implements OnInit {

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('myPositionMap') myPositionMapContainer;
  showProgress: boolean;

  private myPositionMap: Map;
  private myPositionLayer: LayerGroup;
  private myPositionMarker: Marker;

  @Input() myPosition: LatLon;
  @Output() onUpdateMyPosition = new EventEmitter<LatLon>();

  constructor(
    private imageService: ImageService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.showProgress = true;
    this.sleep(500).then(() => {
      this.constructMap();
      this.showProgress = false;
    });
  }

  private constructMap() {
    this.myPositionLayer = new LayerGroup();
    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    const mapCenterAsLeaflet = this.myPosition.asLatLng();
    this.myPositionMap = new Map(this.myPositionMapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      center: mapCenterAsLeaflet,
      zoom: MAP_ZOOM,
      layers: [osmTileLayer, this.myPositionLayer]
    });
    new Control.Zoom({position: 'topleft'}).addTo(this.myPositionMap);
    new Control.Attribution({position: 'bottomleft'}).addTo(this.myPositionMap);
    this.myPositionMap.attributionControl.addAttribution(osmAttribution);
    control.scale().addTo(this.myPositionMap);

    this.myPositionMarker = new Marker(mapCenterAsLeaflet, {
      title: "Mein Standort",
      draggable: true,
      icon: this.imageService.loadMarkerIcon()
    });
    this.myPositionMarker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      this.updateMyPositionAndFlyToIt(new LatLon(position.lat, position.lng));
    });
    this.myPositionLayer.addLayer(this.myPositionMarker);

    const updateMyPositionAndFlyToItLocal = (pos) => this.updateMyPositionAndFlyToIt(pos);
    new Geocoder({
      defaultMarkGeocode: false
    }).on('markgeocode', function (e) {
      updateMyPositionAndFlyToItLocal(new LatLon(e.geocode.center.lat, e.geocode.center.lng));
    }).addTo(this.myPositionMap);

    const myPositionLocateLocal = () => this.myPositionLocate();
    new PoimaniaLeafletControl('Standort lokalisieren', 'svg/aperture-sharp.svg', myPositionLocateLocal, {position: 'topright'}).addTo(this.myPositionMap);

    const myPositionFromMapCenterLocal = () => this.myPositionFromMapCenter();
    new PoimaniaLeafletControl('Kartenmitte als Standort', 'svg/contract-outline.svg', myPositionFromMapCenterLocal, {position: 'topright'}).addTo(this.myPositionMap);
  }

  private myPositionLocate() {
    this.myPositionMap.locate({}).on('locationfound', (e: LocationEvent) => {
      const myPosition = new LatLon(e.latlng.lat, e.latlng.lng);
      this.updateMyPositionAndFlyToIt(myPosition);
    }).on('locationerror', (err: ErrorEvent) => {
      const message: string = err.message;
      const toast: Promise<HTMLIonToastElement> = this.toastController.create({
        header: 'Fehler bei Standort-Ermittlung',
        message: message,
        position: 'bottom',
        duration: 3000,
        buttons: [{text: 'Ok', role: 'cancel'}]
      });
      toast.then(t => t.present());
    });
  }

  private myPositionFromMapCenter() {
    const center: LatLng = this.myPositionMap.getCenter();
    this.updateMyPositionAndFlyToIt(new LatLon(center.lat, center.lng));
  }

  private updateMyPositionAndFlyToIt(myPosition: LatLon) {
    if (myPosition.lat != this.myPosition.lat || myPosition.lon != this.myPosition.lon) {
      this.myPosition = myPosition;
      this.myPositionMarker.setLatLng(myPosition.asLatLng());
      this.myPositionMap.flyTo(this.myPosition.asLatLng(), this.myPositionMap.getZoom());
      this.onUpdateMyPosition.emit(this.myPosition);
    }
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
