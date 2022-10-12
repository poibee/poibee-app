import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {sortTypesAsArray} from "../../../../data/sort-types";
import {ModalController} from "@ionic/angular";
import {DiscoverSearchModalComponent} from "../discover-search-modal/discover-search-modal.component";
import {SearchAttributes} from "../../../../data/search-attributes";
import {LatLon} from "../../../../data/lat-lon";

@Component({
  selector: 'app-discover-filter-toolbar',
  templateUrl: './discover-filter-toolbar.component.html',
  styleUrls: ['./discover-filter-toolbar.component.scss'],
})
export class DiscoverFilterToolbarComponent implements OnInit {

  selectedSort: string = sortTypesAsArray()[0][0];
  @Input() searchActive: boolean = false;
  @Input() filterValue: string = '';

  @Output() selectedSortUpdated = new EventEmitter<string>();
  @Output() filterValueUpdated = new EventEmitter<string>();

  constructor(
    private modalController: ModalController
  ) {
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
