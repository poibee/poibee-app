import { Component, OnInit } from '@angular/core';
import {sortTypesAsArray} from "../../data/sort-types";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  selectedSort: string = sortTypesAsArray()[0][0];
  filterValue: string = '';

  constructor() { }

  ngOnInit() {
  }

  sortTypes(): [string, string][] {
    return sortTypesAsArray();
  }

  updateSortType(event: any) {
    const sortType = event.target.value;
    this.selectedSort = sortType;
  }
}
