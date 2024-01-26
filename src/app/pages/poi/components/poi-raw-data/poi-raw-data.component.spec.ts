import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoiRawDataComponent } from './poi-raw-data.component';
import {Contact} from '../../../../data/contact';
import {Poi} from '../../../../data/poi';
import {OwnPosition} from '../../../../data/own-position';
import {PoiId} from '../../../../data/poi-id';

describe('PoiRawDataComponent', () => {
  let component: PoiRawDataComponent;
  let fixture: ComponentFixture<PoiRawDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PoiRawDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiRawDataComponent);
    component = fixture.componentInstance;

    component.poi = new Poi(PoiId.of('node-1'), ['myCategory'], null, new OwnPosition(null, 0, null), null, null, null, 1, '{}', null);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
