import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscoverSearchModalComponent } from './discover-search-modal.component';
import {SearchAttributes} from "../../../../data/search-attributes";
import {LatLon} from "../../../../data/lat-lon";
import {Component, Input} from "@angular/core";

describe('DiscoverSearchModalComponent', () => {
  let component: DiscoverSearchModalComponent;
  let fixture: ComponentFixture<DiscoverSearchModalComponent>;

  @Component({
    selector: 'app-my-position-map',
    template: ''
  })
  class TestMyPositionMapComponent {
    @Input() myPosition: LatLon;
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiscoverSearchModalComponent,
        TestMyPositionMapComponent
      ],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverSearchModalComponent);
    component = fixture.componentInstance;

    component.searchAttributes = new SearchAttributes(new LatLon(1,2), 100, 'bench');

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
