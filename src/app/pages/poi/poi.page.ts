import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {Poi} from "../../data/poi";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-poi',
  templateUrl: './poi.page.html',
  styleUrls: ['./poi.page.scss'],
})
export class PoiPage implements OnInit {

  poi: Poi;
  poiSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private poisOverpassService: PoisOverpassService
  ) {
  }

  ngOnInit(): void {
    const poiIdEncoded = this.route.snapshot.paramMap.get('id');
    const localPoiIdDecoded = poiIdEncoded.replace("-", "").replace("/", "");
    this.poiSubscription$ = this.poisOverpassService.searchPoi(localPoiIdDecoded).subscribe(poi => this.poi = poi);
  }

  ngOnDestroy(): void {
    if (this.poiSubscription$) {
      this.poiSubscription$.unsubscribe()
    }
  }
}
