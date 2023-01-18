import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Poi} from "../../data/poi";
import {Observable, Subscription} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {SearchAttributes} from "../../data/search-attributes";
import {ResultViewType} from "../../data/result-view-type";
import {State} from "./store/discover.reducer";
import {select, Store} from "@ngrx/store";
import {
  getSearchActive,
  getSelectedPoi,
  getFilterValue,
  getSelectedSort, getSelectedPoiText, getSearchAttributes, getFoundPois
} from "./store/discover.selectors";
import {
  searchPois,
  selectNextPoi, selectPoi,
  selectPreviousPoi,
  updateFilterValue,
  updateSelectedSort
} from "./store/discover.actions";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnChanges, OnDestroy {

  constructor(
    private poisOverpassService: PoisOverpassService,
    private discoverStore: Store<{ discoverState: State }>) {
  }

  searchActive$: Observable<boolean>;

  resultViewType: ResultViewType = 'MAP';

  searchAttributes: SearchAttributes;
  filterValue: string;
  allPois: Poi[];
  filteredPois: Poi[];
  selectedPoi: Poi;
  selectedPoiText: string;
  selectedSort: string;
  private subscription: Subscription;

  ngOnInit() {
    // TODO unregister subscription
    const searchAttributes$ = this.discoverStore.pipe(select(getSearchAttributes)).subscribe(value => {
      this.searchAttributes = value.searchAttributes;
    });

    // TODO unregister subscription
    const poisOfSearchAttributes$ = this.discoverStore.pipe(select(getFoundPois)).subscribe(value => {
      this.filteredPois = value.filteredPois;
      this.allPois = value.allPois;
    });

    // TODO unregister subscription
    this.searchActive$ = this.discoverStore.pipe(select(getSearchActive));

    // TODO unregister subscription
    const selectedPoi$ = this.discoverStore.pipe(select(getSelectedPoi)).subscribe(value => {
      this.selectedPoi = value;
    });

    // TODO unregister subscription
    const selectedSort$ = this.discoverStore.pipe(select(getSelectedSort)).subscribe(value => {
      this.selectedSort = value;
    });

    // TODO unregister subscription
    const filterValue$ = this.discoverStore.pipe(select(getFilterValue)).subscribe(value => {
      this.filterValue = value;
    });

    // TODO unregister subscription
    const selectedPoiText$ = this.discoverStore.pipe(select(getSelectedPoiText)).subscribe(value => {
      this.selectedPoiText = value;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // do nothing
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateSelectedSort(value: string) {
    this.selectedSort = value;
    this.discoverStore.dispatch(updateSelectedSort({selectedSort: value}));
  }

  updateFilterValue(value: string) {
    this.filterValue = value;
    this.discoverStore.dispatch(updateFilterValue({filterValue: value}));
  }

  executeSearch(value: SearchAttributes) {
    this.discoverStore.dispatch(searchPois({searchAttributes: value}));
  }

  changeView(value: ResultViewType) {
    this.resultViewType = value;
  }

  selectPoi(selectedPoi: Poi): void {
    this.discoverStore.dispatch(selectPoi({selectedPoi: selectedPoi}));
  }

  selectNextPoi(): void {
    this.discoverStore.dispatch(selectNextPoi());
  }

  selectPreviousPoi(): void {
    this.discoverStore.dispatch(selectPreviousPoi());
  }
}
