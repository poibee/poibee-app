import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DiscoverEffects } from './discover.effects';

describe('DiscoverEffects', () => {
  let actions$: Observable<any>;
  let effects: DiscoverEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
