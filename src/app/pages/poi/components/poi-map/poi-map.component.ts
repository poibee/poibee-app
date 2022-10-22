import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Poi} from "../../../../data/poi";
import {LatLon} from "../../../../data/lat-lon";
import {ImageService} from "../../../../services/image.service";
import {LayerGroup, Map, Marker, TileLayer} from "leaflet";

@Component({
  selector: 'app-poi-map',
  templateUrl: './poi-map.component.html',
  styleUrls: ['./poi-map.component.scss'],
})
export class PoiMapComponent implements OnInit, OnChanges {

  @Input() poi: Poi;
  @Input() searchCenter: LatLon;
  @Input() showProgress: boolean;

  private ngOnInitDone: boolean;
  private poiMap: Map;
  private poiPositionLayer: LayerGroup;
  private searchCenterLayer: LayerGroup;

  // https://stackoverflow.com/questions/42428251/initializing-leaflet-map-in-angular2-component-after-dom-object-exists/42431059#42431059
  @ViewChild('poiMapDiv') private poiMapContainer;

  constructor(
    private imageService: ImageService
  ) {
  }

  ngOnInit() {
    this.ngOnInitDone = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ngOnInitDone && !this.poiMap && this.poi) {
      this.constructMap(this.poi.coordinates)
    }
    if (this.searchCenter && this.searchCenterLayer && this.searchCenterLayer.getLayers().length == 0) {
      this.updateSearchCenter(this.searchCenter)
    }
    if (this.poiMap && this.poi) {
      this.updatePoiOfMap(this.poi)
    }
  }

  private constructMap(mapCenter: LatLon) {
    const osmTileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });
    this.searchCenterLayer = new LayerGroup();
    this.poiPositionLayer = new LayerGroup();

    this.poiMap = new Map(this.poiMapContainer.nativeElement, {
      doubleClickZoom: false,
      scrollWheelZoom: false,
      center: mapCenter.asLatLng(),
      zoom: 17,
      layers: [osmTileLayer, this.searchCenterLayer, this.poiPositionLayer]
    });

    const osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap-X</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    this.poiMap.attributionControl.addAttribution(osmAttribution);
  }

  private updateSearchCenter(searchCenter: LatLon) {
    this.searchCenterLayer.addLayer(new Marker(searchCenter.asLatLng(), {
      draggable: false,
      icon: this.imageService.loadMarkerIcon()
    }));
  }

  private updatePoiOfMap(poi: Poi) {
    this.poiPositionLayer.clearLayers();
    this.poiPositionLayer.addLayer(new Marker(poi.coordinates.asLatLng(), {
      draggable: false,
      icon: this.imageService.loadCategoryIcon(poi.categories[0].toLowerCase())
    }));
    this.poiMap.flyTo(poi.coordinates.asLatLng(), this.poiMap.getZoom());
  }
}
