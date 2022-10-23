import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, NavController} from '@ionic/angular';

import {DiscoverListComponent} from './discover-list.component';
import {Poi} from "../../../../data/poi";
import {OwnPosition} from "../../../../data/own-position";
import {DirectionTypes} from "../../../../data/direction";

describe('DiscoverListComponent', () => {
  let component: DiscoverListComponent;
  let fixture: ComponentFixture<DiscoverListComponent>;

  const pois = [
    new Poi('myId', 'myName', ['myCategory'], null, new OwnPosition(null, 0, DirectionTypes.NE), null, null, null, {}, 1, '{}'),
    new Poi('otherId', 'otherName', ['otherCategory'], null, new OwnPosition(null, 0, DirectionTypes.NE), null, null, null, {}, 1, '{}'),
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

    component.pois = pois;

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
