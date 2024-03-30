import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DiscoverSearchModalComponent} from '../discover-search-modal/discover-search-modal.component';
import {SearchAttributes} from '../../../../data/search-attributes';
import {ModalController} from '@ionic/angular';
import {PoisViewMode} from "../../../../data/pois-view-mode";

@Component({
  selector: 'app-discover-search-toolbar',
  templateUrl: './discover-search-toolbar.component.html',
  styleUrls: ['./discover-search-toolbar.component.scss'],
})
export class DiscoverSearchToolbarComponent implements OnInit {

  @Input() numberOfSearchResults: number;
  @Input() numberOfFilterResults: number;
  @Input() searchAttributes: SearchAttributes;
  @Input() searchActive = false;
  @Input() poisViewMode : PoisViewMode;

  @Output() searchUpdated = new EventEmitter<SearchAttributes>();
  @Output() poisViewModeUpdated = new EventEmitter<PoisViewMode>();

  poisViewModeIsList = false;

  constructor(
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.poisViewModeIsList = this.poisViewMode === PoisViewMode.LIST;
  }

  toggleDisplayType() {
    this.poisViewModeIsList = !this.poisViewModeIsList;
    this.poisViewModeUpdated.emit(this.poisViewModeIsList ? PoisViewMode.LIST : PoisViewMode.MAP);
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
