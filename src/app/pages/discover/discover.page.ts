import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {sortTypesAsArray} from "../../data/sort-types";
import {Poi} from "../../data/poi";
import {Observable, Subscription} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../../data/search-attributes";
import {StateService} from "../../services/state.service";
import {ResultViewType} from "../../data/result-view-type";
import {State} from "./store/discover.reducer";
import {select, Store} from "@ngrx/store";
import {getSearchActive, getPoisOfSearchAttributes} from "./store/discover.selectors";
import {searchPois} from "./store/discover.actions";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnChanges {

  constructor(
    private stateService: StateService,
    private poisOverpassService: PoisOverpassService,
    private discoverStore: Store<{ discoverState: State }>) {
  }

  searchActive$: Observable<boolean>;

  resultViewType: ResultViewType = 'MAP';

  searchAttributes: SearchAttributes;
  filterValue: string = '';

  allPois: Poi[] = [];
  filteredPois: Poi[] = [];
  selectedPoi: Poi;
  selectedPoiText: string = '';

  private selectedSort: string = sortTypesAsArray()[0][0];
  private subscription: Subscription;
  private selectedPoiIndex = 0;

  ngOnInit() {
    if (this.stateService.hasResults()) {
      this.filteredPois = this.stateService.getPois();
      this.allPois = this.stateService.getAllPois();
      this.resetSelectedPoi();
      this.filterValue = this.stateService.getFilterValue();
    }

    // TODO unregister subscription
    const poisOfSearchAttributes$ = this.discoverStore.pipe(select(getPoisOfSearchAttributes)).subscribe(value => {
      this.searchAttributes = value.searchAttributes;
      if (value.searchAttributes !== INITIAL_SEARCH_ATTRIBUTES) {
        this.poisLoaded(value.searchAttributes, value.pois);
      }
    });

    this.searchActive$ = this.discoverStore.pipe(select(getSearchActive));
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
    this.filteredPois = this.stateService.updateSelectedSort(this.selectedSort);
    this.resetSelectedPoi();
  }

  updateFilterValue(value: string) {
    this.filterValue = value;
    this.filteredPois = this.stateService.updateFilterValue(this.filterValue);
    this.resetSelectedPoi();
  }

  executeSearch(value: SearchAttributes) {
    this.discoverStore.dispatch(searchPois({searchAttributes: value}));
  }

  changeView(value: ResultViewType) {
    this.resultViewType = value;
  }

  selectPoi(selectedPoi: Poi): void {
    this.selectedPoiIndex = this.filteredPois.indexOf(selectedPoi);
    this.recalculateSelectedPoi();
  }

  selectNextPoi(): void {
    if (this.selectedPoiIndex < this.filteredPois.length - 1) {
      this.selectedPoiIndex = this.selectedPoiIndex + 1;
    }
    this.recalculateSelectedPoi();
  }

  selectPreviousPoi(): void {
    if (this.selectedPoiIndex > 0) {
      this.selectedPoiIndex = this.selectedPoiIndex - 1;
    }
    this.recalculateSelectedPoi();
  }

  private resetSelectedPoi() {
    this.selectedPoiIndex = 0;
    this.recalculateSelectedPoi();
  }

  private recalculateSelectedPoi() {
    this.selectedPoi = this.filteredPois.length > 0 ? this.filteredPois[this.selectedPoiIndex] : null;
    if (this.filteredPois.length > 0) {
      this.selectedPoiText = (this.selectedPoiIndex + 1) + ' / ' + this.filteredPois.length;
    } else {
      this.selectedPoiText = '0 / 0';
    }
  }

  poisLoaded(searchAttributes: SearchAttributes, pois: Poi[]) {
      this.filteredPois = this.stateService.updatePois(pois, searchAttributes);
      this.allPois = this.stateService.getAllPois();
      this.resetSelectedPoi();
  }
}
