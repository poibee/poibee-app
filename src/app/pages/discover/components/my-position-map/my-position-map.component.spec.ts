import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyPositionMapComponent } from './my-position-map.component';
import {Input} from "@angular/core";
import {LatLon} from "../../../../data/lat-lon";

describe('DiscoverMapComponent', () => {
  let component: MyPositionMapComponent;
  let fixture: ComponentFixture<MyPositionMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPositionMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPositionMapComponent);
    component = fixture.componentInstance;

    component.myPosition = new LatLon(1,2);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
