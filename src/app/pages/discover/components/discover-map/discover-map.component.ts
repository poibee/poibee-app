import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  Circle,
  Control,
  control,
  Layer,
  LayerGroup,
  Map,
  Marker,
  MarkerOptions,
  TileLayer
} from 'leaflet';

import {ImageService} from '../../../../services/image.service';
import {SearchDistance} from '../../../../data/search-distance';
import {Poi} from '../../../../data/poi';
import {SearchAttributes} from '../../../../data/search-attributes';
import {PoiNavigatorControl} from './poi-navigator.control';
import {LatLon} from '../../../../data/lat-lon';
import {MyPositionFromMapCenterControl} from '../map/my-position-from-map-center.control';
import {MyPositionFromLocatorControl} from '../map/my-position-from-locator.control';
import {MyPositionFromGeocoderControl} from '../map/my-position-from-geocoder.control';
import {ToastController} from '@ionic/angular';

const OSM_ATTRIBUTES = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
// TODO #112 - replace this constants by init state
const MAP_ZOOM = 13;
const DISTANCE_CIRCLE_RADIUS = 1;

@Component({
  selector: 'app-discover-map',
  templateUrl: './discover-map.component.html',
  styleUrls: ['./discover-map.component.scss'],
})
export class DiscoverMapComponent implements OnInit, OnChanges {

  @Input() pois: Poi[];
  @Input() searchAttributes: SearchAttributes;
  @Input() selectedPoi: Poi;
  @Input() selectedPoiText: string;

  @Output() changePositionOutput = new EventEmitter<LatLon>();
  @Output() selectPoiOutput = new EventEmitter<Poi>();
  @Output() selectNextPoiOutput = new EventEmitter<void>();
  @Output() selectPreviousPoiOutput = new EventEmitter<void>();

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('discoverMap') discoverMapContainer;

  showProgress: boolean;

  private discoverMap: Map;
  private searchPositionMarker: Marker;
  private searchDistanceCircle: Circle;
  private poisLayer: LayerGroup;
  private selectedPoiMaskLayer: LayerGroup;
  private poiNavigatorControl: PoiNavigatorControl;
  private isMapInitialized = false;
  private changesTillCallNgOnInit: SimpleChanges[] = [];

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
      this.isMapInitialized = true;
      // replay missing changes, to display map items correctly (maybe only needed for e2e tests)
      this.changesTillCallNgOnInit.forEach(c => this.updateDependingComponentsOfChanges(c));

