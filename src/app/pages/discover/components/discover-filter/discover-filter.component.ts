import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {sortTypesAsArray} from "../../../../data/sort-types";

@Component({
  selector: 'app-discover-filter',
  templateUrl: './discover-filter.component.html',
  styleUrls: ['./discover-filter.component.scss'],
})
export class DiscoverFilterComponent implements OnInit {

  selectedSort: string = sortTypesAsArray()[0][0];

  @Output() selectedSortUpdated = new EventEmitter<string>();
  @Output() filterValueUpdated = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  sortTypes(): [string, string][] {
    return sortTypesAsArray();
  }

  updateSelectedSort(event: any) {
    const value = event.target.value;
    this.selectedSortUpdated.emit(value);
  }

  updateFilterValue(event: any) {
    const value = event.target.value;
    this.filterValueUpdated.emit(value);
  }
}
