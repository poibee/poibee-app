import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDiscover from './discover.reducer';

export const selectDiscoverState = createFeatureSelector<fromDiscover.State>(
  fromDiscover.discoverFeatureKey
);

export const getSearchAttributes = createSelector(
  selectDiscoverState,
  state => state.searchAttributes
);
