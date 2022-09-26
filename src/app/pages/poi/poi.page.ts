import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {ImageService} from "../../services/image.service";
import {Poi} from "../../data/poi";
import {LatLon} from "../../data/lat-lon";
import {Subscription} from "rxjs";
import {LatLng, LatLngExpression, LayerGroup, TileLayer, Marker, Circle, Map, Control, control} from 'leaflet';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.page.html',
  styleUrls: ['./poi.page.scss'],
})
export class PoiPage implements OnInit {

  poi: Poi;
  poiSubscription$: Subscription;
  showProgress: boolean;

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('poiMapDiv') poiMapContainer;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private poisOverpassService: PoisOverpassService
  ) {
  }

  ngOnInit(): void {
    this.showProgress = true;
    const poiIdEncoded = this.route.snapshot.paramMap.get('id');
    const localPoiIdDecoded = poiIdEncoded.replace("-", "").replace("/", "");
    this.poiSubscription$ = this.poisOverpassService.searchPoi(localPoiIdDecoded).subscribe(poi => {
      this.poi = poi;
      this.sleep(500).then(() => {
        this.constructMap(poi.coordinates);
        this.showProgress = false;
      });
    });
  }

  private constructMap(coordinates: LatLon) {
    const mapCenter: LatLngExpression = new LatLng(coordinates.lat, coordinates.lon);

    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    const poiPositionLayer = new LayerGroup();
    const poiPositionMarker = new Marker(mapCenter, {
      draggable: false,
      icon: this.imageService.loadMarkerIcon()
    });
    poiPositionLayer.addLayer(poiPositionMarker);

    const poiMap = new Map(this.poiMapContainer.nativeElement, {
      doubleClickZoom: false,
      scrollWheelZoom: false,
      center: mapCenter,
      zoom: 17,
      layers: [osmTileLayer, poiPositionLayer]
    });
    const osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    poiMap.attributionControl.addAttribution(osmAttribution);
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  ngOnDestroy(): void {
    if (this.poiSubscription$) {
      this.poiSubscription$.unsubscribe()
    }
  }
}
