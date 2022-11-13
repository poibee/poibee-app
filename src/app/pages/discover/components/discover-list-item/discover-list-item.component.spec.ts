import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, NavController} from '@ionic/angular';

import { DiscoverListItemComponent } from './discover-list-item.component';
import {OwnPosition} from "../../../../data/own-position";
import {DirectionTypes} from "../../../../data/direction";
import {Attributes} from "../../../../data/attributes";
import {Contact} from "../../../../data/contact";
import {Cuisine} from "../../../../data/cuisine";
import {References} from "../../../../data/references";
import {Poi} from "../../../../data/poi";

describe('DiscoverListItemComponent', () => {

  const ownPosition = new OwnPosition(null, 0, DirectionTypes.NE);
  const attributes = new Attributes(Cuisine.of('German'), null, null, false, false, false);
  const contact = new Contact(null, null, null, null, null, null);
  const references = new References(null, null, null, null, null);
  const poi = new Poi('myId', 'myName', ['myCategory'], null, ownPosition, attributes, contact, references, {}, 1, '{}');

  let component: DiscoverListItemComponent;
  let fixture: ComponentFixture<DiscoverListItemComponent>;

  beforeEach(waitForAsync(() => {
    const navCtrlMock = {
      navigateRoot: (url: string) => {}
    };
    spyOn(navCtrlMock, 'navigateRoot').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [ DiscoverListItemComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: NavController, useValue: navCtrlMock},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverListItemComponent);
    component = fixture.componentInstance;

    component.poi = poi;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.poi.id).toBe('myId');
    expect(component.poi.name).toBe('myName');
  });

});
