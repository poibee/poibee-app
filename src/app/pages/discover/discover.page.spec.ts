import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {DiscoverPage} from './discover.page';
import {of} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {LatLon} from "../../data/lat-lon";
import {Poi} from "../../data/poi";
import {OwnPosition} from "../../data/own-position";
import {INITIAL_SEARCH_ATTRIBUTES} from "../../data/search-attributes";
import {PoiId} from "../../data/poi-id";
import {Store} from "@ngrx/store";
import {Contact} from "../../data/contact";

describe('DiscoverPage', () => {
  let component: DiscoverPage;
  let fixture: ComponentFixture<DiscoverPage>;

  beforeEach(waitForAsync(() => {

    const poisOverpassServiceMock = {
      searchPois: (position: LatLon, distance: number, category: string) => of([
        new Poi(PoiId.of('node-1'), ['myCategory'], new LatLon(1.1, 2.2), new OwnPosition(null, 1, null), null, Contact.of('myName'), null, 1, '{}', null),
        new Poi(PoiId.of('node-2'), ['otherCategory'], null, new OwnPosition(null, 2, null), null, Contact.of('otherName'), null, 1, '{}', null)
      ])
    };
    spyOn(poisOverpassServiceMock, 'searchPois').and.callThrough();

    const discoverStoreMock = {
      pipe: (data: any) => of(INITIAL_SEARCH_ATTRIBUTES),
      dispatch: (data: any) => {}
    };
    spyOn(discoverStoreMock, 'pipe').and.callThrough();
    spyOn(discoverStoreMock, 'dispatch').and.callThrough();

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock},
        {provide: Store, useValue: discoverStoreMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // this test isn't usefull at the moment
  /*
    it('should create', () => {
      expect(component).toBeTruthy();

      component.poisLoaded(INITIAL_SEARCH_ATTRIBUTES, pois);

      expect(component.filteredPois.length).toBe(2);

    expect(component.filteredPois[0].id).toEqual(PoiId.of('node-1'));
    expect(component.filteredPois[0].contact.name).toBe('myName');
    expect(component.filteredPois[0].categories).toEqual(['myCategory']);
    expect(component.filteredPois[0].coordinates).toEqual(new LatLon(1.1, 2.2));

      expect(component.filteredPois[1].id).toEqual(PoiId.of('node-2'));
  });
  */
});