      const updatePosition = (pos: LatLon) => {
        this.changePositionOutput.emit(pos);
      };
      new MyPositionFromMapCenterControl(this.discoverMap, updatePosition);
      new MyPositionFromLocatorControl(this.discoverMap, this. toastController, updatePosition);
      new MyPositionFromGeocoderControl(this.discoverMap, updatePosition);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isMapInitialized) {
      this.updateDependingComponentsOfChanges(changes);
    } else {
      this.changesTillCallNgOnInit.push(changes);
    }
  }

  private updateDependingComponentsOfChanges(changes: SimpleChanges) {
    // TODO - check all the "isFirstChange()" methode
    // TODO - update text of Navigation-Panel

    // TODO - POI muss noch auf Karte "selected" werden !
    // TODO - Radius bei ohne Suche auf 1 setzen
    this.selectedPoiTextUpdated(); // :-)

    const poisChange: SimpleChange = changes['pois'];
    if (poisChange /* && !poisChange.isFirstChange() */) {
      this.poisUpdated();
    }

    const searchAttributesChange: SimpleChange = changes['searchAttributes'];
    // if (searchAttributesChange && !searchAttributesChange.isFirstChange()) {
    if (searchAttributesChange) {
      this.selectedSearchAttributesUpdated();
    }

    const selectedPoiTextChange: SimpleChange = changes['selectedPoiText'];
    if (selectedPoiTextChange && !selectedPoiTextChange.isFirstChange()) {
      this.selectedPoiTextUpdated();
    }

    const selectedPoiChange: SimpleChange = changes['selectedPoi'];
    if (selectedPoiChange && !selectedPoiChange.isFirstChange()) {
      this.selectedPoiUpdated();
    }
  }

  private selectedSearchAttributesUpdated() {
    const searchAttributes = this.searchAttributes;
    const searchCenterPositionAsLeaflet = searchAttributes.position.asLatLng();
    this.searchPositionMarker.setLatLng(searchCenterPositionAsLeaflet);
    this.searchDistanceCircle.setLatLng(searchCenterPositionAsLeaflet);
    this.searchDistanceCircle.setRadius(searchAttributes.hasEverSearched ? searchAttributes.distance : 1);
    this.discoverMap.setView(searchCenterPositionAsLeaflet, SearchDistance.kmAsZoomLevel(searchAttributes.distance));
    this.updateDistanceCircleCypressFunction();
  }

  private selectedPoiTextUpdated() {
    this.poiNavigatorControl.updateLabel(this.selectedPoiText);
  }

  private poisUpdated() {
    this.poisLayer.clearLayers();
    for (const poi of this.pois) {
      const markerIcon = this.imageService.loadCategoryIcon(poi.categories[0].toLowerCase());
      const marker: PoiMarker = new PoiMarker(poi, {icon: markerIcon});
      marker.on('click', async () => {
        this.selectPoiOutput.emit(poi);
      });
      this.poisLayer.addLayer(marker);
      marker.updatePoiCypressFunction();
    }
  }

  private selectedPoiUpdated() {
    this.poisLayer.eachLayer((layer: Layer) => {
      const poiMarker = layer as PoiMarker;
      const zIndex = (this.selectedPoi === (poiMarker).poi) ? 1000 : 0;
      poiMarker.setZIndexOffset(zIndex);
    });

    this.selectedPoiMaskLayer.clearLayers();
    if (this.selectedPoi) {
      const markerOptions = {
        icon: this.imageService.loadSelectedMarkerIcon(),
        zIndexOffset: 2000
      };
      const marker = new Marker(this.selectedPoi.coordinates.asLatLng(), markerOptions);
      marker.addTo(this.selectedPoiMaskLayer);
    }
  }

  private constructMap() {
    const mapCenterAsLeaflet = this.searchAttributes.position.asLatLng();

    this.poisLayer = new LayerGroup();
    this.selectedPoiMaskLayer = new LayerGroup();
    const searchLayer = new LayerGroup();
    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    this.discoverMap = new Map(this.discoverMapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      center: mapCenterAsLeaflet,
      zoom: MAP_ZOOM,
      layers: [osmTileLayer, searchLayer, this.poisLayer, this.selectedPoiMaskLayer]
    });
    new Control.Zoom({position: 'topleft'}).addTo(this.discoverMap);
    new Control.Attribution({position: 'bottomleft'}).addTo(this.discoverMap);
    this.discoverMap.attributionControl.addAttribution(OSM_ATTRIBUTES);
    control.scale().addTo(this.discoverMap);

    this.searchPositionMarker = new Marker(mapCenterAsLeaflet, {
      title: 'Mein Standort',
      draggable: true,
      icon: this.imageService.loadMarkerIcon()
    }).addTo(searchLayer);

    this.searchDistanceCircle = new Circle(mapCenterAsLeaflet, {
      radius: DISTANCE_CIRCLE_RADIUS,
      color: '#ff7777',
      weight: 1
    }).addTo(searchLayer);

    this.poiNavigatorControl = new PoiNavigatorControl(this.discoverMap, this.selectPreviousPoiOutput, this.selectNextPoiOutput, {position: 'bottomright'});

    this.initializeCypressHelpers();
  }

  private initializeCypressHelpers() {
    this.updateMapCypressFunction();
    this.discoverMap.on('zoom move', () => this.updateMapCypressFunction());

    this.updatePositionMarkerCypressFunction();
    this.searchPositionMarker.on('move', () => this.updatePositionMarkerCypressFunction());

    this.updateDistanceCircleCypressFunction();
    this.searchDistanceCircle.on('resize', () => this.updateDistanceCircleCypressFunction());
  }

  private updatePositionMarkerCypressFunction = () => {
    this.searchPositionMarker.getElement().setAttribute('data-cy-type', 'position');
    this.searchPositionMarker.getElement().setAttribute('data-cy-position-lat', String(this.searchPositionMarker.getLatLng().lat));
    this.searchPositionMarker.getElement().setAttribute('data-cy-position-lon', String(this.searchPositionMarker.getLatLng().lng));
  };

  private updateMapCypressFunction = () => {
    this.discoverMap.getContainer().setAttribute('data-cy-type', 'map');
    this.discoverMap.getContainer().setAttribute('data-cy-map-zoom', String(this.discoverMap.getZoom()));
    this.discoverMap.getContainer().setAttribute('data-cy-map-lat', String(this.discoverMap.getCenter().lat));
    this.discoverMap.getContainer().setAttribute('data-cy-map-lon', String(this.discoverMap.getCenter().lng));
  };

  private updateDistanceCircleCypressFunction = () => {
    this.searchDistanceCircle.getElement().setAttribute('data-cy-type', 'distance');
    this.searchDistanceCircle.getElement().setAttribute('data-cy-distance-radius', String(this.searchDistanceCircle.getRadius()));
    this.searchDistanceCircle.getElement().setAttribute('data-cy-distance-lat', String(this.searchDistanceCircle.getLatLng().lat));
    this.searchDistanceCircle.getElement().setAttribute('data-cy-distance-lon', String(this.searchDistanceCircle.getLatLng().lng));
  };

  private sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

export class PoiMarker extends Marker<Poi> {
  constructor(public poi: Poi, options?: MarkerOptions) {
    super(poi.coordinates.asLatLng(), options);
  }

  updatePoiCypressFunction() {
    this.getElement().setAttribute('data-cy-type', 'poi');
    this.getElement().setAttribute('data-cy-poi-categories', String(this.poi.categories.join()));
    this.getElement().setAttribute('data-cy-poi-lat', String(this.poi.coordinates.lat));
    this.getElement().setAttribute('data-cy-poi-lon', String(this.poi.coordinates.lon));
  }
}
