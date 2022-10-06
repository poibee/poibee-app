import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Distance, SearchDistance} from "../../../../data/search-distance";
import {LatLon} from "../../../../data/lat-lon";
import {SearchAttributes} from "../../../../data/search-attributes";

@Component({
  selector: 'app-discover-search-modal',
  templateUrl: './discover-search-modal.component.html',
  styleUrls: ['./discover-search-modal.component.scss'],
})
export class DiscoverSearchModalComponent implements OnInit {

  @Input() searchAttributes: SearchAttributes;

  public distanceArray = SearchDistance.ALL;
  public categoryArray = ['attraction', 'bakery', 'bench', 'cinema', 'fuel', 'playground', 'restaurant', 'zoo', 'all'];

  public selectedPosition: LatLon;
  public selectedDistance: number;
  public selectedCategory: string;

  constructor(
    private modalController: ModalController) {
  }

  ngOnInit() {
    this.selectedPosition = this.searchAttributes.position;
    this.selectedDistance = this.searchAttributes.distance;
    this.selectedCategory = this.searchAttributes.category;
  }

  updateSearchCategory(event: any) {
    const category = event.target.value;
    this.selectedCategory = category;
  }

  updateSearchPosition(value: LatLon) {
    this.selectedPosition = value;
  }

  updateSearchDistance(event: any) {
    const distance = event.target.value;
    this.selectedDistance = distance;
  }

  selectCategory(value: any) {
    this.selectedCategory = value;
  }

  startSearch() {
    const attributes = new SearchAttributes(this.selectedPosition, this.selectedDistance, this.selectedCategory)
    this.searchAttributes = attributes;
    this.modalController.dismiss(attributes, 'confirm');
  }

  cancel() {
    return this.modalController.dismiss();
  }

  openCategoryModal() {
    alert("Selected Category: " + this.selectedCategory)
  }

}
