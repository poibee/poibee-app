import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {ImageService} from "../../services/image.service";
import {Poi} from "../../data/poi";
import {LatLon} from "../../data/lat-lon";
import {Subscription} from "rxjs";
import {LatLng, LatLngExpression, LayerGroup, TileLayer, Marker, Circle, Map, Control, control} from 'leaflet';
import {StateService} from "../../services/state.service";
import {NavController} from "@ionic/angular";
import {SearchDistance} from "../../data/search-distance";

@Component({
  selector: 'app-poi',
  templateUrl: './poi.page.html',
  styleUrls: ['./poi.page.scss'],
})
export class PoiPage implements OnInit {

  poi: Poi;
  hasNextPoi: boolean;
  hasPreviousPoi: boolean;
  navigatorLabel: string;
  showNavigationButtons: boolean;

  poiSubscription$: Subscription;
  showProgress: boolean;

  poiMap: Map;
  poiPositionLayer: LayerGroup;

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('poiMapDiv') poiMapContainer;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private stateService: StateService,
    private imageService: ImageService,
    private poisOverpassService: PoisOverpassService
  ) {
  }

  ngOnInit(): void {
    this.showProgress = true;
    const poiIdEncoded = this.route.snapshot.paramMap.get('id');
    const localPoiIdDecoded = poiIdEncoded.replace("-", "").replace("/", "");
    const searchCenter: LatLon = this.extractSearchCenter();

    this.poiSubscription$ = this.poisOverpassService.searchPoi(localPoiIdDecoded, searchCenter).subscribe(poi => {
      this.updateLoadedPoi(poi);
      this.sleep(500).then(() => {
        this.constructMap(poi.coordinates, searchCenter);
        this.updatePoiOfMap(poi);
        this.showProgress = false;
      });
    });
  }

  private extractSearchCenter(): LatLon {
    let searchCenter: LatLon = null;
    const searchAttributes = this.stateService.searchAttributes;
    if (searchAttributes) {
      searchCenter = searchAttributes.position;
    }
    return searchCenter;
  }

  private updateLoadedPoi(poi: Poi) {
    this.poi = poi;
    this.stateService.selectPoi(poi);
    this.updateNavigatorElements();
  }

  private updateNavigatorElements() {
    this.hasPreviousPoi = this.stateService.hasPreviousPoi();
    this.hasNextPoi = this.stateService.hasNextPoi();
    this.navigatorLabel = this.stateService.navigatorLabel();
    this.updatePoiOfMap(this.stateService.getSelectPoi());
    this.showNavigationButtons = this.stateService.isPoiOfList();
  }

  selectNextPoi() {
    this.poi = this.stateService.selectNextPoi();
    this.updateNavigatorElements();
  }

  selectPreviousPoi() {
    this.poi = this.stateService.selectPreviousPoi();
    this.updateNavigatorElements();
  }

  navigateBack() {
    this.navCtrl.navigateRoot("/discover")
  }

  private constructMap(mapCenter: LatLon, searchCenter: LatLon) {
    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    const searchCenterLayer = new LayerGroup();
    if (searchCenter) {
      searchCenterLayer.addLayer(new Marker(searchCenter.asLatLng(), {
        draggable: false,
        icon: this.imageService.loadMarkerIcon()
      }));
    }

    this.poiPositionLayer = new LayerGroup();
    this.poiMap = new Map(this.poiMapContainer.nativeElement, {
      doubleClickZoom: false,
      scrollWheelZoom: false,
      center: mapCenter.asLatLng(),
      zoom: 17,
      layers: [osmTileLayer, searchCenterLayer, this.poiPositionLayer]
    });

    const osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    this.poiMap.attributionControl.addAttribution(osmAttribution);
  }

  private updatePoiOfMap(poi: Poi) {
    if (this.poiMap) {
      this.poiPositionLayer.clearLayers();
      this.poiPositionLayer.addLayer(new Marker(poi.coordinates.asLatLng(), {
        draggable: false,
        icon: this.imageService.loadCategoryIcon(poi.categories[0].toLowerCase())
      }));
      this.poiMap.flyTo(poi.coordinates.asLatLng(), this.poiMap.getZoom());
    }
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  ngOnDestroy(): void {
    if (this.poiSubscription$) {
      this.poiSubscription$.unsubscribe()
    }
  }
}
