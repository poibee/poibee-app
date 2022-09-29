import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {DiscoverPage} from './discover.page';
import {of} from "rxjs";
import {PoisOverpassService} from "../../services/pois-overpass.service";
import {LatLon} from "../../data/lat-lon";
import {Poi} from "../../data/poi";

describe('DiscoverPage', () => {
  let component: DiscoverPage;
  let fixture: ComponentFixture<DiscoverPage>;

  beforeEach(waitForAsync(() => {

    const poisOverpassServiceMock = {
      searchPois: (position: LatLon, distance: number, category: string) => of([
        new Poi('myId', 'myName', ['myCategory'], new LatLon(1.1, 2.2), null, null, null, {}),
        new Poi('otherId', 'otherName', ['otherCategory'], null, null, null, null, {})
      ])
    };
    spyOn(poisOverpassServiceMock, 'searchPois').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [DiscoverPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.pois.length).toBe(2);

    expect(component.pois[0].id).toBe('myId');
    expect(component.pois[0].name).toBe('myName');
    expect(component.pois[0].categories).toEqual(['myCategory']);
    expect(component.pois[0].coordinates).toEqual(new LatLon(1.1, 2.2));

    expect(component.pois[1].id).toBe('otherId');
  });
});
