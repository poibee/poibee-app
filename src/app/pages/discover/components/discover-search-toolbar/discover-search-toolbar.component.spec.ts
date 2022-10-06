import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscoverSearchToolbarComponent } from './discover-search-toolbar.component';
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DiscoverPageRoutingModule} from "../../discover-routing.module";
import {DiscoverFilterToolbarComponent} from "../discover-filter-toolbar/discover-filter-toolbar.component";
import {DiscoverListComponent} from "../discover-list/discover-list.component";
import {DiscoverSearchModalComponent} from "../discover-search-modal/discover-search-modal.component";
import {MyPositionMapComponent} from "../my-position-map/my-position-map.component";
import {DiscoverPage} from "../../discover.page";

describe('DiscoverSearchToolbarComponent', () => {
  let component: DiscoverSearchToolbarComponent;
  let fixture: ComponentFixture<DiscoverSearchToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverSearchToolbarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverSearchToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
