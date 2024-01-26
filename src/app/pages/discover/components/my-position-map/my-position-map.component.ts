import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Circle, Control, control, ErrorEvent, LatLng, LayerGroup, LocationEvent, Map, Marker, TileLayer} from 'leaflet';
import {Geocoder} from 'leaflet-control-geocoder';

import {ImageService} from '../../../../services/image.service';
import {ToastController} from '@ionic/angular';
import {PoimaniaLeafletControl} from './poimania-leaflet.control';
import {LatLon} from '../../../../data/lat-lon';
import {SearchDistance} from '../../../../data/search-distance';

const osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
const MAP_ZOOM = 13;

@Component({
  selector: 'app-my-position-map',
  templateUrl: './my-position-map.component.html',
  styleUrls: ['./my-position-map.component.scss'],
})
export class MyPositionMapComponent implements OnInit, OnChanges {

  @Input() searchDistance;
  @Input() myPosition: LatLon;
  @Output() updatedMyPosition = new EventEmitter<LatLon>();

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('myPositionMap') myPositionMapContainer;
  showProgress: boolean;

  private myPositionMap: Map;
  private myPositionLayer: LayerGroup;
  private myPositionMarker: Marker;
  private searchDistanceLayer: LayerGroup;

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

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSearchDistance();
  }

  private constructMap() {
    this.myPositionLayer = new LayerGroup();
    this.searchDistanceLayer = new LayerGroup();
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
      layers: [osmTileLayer, this.myPositionLayer, this.searchDistanceLayer]
    });
    new Control.Zoom({position: 'topleft'}).addTo(this.myPositionMap);
    new Control.Attribution({position: 'bottomleft'}).addTo(this.myPositionMap);
    this.myPositionMap.attributionControl.addAttribution(osmAttribution);
    control.scale().addTo(this.myPositionMap);

    this.myPositionMarker = new Marker(mapCenterAsLeaflet, {
      title: 'Mein Standort',
      draggable: true,
      icon: this.imageService.loadMarkerIcon()
    });
    this.myPositionMarker.on('dragend', (event) => {
      const position = event.target.getLatLng();
      this.updateMyPositionAndCenterMap(new LatLon(position.lat, position.lng));
    });
    this.myPositionLayer.addLayer(this.myPositionMarker);

    const updateMyPositionAndCenterMapLocal = (pos) => this.updateMyPositionAndCenterMap(pos);
    new Geocoder({
      defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
      updateMyPositionAndCenterMapLocal(new LatLon(e.geocode.center.lat, e.geocode.center.lng));
    }).addTo(this.myPositionMap);

    const myPositionLocateLocal = () => this.myPositionLocate();
    new PoimaniaLeafletControl('Standort lokalisieren', 'svg/aperture-sharp.svg', myPositionLocateLocal, {position: 'topright'}).addTo(this.myPositionMap);

    const myPositionFromMapCenterLocal = () => this.myPositionFromMapCenter();
    new PoimaniaLeafletControl('Kartenmitte als Standort', 'svg/contract-outline.svg', myPositionFromMapCenterLocal, {position: 'topright'}).addTo(this.myPositionMap);

    const zoomToSearchDistanceLocal = () => this.zoomToSearchDistance();
    new PoimaniaLeafletControl('Zoom zu Suchumkreis', 'svg/disc-sharp.svg', zoomToSearchDistanceLocal, {position: 'topleft'}).addTo(this.myPositionMap);

    this.updateSearchDistance();
  }

  private myPositionLocate() {
    this.myPositionMap.locate({}).on('locationfound', (e: LocationEvent) => {
      const myPosition = new LatLon(e.latlng.lat, e.latlng.lng);
      this.updateMyPositionAndCenterMap(myPosition);
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

  private myPositionFromMapCenter() {
    const center: LatLng = this.myPositionMap.getCenter();
    this.updateMyPositionAndCenterMap(new LatLon(center.lat, center.lng));
  }

  private zoomToSearchDistance() {
    const zoomLevel = SearchDistance.kmAsZoomLevel(this.searchDistance);
    return this.myPositionMap.setZoom(zoomLevel);
  }

  private updateMyPositionAndCenterMap(myPosition: LatLon) {
    if (myPosition.lat !== this.myPosition.lat || myPosition.lon !== this.myPosition.lon) {
      this.myPosition = myPosition;
      this.myPositionMarker.setLatLng(myPosition.asLatLng());
      this.myPositionMap.setView(myPosition.asLatLng());
      this.updateSearchDistance();
      this.updatedMyPosition.emit(this.myPosition);
    }
  }

  private updateSearchDistance() {
    if (this.searchDistanceLayer) {
      this.searchDistanceLayer.clearLayers();
      new Circle(this.myPosition.asLatLng(),  {
        radius: this.searchDistance,
        color: '#ff7777',
        weight: 1
      }).addTo(this.searchDistanceLayer);
      this.zoomToSearchDistance();
    }
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
