import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscoverMapComponent } from './discover-map.component';
import {LatLon} from "../../../../data/lat-lon";
import {CategoryEntry} from "../../../../data/category-entry";
import {SearchAttributes} from "../../../../data/search-attributes";

describe('DiscoverMapComponent', () => {
  let component: DiscoverMapComponent;
  let fixture: ComponentFixture<DiscoverMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverMapComponent);
    component = fixture.componentInstance;

    component.initialMapCenter = new LatLon(52.908, 8.588);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
