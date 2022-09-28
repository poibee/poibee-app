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
export class DiscoverListComponent implements OnInit, OnDestroy, OnChanges {

  pois: Poi[] = [];

  @Input() selectedSort: string;
  @Input() filterValue: string;

  private allPois: Poi[] = [];
  private subscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private poisOverpassService: PoisOverpassService) {
  }

  ngOnInit() {
    const lat = 52.908;
    const lon = 8.588;
    const distance = 1000;
    const category = 'restaurant';
    this.subscription = this.poisOverpassService.searchPois(new LatLon(lat, lon), distance, category).subscribe(pois => {
      this.allPois = pois;
      this.updatePois();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePois();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateTo(poi: Poi) {
    const poiId = poi.id.replace("/", "-");
    this.navCtrl.navigateRoot("/poi/" + poiId)
  }

  private updatePois() {
    this.pois = this.sortedPois();
  }

  private sortedPois(): Poi[] {
    const copiedPois: Poi[] = [];
    this.allPois.forEach(poi => {
      if (this.filterValue.length == 0 || (poi.name && poi.name.toLowerCase().includes(this.filterValue.toLowerCase()))) {
        copiedPois.push(poi);
      }
    });
    const compareCategory = (p1: Poi, p2: Poi) => ('' + p1.categories[0]).localeCompare(p2.categories[0]);
    const compareName = (p1: Poi, p2: Poi) => ('' + p1.name).localeCompare(p2.name);
    let compareMethod = compareCategory || compareName;
    if (this.selectedSort === 'category') {
      compareMethod = compareCategory || compareName;
    } else if (this.selectedSort === 'name') {
      compareMethod = compareName || compareCategory;
    }
    const sortedPois = copiedPois.sort(compareMethod);
    return sortedPois;
  }

}
