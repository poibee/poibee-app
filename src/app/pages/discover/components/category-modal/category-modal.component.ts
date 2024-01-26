import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CategoryEntry} from '../../../../data/category-entry';
import {CategoryService} from '../../../../services/category.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent implements OnInit {

  allCategories: CategoryEntry[];
  @Input() selectedCategory: CategoryEntry;

  constructor(
    private categoryService: CategoryService,
    private modalController: ModalController) {
    this.allCategories = this.categoryService.all();
  }

  ngOnInit() {
  }

  updateSelectedCategory($event: CategoryEntry) {
    this.selectedCategory = $event;
  }

  cancel() {
    this.modalController.dismiss();
  }

  selectCategory() {
    this.modalController.dismiss(this.selectedCategory, 'confirm');
  }
}
