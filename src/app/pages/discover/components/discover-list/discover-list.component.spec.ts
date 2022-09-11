import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, NavController} from '@ionic/angular';

import {DiscoverListComponent} from './discover-list.component';
import {of} from "rxjs";
import {PoisOverpassService} from "../../../../services/pois-overpass.service";
import {LatLon} from "../../../../data/lat-lon";

describe('DiscoverListComponent', () => {
  let component: DiscoverListComponent;
  let fixture: ComponentFixture<DiscoverListComponent>;

  let poisOverpassServiceMock;
  let navCtrlMock;

  beforeEach(() => {
    poisOverpassServiceMock = {
      searchPois: (position: LatLon, distance: number, category: string) => of([
        {
          id: 'myId',
          name: 'myName',
          categories: ['myCategory'],
          coordinates: {
            lat: 1.1,
            lon: 2.2
          },
          tags: {}
        }, {
          id: 'otherId',
          name: 'otherName',
          categories: ['otherCategory'],
          coordinates: {
            lat: 1.12,
            lon: 2.23
          },
          tags: {}
        }
      ])
    };
    spyOn(poisOverpassServiceMock, 'searchPois').and.callThrough();

    navCtrlMock = {
      navigateRoot: (url: string) => {}
    };
    spyOn(navCtrlMock, 'navigateRoot').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
        {provide: NavController, useValue: navCtrlMock},
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock}
      ]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverListComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.pois.length).toBe(2);

    expect(component.pois[0].id).toBe('myId');
    expect(component.pois[0].name).toBe('myName');

    expect(component.pois[1].id).toBe('otherId');
  });
});
