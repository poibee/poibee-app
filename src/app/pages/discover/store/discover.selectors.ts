import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromDiscover from './discover.reducer';

export const selectDiscoverState = createFeatureSelector<fromDiscover.State>(
  fromDiscover.discoverFeatureKey
);

export const getPoisOfSearchAttributes = createSelector(
  selectDiscoverState,
  state => {
    return {searchAttributes: state.searchAttributes, pois: state.pois}
  }
);

export const getSearchActive = createSelector(
  selectDiscoverState,
  state => state.searchActive
);
