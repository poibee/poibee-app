import {Component, OnInit} from '@angular/core';
import {SortTypes, sortTypesAsArray} from "../../data/sort-types";
import {Poi} from "../../data/poi";
import {Subscription} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {PoisFilterService} from "../../services/pois-filter.service";
import {PoisSorterService} from "../../services/pois-sorter.service";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../../data/search-attributes";
import {StateService} from "../../services/state.service";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private stateService: StateService,
    private poisOverpassService: PoisOverpassService) {
  }

  searchActive = false;
  searchAttributes: SearchAttributes = INITIAL_SEARCH_ATTRIBUTES;
  filterValue: string = '';

  allPois: Poi[] = [];
  filteredPois: Poi[] = [];

  private selectedSort: string = sortTypesAsArray()[0][0];

  private subscription: Subscription;

  ngOnInit() {
    if (this.stateService.hasResults()) {
      this.filteredPois = this.stateService.getPois();
      this.allPois = this.stateService.getAllPois();
      this.searchAttributes = this.stateService.getSearchAttributes();
      this.filterValue = this.stateService.getFilterValue();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateSelectedSort(value: string) {
    this.selectedSort = value;
    this.filteredPois = this.stateService.updateSelectedSort(this.selectedSort);
  }

  updateFilterValue(value: string) {
    this.filterValue = value;
    this.filteredPois = this.stateService.updateFilterValue(this.filterValue);
  }

  executeSearch(value: SearchAttributes) {
    this.searchAttributes = value;
    this.reloadPois(value);
  }

  private reloadPois(attr: SearchAttributes) {
    this.searchActive = true;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.poisOverpassService.searchPois(attr.position, attr.distance, attr.category.key).subscribe(pois => {
      this.filteredPois = this.stateService.updatePois(pois, attr);
      this.allPois = this.stateService.getAllPois();
      this.searchActive = false;
    });
  }
}
