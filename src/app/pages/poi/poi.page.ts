import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
export class PoiPage implements OnInit, OnDestroy {

  poi: Poi;
  searchCenter: LatLon;
  showProgress: boolean;

  poiSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private stateService: StateService,
    private poisOverpassService: PoisOverpassService
  ) {
  }

  ngOnInit(): void {
    this.searchCenter = this.determineSearchCenter();
    const localPoiIdDecoded = this.determinePoiIdDecoded();

    this.showProgress = true;
    this.poiSubscription$ = this.poisOverpassService.searchPoi(localPoiIdDecoded, this.searchCenter).subscribe(poi => {
      this.stateService.selectPoi(poi);
      this.poi = poi;
      this.sleep(500).then(() => {
        this.showProgress = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.poiSubscription$) {
      this.poiSubscription$.unsubscribe()
    }
  }

  navigateBack() {
    this.navCtrl.navigateRoot("/discover")
  }

  selectNextPoi() {
    this.poi = this.stateService.selectNextPoi();
    this.reloadPoiWithOriginalOsmData();
  }

  selectPreviousPoi() {
    this.poi = this.stateService.selectPreviousPoi();
    this.reloadPoiWithOriginalOsmData();
  }

  private determineSearchCenter(): LatLon {
    let result: LatLon = null;
    const searchAttributes = this.stateService.searchAttributes;
    if (searchAttributes) {
      result = searchAttributes.position;
    }
    return result;
  }

  private determinePoiIdDecoded() {
    const poiIdEncoded = this.route.snapshot.paramMap.get('id');
    const localPoiIdDecoded = poiIdEncoded.replace("-", "").replace("/", "");
    return localPoiIdDecoded;
  }

  // TODO ID einführen
  // E2E-Test ergänzen
  // POI-Tag-Parameter entfernen
  // reload only not Nodes
  private reloadPoiWithOriginalOsmData() {
    const localPoiIdDecoded = this.poi.id.replace("-", "").replace("/", "");
    this.poiSubscription$ = this.poisOverpassService.searchPoi(localPoiIdDecoded, this.searchCenter).subscribe(poi => {
      this.poi = poi;
    });
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
