import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CategoryEntry} from '../../../../data/category-entry';

@Component({
  selector: 'app-category-modal-main-item',
  templateUrl: './category-modal-main-item.component.html',
  styleUrls: ['./category-modal-main-item.component.scss'],
})
export class CategoryModalMainItemComponent implements OnInit, OnChanges {

  @Input() mainCategory: CategoryEntry; // the main category of this component
  @Input() selectedCategory: CategoryEntry; // the one selection of all categories

  @Output() selectedCategoryUpdated = new EventEmitter<CategoryEntry>();

  mainCategorySelected = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mainCategorySelected = this.mainCategory === this.selectedCategory.mainCategory;
  }

  updateSelectedCategory(category: CategoryEntry) {
    this.selectedCategoryUpdated.emit(category);
  }

  sorted(children: CategoryEntry[]) {
    return children.sort((c1, c2) => c1.label.localeCompare(c2.label));
  }
}
