import {Component, Input} from '@angular/core';
import {Poi} from "../../../../data/poi";

@Component({
  selector: 'app-poi-contact',
  templateUrl: './poi-contact.component.html',
  styleUrls: ['./poi-contact.component.scss'],
})
export class PoiContactComponent {

  @Input() poi: Poi;

}

