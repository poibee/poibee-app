import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscoverSearchToolbarComponent } from './discover-search-toolbar.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('DiscoverSearchToolbarComponent', () => {
  let component: DiscoverSearchToolbarComponent;
  let fixture: ComponentFixture<DiscoverSearchToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverSearchToolbarComponent ],
      imports: [IonicModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverSearchToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
