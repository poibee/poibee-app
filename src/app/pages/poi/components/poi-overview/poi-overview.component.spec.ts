import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PoiOverviewComponent} from './poi-overview.component';
import {Poi} from '../../../../data/poi';
import {OwnPosition} from '../../../../data/own-position';
import {Attributes} from '../../../../data/attributes';
import {Cuisine} from '../../../../data/cuisine';
import {DirectionTypes} from '../../../../data/direction';
import {PoiId} from '../../../../data/poi-id';

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

    const attributes = new Attributes(Cuisine.of('a'), 'b', null, false, false, false);
    component.poi = new Poi(PoiId.of('node-1'), ['myCategory'], null, new OwnPosition(null, 0, DirectionTypes.ne), attributes, null, null, 1, '{}', null);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
