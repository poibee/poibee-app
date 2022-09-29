import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {sortTypesAsArray} from "../../data/sort-types";
import {LatLon} from "../../data/lat-lon";
import {Poi} from "../../data/poi";
import {Subscription} from "rxjs";
import {NavController} from "@ionic/angular";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {PoisFilterService} from "../../services/pois-filter.service";
import {PoisSorterService} from "../../services/pois-sorter.service";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private poisOverpassService: PoisOverpassService,
    private poisFilterService: PoisFilterService,
    private poisSorterService: PoisSorterService) {
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
    const filteredPois = this.poisFilterService.filterPois(this.allPois, this.filterValue);
    const sortedPois = this.poisSorterService.sortPois(filteredPois, this.selectedSort);
    this.pois = sortedPois;
  }

}
