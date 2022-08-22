import {Component, OnDestroy, OnInit} from '@angular/core';
import {Poi} from "../../../../data/poi";
import {PoisOverpassService} from "../../../../services/pois-overpass.service";
import {LatLon} from "../../../../data/lat-lon";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-discover-list',
  templateUrl: './discover-list.component.html',
  styleUrls: ['./discover-list.component.scss'],
})
export class DiscoverListComponent implements OnInit, OnDestroy {

  pois: Poi[] = [];
  private subscription: Subscription;

  constructor(
    private poisOverpassService: PoisOverpassService) {
  }

  ngOnInit() {
    const lat = 52.908;
    const lon = 8.588;
    const distance = 1000;
    const category = 'restaurant';
    this.subscription = this.poisOverpassService.searchPois(new LatLon(lat, lon), distance, category).subscribe(pois => this.pois = pois);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
