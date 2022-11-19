import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {Poi} from "../../data/poi";
import {LatLon} from "../../data/lat-lon";
import {Subscription} from "rxjs";
import {StateService} from "../../services/state.service";
import {NavController} from "@ionic/angular";
import {PoiId} from "../../data/poi-id";

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
    const poiId = PoiId.of(this.route.snapshot.paramMap.get('id'));

    this.showProgress = true;
    this.poiSubscription$ = this.poisOverpassService.searchPoi(poiId, this.searchCenter).subscribe(poi => {
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

  private reloadPoiWithOriginalOsmData() {
    if (!this.poi.id.isNode()) {
      this.poiSubscription$ = this.poisOverpassService.searchPoi(this.poi.id, this.searchCenter).subscribe(poi => {
        this.poi = poi;
      });
    }
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
