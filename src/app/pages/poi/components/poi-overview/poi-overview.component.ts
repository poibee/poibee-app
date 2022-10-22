import {Component, Input} from '@angular/core';
import {Poi} from "../../../../data/poi";

@Component({
  selector: 'app-poi-overview',
  templateUrl: './poi-overview.component.html',
  styleUrls: ['./poi-overview.component.scss'],
})
export class PoiOverviewComponent {

  @Input() poi: Poi;

}
