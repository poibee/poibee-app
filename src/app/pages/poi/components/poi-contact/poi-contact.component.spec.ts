import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PoiContactComponent} from './poi-contact.component';
import {Poi} from "../../../../data/poi";
import {Contact} from "../../../../data/contact";
import {OwnPosition} from "../../../../data/own-position";

describe('PoiContactComponent', () => {
  let component: PoiContactComponent;
  let fixture: ComponentFixture<PoiContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoiContactComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiContactComponent);
    component = fixture.componentInstance;

    const contact = new Contact('a', 'b', 'c', 'd', 'e', 'f');
    component.poi = new Poi('myId', 'myName', ['myCategory'], null, new OwnPosition(null, 0), null, contact, null, {}, 1, '{}');

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
