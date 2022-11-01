import {Component, Input, OnDestroy, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Poi} from "../../../../data/poi";
import {PoisOverpassService} from "../../../../services/pois-overpass.service";
import {LatLon} from "../../../../data/lat-lon";
import {Subscription} from "rxjs";
import {NavController} from "@ionic/angular";
import {sortTypesAsArray} from "../../../../data/sort-types";

@Component({
  selector: 'app-discover-list',
  templateUrl: './discover-list.component.html',
  styleUrls: ['./discover-list.component.scss'],
})
export class DiscoverListComponent {

  @Input() pois: Poi[] = [];

  constructor(
    private navCtrl: NavController) {
  }

  navigateTo(poi: Poi) {
    const poiId = poi.id.replace("/", "-");
    this.navCtrl.navigateRoot("/poi/" + poiId)
    // TODO: redirectTo einsetzen (siehe Buch, Seite 168)
  }
}
