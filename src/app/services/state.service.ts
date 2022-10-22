import { Injectable } from '@angular/core';
import {Poi} from "../data/poi";
import {SortTypes, sortTypesAsArray} from "../data/sort-types";

import {PoisFilterService} from "../services/pois-filter.service";
import {PoisSorterService} from "../services/pois-sorter.service";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../data/search-attributes";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  resultPois: Poi[] = [];
  searchAttributes: SearchAttributes;

  private selectedPoi: Poi;
  private allPois: Poi[] = [];
  private selectedSort: string = sortTypesAsArray()[0][0];
  private filterValue: string = '';

  constructor(
    private poisFilterService: PoisFilterService,
    private poisSorterService: PoisSorterService
  ) { }

  updateSelectedSort(value: string): Poi[] {
    this.selectedSort = value;
    this.resultPois = this.calculateResultPois();
    return this.resultPois;
  }

  updateFilterValue(value: string): Poi[] {
    this.filterValue = value;
    this.resultPois = this.calculateResultPois();
    return this.resultPois;
  }

  updatePois(pois: Poi[], searchAttributes: SearchAttributes): Poi[] {
    this.allPois = pois;
    this.searchAttributes = searchAttributes;
    this.resultPois = this.calculateResultPois();
    return this.resultPois;
  }

  selectPoi(poi: Poi) {
    this.selectedPoi = poi;
  }

  hasResults(): boolean {
    return this.resultPois.length > 0;
  }

  getPois(): Poi[] {
    return this.resultPois;
  }

  getAllPois(): Poi[] {
    return this.allPois;
  }

  getSelectPoi(): Poi {
    return this.selectedPoi;
  }

  getFilterValue(): string {
    return this.filterValue;
  }

  hasNextPoi(): boolean {
    const poiIndex = this.calculateSelectedPoiIndex();
    return poiIndex >= 0 && poiIndex < this.resultPois.length - 1;
  }

  hasPreviousPoi(): boolean {
    const poiIndex = this.calculateSelectedPoiIndex();
    return poiIndex > 0;
  }

  selectNextPoi(): Poi {
    if (this.hasNextPoi()) {
      const poiIndex = this.calculateSelectedPoiIndex();
      this.selectedPoi = this.resultPois[poiIndex + 1];
    }
    return this.selectedPoi;
  }

  selectPreviousPoi(): Poi {
    if (this.hasPreviousPoi()) {
      const poiIndex = this.calculateSelectedPoiIndex();
      this.selectedPoi = this.resultPois[poiIndex - 1];
    }
    return this.selectedPoi;
  }

  isPoiOfList(): boolean {
    return this.calculateSelectedPoiIndex() >= 0;
  }

  // needed for different POI objects with same id
  private calculateSelectedPoiIndex() {
    let result = -1;
    for (let i = 0; i < this.resultPois.length; i++) {
      if (this.selectedPoi && this.resultPois[i].id === this.selectedPoi.id) {
        result = i;
        break;
      }
    }
    return result;
  }

  navigatorLabel(): string {
    return (this.calculateSelectedPoiIndex() + 1) + ' / ' + this.resultPois.length;
  }

  private calculateResultPois(): Poi[] {
    const filteredPois = this.poisFilterService.filterPois(this.allPois, this.filterValue);
    const sortedPois = this.poisSorterService.sortPois(filteredPois, this.selectedSort);
    return sortedPois;
  }
}
