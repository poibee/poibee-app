import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PoisOverpassService} from '../../services/pois-overpass.service';
import {Poi} from '../../data/poi';
import {LatLon} from '../../data/lat-lon';
import {Subscription} from 'rxjs';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {State} from '../discover/store/discover.reducer';
import {getPoiPageData} from '../discover/store/discover.selectors';
import {selectNextPoi, selectPreviousPoi} from '../discover/store/discover.actions';
import {PoiId} from '../../data/poi-id';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.page.html',
  styleUrls: ['./poi.page.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})
export class PoiPage implements OnInit, OnDestroy {

  hasNextPoi: boolean;
  hasPreviousPoi: boolean;
  navigatorLabel: string;
  showNavigationButtons: boolean;
  poi: Poi;

  searchCenter: LatLon;

  poiSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private navCtrl: NavController,
    private poisOverpassService: PoisOverpassService,
    private discoverStore: Store<{ discoverState: State }>) {
  }

  ngOnInit(): void {
    // TODO unregister subscription
    const poiId = PoiId.of(this.route.snapshot.paramMap.get('id'));
    const poiPageData$ = this.discoverStore.pipe(select(getPoiPageData)).subscribe((value: PoiPageValueType) => {
      if (this.isValidPoiInStore(value)) {
        this.updatePoiResult(value);
        this.reloadPoiWithOriginalOsmData();
      } else {
        this.reloadPoi(poiId);
      }
    });
  }

  private isValidPoiInStore(poiPageValue: PoiPageValueType): boolean {
    return poiPageValue && poiPageValue.poi != null;
  }

  private updatePoiResult(value: PoiPageValueType) {
    this.poi = value.poi;
    this.searchCenter = value.searchCenter;
    this.hasNextPoi = value.hasNextPoi;
    this.hasPreviousPoi = value.hasPreviousPoi;
    this.navigatorLabel = value.navigatorLabel;
    this.showNavigationButtons = value.showNavigationButtons;

    // https://stackoverflow.com/questions/43698032/angular-how-to-update-queryparams-without-changing-route
    this.location.replaceState('/poi/' + this.poi.id);
  }

  navigateBack() {
    this.navCtrl.navigateRoot('/discover');
  }

  selectNextPoi(): void {
    this.discoverStore.dispatch(selectNextPoi());
  }

  selectPreviousPoi(): void {
    this.discoverStore.dispatch(selectPreviousPoi());
  }

  private reloadPoiWithOriginalOsmData() {
    if (!this.poi.id.isNode()) {
      this.poiSubscription$ = this.poisOverpassService.searchPoi(this.poi.id, this.searchCenter).subscribe(poi => {
        this.poi = poi;
      });
    }
  }

  // TODO - use an effect to load a single POI
  private reloadPoi(poiId: PoiId) {
    this.poiSubscription$ = this.poisOverpassService.searchPoi(poiId, null).subscribe(poi => {
      const poiPageValue: PoiPageValueType = {
        hasNextPoi: false,
        hasPreviousPoi: false,
        navigatorLabel: '',
        poi,
        searchCenter: poi.coordinates,
        showNavigationButtons: false
      };
      this.updatePoiResult(poiPageValue);
    });
  }

  ngOnDestroy(): void {
    if (this.poiSubscription$) {
      this.poiSubscription$.unsubscribe();
    }
  }
}

export type PoiPageValueType = {
  navigatorLabel: string;
  searchCenter: LatLon;
  hasNextPoi: boolean;
  showNavigationButtons: boolean;
  hasPreviousPoi: boolean;
  poi: Poi;
};
