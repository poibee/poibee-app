import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromDiscover from './discover.reducer';

export const selectDiscoverState = createFeatureSelector<fromDiscover.State>(
  fromDiscover.discoverFeatureKey
);

export const getSearchAttributes = createSelector(
  selectDiscoverState,
  state => {
    return {searchAttributes: state.searchAttributes}
  }
);

export const getFoundPois = createSelector(
  selectDiscoverState,
  state => {
    return {filteredPois: state.pois, allPois: state.allPois}
  }
);

export const getSearchActive = createSelector(
  selectDiscoverState,
  state => state.searchActive
);

export const getSelectedPoi = createSelector(
  selectDiscoverState,
  state => state.selectedPoi
);

export const getSelectedSort = createSelector(
  selectDiscoverState,
  state => state.selectedSort
);

export const getFilterValue = createSelector(
  selectDiscoverState,
  state => state.filterValue
);

export const getSelectedPoiText = createSelector(
  selectDiscoverState,
  state => state.selectedPoiText
);
