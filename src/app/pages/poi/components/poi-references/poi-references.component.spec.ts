import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoiReferencesComponent } from './poi-references.component';
import {Poi} from "../../../../data/poi";
import {OwnPosition} from "../../../../data/own-position";
import {References} from "../../../../data/references";
import {PoiId} from "../../../../data/poi-id";

describe('PoiReferencesComponent', () => {
  let component: PoiReferencesComponent;
  let fixture: ComponentFixture<PoiReferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PoiReferencesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiReferencesComponent);
    component = fixture.componentInstance;

    const references = new References('a', 'b', 'c', 'd', 'e');
    component.poi = new Poi(PoiId.of('node-1'), 'myName', ['myCategory'], null, new OwnPosition(null, 0, null), null, null, references, 1, '{}', null);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
