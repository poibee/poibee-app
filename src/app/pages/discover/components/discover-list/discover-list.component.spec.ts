import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, NavController} from '@ionic/angular';

import {DiscoverListComponent} from './discover-list.component';
import {of} from "rxjs";
import {PoisOverpassService} from "../../../../services/pois-overpass.service";
import {LatLon} from "../../../../data/lat-lon";
import {Poi} from "../../../../data/poi";

describe('DiscoverListComponent', () => {
  let component: DiscoverListComponent;
  let fixture: ComponentFixture<DiscoverListComponent>;

  const pois = [
    new Poi('myId', 'myName', ['myCategory'], null, null, null, null, {}),
    new Poi('otherId', 'otherName', ['otherCategory'], null, null, null, null, {}),
  ];

  beforeEach(waitForAsync(() => {
    const navCtrlMock = {
      navigateRoot: (url: string) => {}
    };
    spyOn(navCtrlMock, 'navigateRoot').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [DiscoverListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: NavController, useValue: navCtrlMock},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverListComponent);
    component = fixture.componentInstance;

    component.filteredPois = pois;

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
