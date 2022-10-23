import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {StateService} from "../../../../services/state.service";
import {Poi} from "../../../../data/poi";

@Component({
  selector: 'app-poi-navigation-toolbar',
  templateUrl: './poi-navigation-toolbar.component.html',
  styleUrls: ['./poi-navigation-toolbar.component.scss'],
})
export class PoiNavigationToolbarComponent implements OnInit, OnChanges {

  @Input() poi: Poi;

  @Output() navigateBack = new EventEmitter<void>();
  @Output() selectNextPoi = new EventEmitter<void>();
  @Output() selectPreviousPoi = new EventEmitter<void>();

  hasNextPoi: boolean;
  hasPreviousPoi: boolean;
  navigatorLabel: string;
  showNavigationButtons: boolean;

  constructor(
    private stateService: StateService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateNavigatorElements();
  }

  navigateBackClicked() {
    this.navigateBack.emit();
  }

  selectPreviousPoiClicked() {
    this.selectPreviousPoi.emit();
  }

  selectNextPoiClicked() {
    this.selectNextPoi.emit();
  }

  private updateNavigatorElements() {
    this.hasPreviousPoi = this.stateService.hasPreviousPoi();
    this.hasNextPoi = this.stateService.hasNextPoi();
    this.navigatorLabel = this.stateService.navigatorLabel();
    this.showNavigationButtons = this.stateService.isPoiOfList();
  }

}
