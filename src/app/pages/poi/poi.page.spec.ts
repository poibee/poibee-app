import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PoiPage, PoiPageValueType} from './poi.page';
import {of} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";

import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {LatLon} from "../../data/lat-lon";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {PoiId} from "../../data/poi-id";
import {Store} from "@ngrx/store";
import {Poi} from "../../data/poi";
import {Contact} from "../../data/contact";


describe('PoiPage', () => {
  let component: PoiPage;
  let fixture: ComponentFixture<PoiPage>;

  let poisOverpassServiceMock;
  let discoverStoreMock;

  beforeEach(waitForAsync(() => {

    const poiPageValue: PoiPageValueType = {
      navigatorLabel: "",
      searchCenter: new LatLon(1.1, 2.2),
      hasNextPoi: false,
      showNavigationButtons: false,
      hasPreviousPoi: false,
      poi: new Poi(PoiId.of('node-12345'), ['myCategory'], null, null, null, new Contact('poiName', null, null, null, null, null), null, 1, '{}', null)
    }
    discoverStoreMock = {
      pipe: (selector: any) => of(poiPageValue)
    };
    spyOn(discoverStoreMock, 'pipe').and.callThrough();

    poisOverpassServiceMock = {
      searchPoi: (poiId: PoiId) => of({
        id: PoiId.ofOsm('node/12345'),
        categories: ['myCategory'],
        coordinates: new LatLon(1.1, 2.2),
        attributes: {},
        contact: {
          name: 'poiName'
        },
        references: {}
      })
    };
    spyOn(poisOverpassServiceMock, 'searchPoi').and.callThrough();

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [PoiPage],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock},
        {provide: Store, useValue: discoverStoreMock},
        {
          provide: ActivatedRoute, useValue:
            {snapshot: {paramMap: convertToParamMap({'id': 'node-12345'})}}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.poi.id).toEqual(PoiId.of('node-12345'));
    expect(component.poi.contact.name).toBe('poiName');
  });
});
