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
  ErrorEvent,
  LatLng,
  Layer,
  LayerGroup,
  LocationEvent,
  Map,
  Marker,
  MarkerOptions,
  TileLayer
} from "leaflet";
import {Geocoder} from "leaflet-control-geocoder";

import {ImageService} from "../../../../services/image.service";
import {ToastController} from "@ionic/angular";
import {LatLon} from "../../../../data/lat-lon";
import {SearchDistance} from "../../../../data/search-distance";
import {Poi} from "../../../../data/poi";
import {SearchAttributes} from "../../../../data/search-attributes";
import {PoiNavigatorControl} from "./poi-navigator.control";

const OSM_ATTRIBUTES = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
const MAP_ZOOM = 13;

@Component({
  selector: 'app-discover-map',
  templateUrl: './discover-map.component.html',
  styleUrls: ['./discover-map.component.scss'],
})
export class DiscoverMapComponent implements OnInit, OnChanges {

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('discoverMap') discoverMapContainer;
  showProgress: boolean;

  private discoverMap: Map;
  private searchCenterMarker: Marker;
  private searchDistanceCircle: Circle;
  private poisLayer: LayerGroup;
  private selectedPoiMaskLayer: LayerGroup;
  private poiNavigatorControl: PoiNavigatorControl;

  @Input() pois: Poi[] = [];
  @Input() searchAttributes: SearchAttributes;
  @Input() selectedPoi: Poi;
  @Input() selectedPoiText: string;

  @Output() selectPoiOutput = new EventEmitter<Poi>();
  @Output() selectNextPoiOutput = new EventEmitter<void>();
  @Output() selectPreviousPoiOutput = new EventEmitter<void>();

  constructor(
    private imageService: ImageService
  ) {
  }

  ngOnInit() {
    this.showProgress = true;
    this.sleep(500).then(() => {
      this.constructMap();
      this.updatePois(this.pois);
      this.updateSearchAttributes(this.searchAttributes);
      this.showProgress = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const poisChange: SimpleChange = changes['pois'];
    const searchAttributesChange: SimpleChange = changes['searchAttributes'];
    const selectedPoiChange: SimpleChange = changes['selectedPoi'];
    const selectedPoiTextChange: SimpleChange = changes['selectedPoiText'];

    if (poisChange && !poisChange.firstChange) {
      this.updatePois(this.pois);
    }

    if (searchAttributesChange && !searchAttributesChange.firstChange) {
      this.updateSearchAttributes(this.searchAttributes);
    }

    if (this.poiNavigatorControl && selectedPoiTextChange && !selectedPoiTextChange.firstChange) {
      this.poiNavigatorControl.updateLabel(this.selectedPoiText)
    }

    if (selectedPoiChange && !selectedPoiChange.firstChange) {
      this.poisLayer.eachLayer((layer: Layer) => {
        const poiMarker = layer as PoiMarker;
        const zIndex = (this.selectedPoi === (poiMarker).poi) ? 1000 : 0;
        poiMarker.setZIndexOffset(zIndex)
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
  }

  private updateSearchAttributes(searchAttributes: SearchAttributes) {
    const searchCenterPositionAsLeaflet = searchAttributes.position.asLatLng();
    this.searchCenterMarker.setLatLng(searchCenterPositionAsLeaflet);
    this.searchDistanceCircle.setLatLng(searchCenterPositionAsLeaflet);
    this.searchDistanceCircle.setRadius(searchAttributes.distance);
    this.discoverMap.flyTo(searchCenterPositionAsLeaflet, SearchDistance.kmAsZoomLevel(searchAttributes.distance));
  }

  private updatePois(pois: Poi[]) {
    this.poisLayer.clearLayers();
    for (let i = 0; i < this.pois.length; i++) {
      const poi: Poi = this.pois[i];
      const markerIcon = this.imageService.loadCategoryIcon(poi.categories[0].toLowerCase());
      const marker: any = new PoiMarker(poi, {icon: markerIcon});
      marker.on('click', async () => {
        this.selectPoiOutput.emit(poi);
      });
      this.poisLayer.addLayer(marker);
    }
  }

  private constructMap() {
    const searchCircleDistance = this.searchAttributes.distance;
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

    this.searchCenterMarker = new Marker(mapCenterAsLeaflet, {
      title: "Mein Standort",
      draggable: true,
      icon: this.imageService.loadMarkerIcon()
    }).addTo(searchLayer);

    this.searchDistanceCircle = new Circle(mapCenterAsLeaflet,  {
      radius: searchCircleDistance,
      color: '#ff7777',
      weight: 1
    }).addTo(searchLayer);

    this.poiNavigatorControl = new PoiNavigatorControl(this.discoverMap, this.selectPreviousPoiOutput, this.selectNextPoiOutput, {position: 'bottomright'});
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

export class PoiMarker extends Marker<Poi> {
  constructor(public poi: Poi, options?: MarkerOptions) {
    super(poi.coordinates.asLatLng(), options)
  }
}
