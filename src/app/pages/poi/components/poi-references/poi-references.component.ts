import {Component, Input} from '@angular/core';
import {Poi} from '../../../../data/poi';

@Component({
  selector: 'app-poi-references',
  templateUrl: './poi-references.component.html',
  styleUrls: ['./poi-references.component.scss'],
})
export class PoiReferencesComponent {

  @Input() poi: Poi;

}
