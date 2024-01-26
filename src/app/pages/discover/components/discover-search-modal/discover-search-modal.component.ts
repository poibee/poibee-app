import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SearchDistance} from '../../../../data/search-distance';
import {LatLon} from '../../../../data/lat-lon';
import {SearchAttributes} from '../../../../data/search-attributes';
import {CategoryModalComponent} from '../category-modal/category-modal.component';
import {CategoryEntry} from '../../../../data/category-entry';
import {CategoryService} from '../../../../services/category.service';

@Component({
  selector: 'app-discover-search-modal',
  templateUrl: './discover-search-modal.component.html',
  styleUrls: ['./discover-search-modal.component.scss'],
})
export class DiscoverSearchModalComponent implements OnInit {

  @Input() searchAttributes: SearchAttributes;

  public distanceArray = SearchDistance.all;
  public favoriteCategoryArray: CategoryEntry[];

  public selectedPosition: LatLon;
  public selectedDistance: number;
  public selectedCategory: CategoryEntry;

  constructor(
    private categoryService: CategoryService,
    private modalController: ModalController) {
  }

  ngOnInit() {
    this.favoriteCategoryArray = this.categoryService.favoriteCategories();
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

  selectCategory(value: CategoryEntry) {
    this.selectedCategory = value;
  }

  startSearch() {
    const attributes = new SearchAttributes(this.selectedPosition, this.selectedDistance, this.selectedCategory);
    this.searchAttributes = attributes;
    this.modalController.dismiss(attributes, 'confirm');
  }

  cancel() {
    this.modalController.dismiss();
  }

  async openCategoryModal() {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      cssClass: 'category-modal',
      animated: true,
      backdropDismiss: true,
      componentProps: {
        selectedCategory: this.selectedCategory
      }
    });
    modal.present();

    const {data}: {data?: CategoryEntry} = await modal.onWillDismiss();
    if (data) {
      this.selectedCategory = data;
    }
  }
}
