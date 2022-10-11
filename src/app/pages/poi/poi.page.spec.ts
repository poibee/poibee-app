import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PoiPage} from './poi.page';
import {of} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";

import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {LatLon} from "../../data/lat-lon";


describe('PoiPage', () => {
  let component: PoiPage;
  let fixture: ComponentFixture<PoiPage>;

  let poisOverpassServiceMock;

  beforeEach(waitForAsync(() => {
    poisOverpassServiceMock = {
      searchPoi: (poiId: string) => of({
        id: 'myId/12345',
        name: 'myName',
        categories: ['myCategory'],
        coordinates: new LatLon(1.1, 2.2),
        attributes: {},
        contact: {},
        references: {}
      })
    };
    spyOn(poisOverpassServiceMock, 'searchPoi').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [PoiPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock},
        {
          provide: ActivatedRoute, useValue:
            {snapshot: {paramMap: convertToParamMap({'id': 'myId-12345'})}}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.poi.id).toBe('myId/12345');
    expect(component.poi.name).toBe('myName');
  });
});
