import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import * as fromDiscover from './discover.reducer';
import {LatLon} from '../../../data/lat-lon';
import {Poi} from '../../../data/poi';

export const selectDiscoverState = createFeatureSelector<fromDiscover.State>(
  fromDiscover.discoverFeatureKey
);

export const getSearchAttributes = createSelector(
  selectDiscoverState,
  state => ({searchAttributes: state.searchAttributes})
);

export const getMapZoom = createSelector(
    selectDiscoverState,
    state => ({mapZoom: state.mapZoom})
);

export const getFoundPois = createSelector(
  selectDiscoverState,
  state => ({filteredPois: state.filteredPois, allPois: state.allPois})
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

export const getPoisViewMode = createSelector(
    selectDiscoverState,
    state => state.poisViewMode
);

export const getPoiPageData: MemoizedSelector<object, { navigatorLabel: string; searchCenter: LatLon; hasNextPoi: boolean; showNavigationButtons: boolean; hasPreviousPoi: boolean; poi: Poi }> = createSelector(
  selectDiscoverState,
  state => {
    if (!state) {
      return undefined;
    }

    return {
      poi: state.selectedPoi,
      searchCenter: state.searchAttributes.position,
      hasNextPoi: state.hasNextPoi,
      hasPreviousPoi: state.hasPreviousPoi,
      navigatorLabel: state.selectedPoiText,
      showNavigationButtons: true
    };}
);
