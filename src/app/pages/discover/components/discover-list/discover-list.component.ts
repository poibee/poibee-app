import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Poi} from '../../../../data/poi';

@Component({
  selector: 'app-discover-list',
  templateUrl: './discover-list.component.html',
  styleUrls: ['./discover-list.component.scss'],
})
export class DiscoverListComponent {

  @Output() selectPoiOutput = new EventEmitter<Poi>();

  @Input() pois: Poi[] = [];

  selectPoi(poi: Poi) {
    this.selectPoiOutput.emit(poi);
  }
}
