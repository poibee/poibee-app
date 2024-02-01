import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoiReferencesComponent } from './poi-references.component';
import {Poi} from '../../../../data/poi';
import {OwnPosition} from '../../../../data/own-position';
import {References} from '../../../../data/references';
import {PoiId} from '../../../../data/poi-id';
import {WikipediaEntry} from '../../../../data/wikipedia-entry';
import {WikidataEntry} from '../../../../data/wikidata-entry';

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

    const references = new References('a', 'b', 'c', WikipediaEntry.of('d'), WikidataEntry.of('e'));
    component.poi = new Poi(PoiId.of('node-1'), ['myCategory'], null, new OwnPosition(null, 0, null), null, null, references, 1, '{}', null);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
