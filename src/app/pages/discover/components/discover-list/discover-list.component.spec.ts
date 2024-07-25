import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {DiscoverListComponent} from './discover-list.component';
import {Poi} from '../../../../data/poi';
import {OwnPosition} from '../../../../data/own-position';
import {DirectionTypes} from '../../../../data/direction';
import {Attributes} from '../../../../data/attributes';
import {Contact} from '../../../../data/contact';
import {References} from '../../../../data/references';
import {PoiId} from '../../../../data/poi-id';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('DiscoverListComponent', () => {
  let component: DiscoverListComponent;
  let fixture: ComponentFixture<DiscoverListComponent>;

  const ownPosition = new OwnPosition(null, 0, DirectionTypes.ne);
  const attributes = new Attributes(null, null, null, false, false, false);
  const references = new References(null, null, null, null, null);
  const pois = [
    new Poi(PoiId.of('node-1'), ['myCategory'], null, ownPosition, attributes, Contact.of('myName'), references, 1, '{}', null),
    new Poi(PoiId.of('node-2'), ['otherCategory'], null, ownPosition, attributes, Contact.of('otherName'), references, 1, '{}', null),
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverListComponent],
      imports: [IonicModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverListComponent);
    component = fixture.componentInstance;

    component.pois = pois;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.pois.length).toBe(2);

    expect(component.pois[0].id).toEqual(PoiId.of('node-1'));
    expect(component.pois[0].contact.name).toBe('myName');

    expect(component.pois[1].id).toEqual(PoiId.of('node-2'));
  });
});
