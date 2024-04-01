import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Poi} from '../../data/poi';
import {Observable, Subscription} from 'rxjs';
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from '../../data/search-attributes';
import {PoisViewMode} from '../../data/pois-view-mode';
import {State} from './store/discover.reducer';
import {select, Store} from '@ngrx/store';
import {
  getFilterValue,
  getFoundPois, getPoisViewMode,
  getSearchActive,
  getSearchAttributes,
  getSelectedPoi,
  getSelectedPoiText,
  getSelectedSort
} from './store/discover.selectors';
import {
  changePosition,
  initializeDiscoverPage,
  searchPois,
  selectNextPoi,
  selectPoi,
  selectPreviousPoi, selectPoisViewMode,
  updateFilterValue,
  updateSelectedSort
} from './store/discover.actions';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {LatLon} from '../../data/lat-lon';
import {DiscoverPageQueryParameter} from "../../data/discover-page-query-parameter";
import {QueryParameterParserService} from "../../services/query-parameter-parser.service";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnChanges, OnDestroy {

  searchActive$: Observable<boolean>;
  poisViewMode: PoisViewMode;
  searchAttributes: SearchAttributes;
  filterValue: string;
  allPois: Poi[];
  filteredPois: Poi[];
  selectedPoi: Poi;
  selectedPoiText: string;
  selectedSort: string;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private queryParameterParserService: QueryParameterParserService,
    private discoverStore: Store<{ discoverState: State }>) {
  }

  ngOnInit() {
    const parameters: DiscoverPageQueryParameter = this.queryParameterParserService.queryParameters(this.route.snapshot.queryParamMap)
    this.discoverStore.dispatch(initializeDiscoverPage({parameters: parameters }));

    // TODO unregister subscription
    const poisViewMode$ = this.discoverStore.pipe(select(getPoisViewMode)).subscribe(value => {
      this.poisViewMode = value;
    });

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

  changePosition(value: LatLon) {
    this.discoverStore.dispatch(changePosition({position: value}));
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

  changePoisViewMode(value: PoisViewMode) {
    this.discoverStore.dispatch(selectPoisViewMode({poisViewMode: value}));
  }

  selectPoi(selectedPoi: Poi): void {
    this.discoverStore.dispatch(selectPoi({selectedPoi}));
  }

  selectNextPoi(): void {
    this.discoverStore.dispatch(selectNextPoi());
  }

  selectPreviousPoi(): void {
    this.discoverStore.dispatch(selectPreviousPoi());
  }

  protected readonly PoisViewMode = PoisViewMode;
}
