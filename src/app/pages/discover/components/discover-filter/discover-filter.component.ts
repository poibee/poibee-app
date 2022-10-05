import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {sortTypesAsArray} from "../../../../data/sort-types";
import {ModalController} from "@ionic/angular";
import {DiscoverSearchModalComponent} from "../discover-search-modal/discover-search-modal.component";
import {SearchAttributes} from "../../../../data/search-attributes";
import {LatLon} from "../../../../data/lat-lon";

@Component({
  selector: 'app-discover-filter',
  templateUrl: './discover-filter.component.html',
  styleUrls: ['./discover-filter.component.scss'],
})
export class DiscoverFilterComponent implements OnInit {

  selectedSort: string = sortTypesAsArray()[0][0];
  @Input() searchAttributes: SearchAttributes;
  @Input() searchActive: boolean = false;

  @Output() selectedSortUpdated = new EventEmitter<string>();
  @Output() filterValueUpdated = new EventEmitter<string>();
  @Output() searchUpdated = new EventEmitter<SearchAttributes>();

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

  async openSearchDialog() {
    const modal = await this.modalController.create({
      component: DiscoverSearchModalComponent,
      cssClass: 'search-modal',
      animated: true,
      backdropDismiss: true,
      componentProps: {
        searchAttributes: this.searchAttributes
      }
    });
    modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      this.searchUpdated.emit(data);
    }
  }

}
