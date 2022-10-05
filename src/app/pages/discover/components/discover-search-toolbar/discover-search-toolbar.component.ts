import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DiscoverSearchModalComponent} from "../discover-search-modal/discover-search-modal.component";
import {SearchAttributes} from "../../../../data/search-attributes";
import {sortTypesAsArray} from "../../../../data/sort-types";
import {ModalController} from "@ionic/angular";
import {LatLon} from "../../../../data/lat-lon";

@Component({
  selector: 'app-discover-search-toolbar',
  templateUrl: './discover-search-toolbar.component.html',
  styleUrls: ['./discover-search-toolbar.component.scss'],
})
export class DiscoverSearchToolbarComponent implements OnInit {

  @Input() numberOfSearchResults: number;
  @Input() numberOfFilterResults: number;
  @Input() searchAttributes: SearchAttributes;
  @Input() searchActive: boolean = false;

  @Output() searchUpdated = new EventEmitter<SearchAttributes>();

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {}

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
