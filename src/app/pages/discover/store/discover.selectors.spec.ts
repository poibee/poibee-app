import * as fromDiscover from './discover.reducer';
import { selectDiscoverState } from './discover.selectors';
import {State} from "./discover.reducer";

describe('Discover Selectors', () => {
  it('should select the feature state', () => {
    const result = selectDiscoverState({
      [fromDiscover.discoverFeatureKey]: {}
    });

    expect(result).toEqual({} as State);
  });
});
