import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, NavController} from '@ionic/angular';

import {DiscoverListComponent} from './discover-list.component';
import {Poi} from "../../../../data/poi";
import {OwnPosition} from "../../../../data/own-position";
import {DirectionTypes} from "../../../../data/direction";
import {Attributes} from "../../../../data/attributes";
import {Contact} from "../../../../data/contact";
import {References} from "../../../../data/references";

describe('DiscoverListComponent', () => {
  let component: DiscoverListComponent;
  let fixture: ComponentFixture<DiscoverListComponent>;

  const ownPosition = new OwnPosition(null, 0, DirectionTypes.NE);
  const attributes = new Attributes(null, null, false, false, false);
  const contact = new Contact(null, null, null, null, null, null);
  const references = new References(null, null, null, null, null);
  const pois = [
    new Poi('myId', 'myName', ['myCategory'], null, ownPosition, attributes, contact, references, {}, 1, '{}'),
    new Poi('otherId', 'otherName', ['otherCategory'], null, ownPosition, attributes, contact, references, {}, 1, '{}'),
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
