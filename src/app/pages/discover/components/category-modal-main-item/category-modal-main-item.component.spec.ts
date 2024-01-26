import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryModalMainItemComponent } from './category-modal-main-item.component';
import {CategoryEntry} from '../../../../data/category-entry';

describe('CategoryModalMainItemComponent', () => {
  let component: CategoryModalMainItemComponent;
  let fixture: ComponentFixture<CategoryModalMainItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryModalMainItemComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryModalMainItemComponent);
    component = fixture.componentInstance;

    component.mainCategory = new CategoryEntry('all', 'All', []);
    component.selectedCategory = new CategoryEntry('bench', 'Bank', []);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
