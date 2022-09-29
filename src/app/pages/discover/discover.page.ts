import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {sortTypesAsArray} from "../../data/sort-types";
import {LatLon} from "../../data/lat-lon";
import {Poi} from "../../data/poi";
import {Subscription} from "rxjs";
import {NavController} from "@ionic/angular";
import {PoisOverpassService} from "../../services/pois-overpass.service";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private poisOverpassService: PoisOverpassService) {
  }

  pois: Poi[] = [];

  private selectedSort: string = sortTypesAsArray()[0][0];
  private filterValue: string = '';
  private allPois: Poi[] = [];

  private subscription: Subscription;

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateSelectedSort(value: any) {
    this.selectedSort = value;
    this.updatePois();
  }

  updateFilterValue(value: any) {
    this.filterValue = value;
    this.updatePois();
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
