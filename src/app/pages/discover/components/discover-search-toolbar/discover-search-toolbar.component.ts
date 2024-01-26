import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DiscoverSearchModalComponent} from '../discover-search-modal/discover-search-modal.component';
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from '../../../../data/search-attributes';
import {sortTypesAsArray} from '../../../../data/sort-types';
import {ModalController} from '@ionic/angular';
import {LatLon} from '../../../../data/lat-lon';
import {ResultViewType} from '../../../../data/result-view-type';

@Component({
  selector: 'app-discover-search-toolbar',
  templateUrl: './discover-search-toolbar.component.html',
  styleUrls: ['./discover-search-toolbar.component.scss'],
})
export class DiscoverSearchToolbarComponent implements OnInit {

  viewTypeList = false;

  @Input() numberOfSearchResults: number;
  @Input() numberOfFilterResults: number;
  @Input() searchAttributes: SearchAttributes;
  @Input() searchActive = false;

  @Output() searchUpdated = new EventEmitter<SearchAttributes>();
  @Output() resultViewTypeUpdated = new EventEmitter<ResultViewType>();

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {}

  toggleDisplayType() {
    this.viewTypeList = !this.viewTypeList;
    this.resultViewTypeUpdated.emit(this.viewTypeList ? 'LIST' : 'MAP');
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
