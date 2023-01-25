import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Poi} from "../../../../data/poi";

@Component({
  selector: 'app-poi-navigation-toolbar',
  templateUrl: './poi-navigation-toolbar.component.html',
  styleUrls: ['./poi-navigation-toolbar.component.scss'],
})
export class PoiNavigationToolbarComponent {

  @Input() poi: Poi;

  @Output() navigateBack = new EventEmitter<void>();
  @Output() selectNextPoi = new EventEmitter<void>();
  @Output() selectPreviousPoi = new EventEmitter<void>();

  @Input() hasNextPoi: boolean;
  @Input() hasPreviousPoi: boolean;
  @Input() navigatorLabel: string;
  @Input() showNavigationButtons: boolean;

  navigateBackClicked() {
    this.navigateBack.emit();
  }

  selectPreviousPoiClicked() {
    this.selectPreviousPoi.emit();
  }

  selectNextPoiClicked() {
    this.selectNextPoi.emit();
  }

}
