import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoiOverviewComponent } from './poi-overview.component';
import {Poi} from "../../../../data/poi";
import {OwnPosition} from "../../../../data/own-position";
import {References} from "../../../../data/references";
import {Attributes} from "../../../../data/attributes";

describe('PoiOverviewComponent', () => {
  let component: PoiOverviewComponent;
  let fixture: ComponentFixture<PoiOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PoiOverviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiOverviewComponent);
    component = fixture.componentInstance;

    const attributes = new Attributes('a', 'b', false, false, false);
    component.poi = new Poi('myId', 'myName', ['myCategory'], null, new OwnPosition(null, 0), attributes, null, null, {}, 1, '{}');

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
