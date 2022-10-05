import {Component, OnInit} from '@angular/core';
import {sortTypesAsArray} from "../../data/sort-types";
import {Poi} from "../../data/poi";
import {Subscription} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {PoisFilterService} from "../../services/pois-filter.service";
import {PoisSorterService} from "../../services/pois-sorter.service";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../../data/search-attributes";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private poisOverpassService: PoisOverpassService,
    private poisFilterService: PoisFilterService,
    private poisSorterService: PoisSorterService) {
  }

  searchActive = false;
  searchAttributes: SearchAttributes = INITIAL_SEARCH_ATTRIBUTES;

  allPois: Poi[] = [];
  filteredPois: Poi[] = [];

  private selectedSort: string = sortTypesAsArray()[0][0];
  private filterValue: string = '';

  private subscription: Subscription;

  ngOnInit() {
    // this.reloadPois(this.searchAttributes);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateSelectedSort(value: any) {
    this.selectedSort = value;
    this.updatePois();
  }

  updateFilterValue(value: any) {
    this.filterValue = value;
    this.updatePois();
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

    this.subscription = this.poisOverpassService.searchPois(attr.position, attr.distance, attr.category).subscribe(pois => {
      this.allPois = pois;
      this.updatePois();
      this.searchActive = false;
    });
  }

  private updatePois() {
    const filteredPois = this.poisFilterService.filterPois(this.allPois, this.filterValue);
    const sortedPois = this.poisSorterService.sortPois(filteredPois, this.selectedSort);
    this.filteredPois = sortedPois;
  }
}
