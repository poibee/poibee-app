import {Component, Input, OnInit} from '@angular/core';
import {Poi} from "../../../../data/poi";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-discover-list-item',
  templateUrl: './discover-list-item.component.html',
  styleUrls: ['./discover-list-item.component.scss'],
})
export class DiscoverListItemComponent {

  @Input() poi: Poi;
  @Input() index: number;

  constructor(
    private navCtrl: NavController) {
  }

  navigateTo(poi: Poi) {
    this.navCtrl.navigateRoot("/poi/" + poi.id.toString())
    // TODO: redirectTo einsetzen (siehe Buch, Seite 168)
  }

}
