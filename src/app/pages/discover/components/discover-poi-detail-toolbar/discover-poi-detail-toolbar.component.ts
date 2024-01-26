import {Component, Input} from '@angular/core';
import {Poi} from '../../../../data/poi';

@Component({
  selector: 'app-discover-poi-detail-toolbar',
  templateUrl: './discover-poi-detail-toolbar.component.html',
  styleUrls: ['./discover-poi-detail-toolbar.component.scss'],
})
export class DiscoverPoiDetailToolbarComponent {

  @Input() poi: Poi;

}
