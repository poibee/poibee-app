import {Component, Input} from '@angular/core';
import {Poi} from "../../../../data/poi";

@Component({
  selector: 'app-poi-raw-data',
  templateUrl: './poi-raw-data.component.html',
  styleUrls: ['./poi-raw-data.component.scss'],
})
export class PoiRawDataComponent {

  @Input() poi: Poi;

}
