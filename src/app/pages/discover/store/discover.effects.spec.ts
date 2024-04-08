import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable, of} from 'rxjs';

import {DiscoverEffects} from './discover.effects';
import {PoisOverpassService} from '../../../services/pois-overpass.service';
import {LatLon} from '../../../data/lat-lon';
import {Store} from "@ngrx/store";

describe('DiscoverEffects', () => {
  let actions$: Observable<any>;
  let effects: DiscoverEffects;

  beforeEach(() => {
    const discoverStoreMock = {
      pipe: (selector: any) => of({})
    };
    spyOn(discoverStoreMock, 'pipe').and.callThrough();

    const poisOverpassServiceMock = {
      searchPois: (position: LatLon, distance: number, category: string) => of([])
    };
    spyOn(poisOverpassServiceMock, 'searchPois').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
        {provide: PoisOverpassService, useValue: poisOverpassServiceMock},
        {provide: Store, useValue: discoverStoreMock},
        DiscoverEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(DiscoverEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
