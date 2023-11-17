import {createReducer, on} from '@ngrx/store';
import * as DiscoverActions from './discover.actions';
import {Poi} from "../../../data/poi";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../../../data/search-attributes";
import {sortTypesAsArray} from "../../../data/sort-types";
import {PoisFilterService} from "../../../services/pois-filter.service";
import {PoisSorterService} from "../../../services/pois-sorter.service";

export const discoverFeatureKey = 'discover';

export interface State {
  searchAttributes: SearchAttributes;
  searchActive: boolean;
  allPois: Poi[];
  filteredPois: Poi[];
  selectedPoi: Poi;
  selectedSort: string;
  filterValue: string;
  selectedPoiIndex: number;
  selectedPoiText: string;
  hasNextPoi: boolean;
  hasPreviousPoi: boolean;
}

export const initialState: State = {
  searchAttributes: undefined,
  searchActive: false,
  allPois: [],
  filteredPois: [],
  selectedPoi: null,
  selectedSort: sortTypesAsArray()[0][0],
  filterValue: '',
  selectedPoiIndex: 0,
  selectedPoiText: '0 / 0',
  hasNextPoi: false,
  hasPreviousPoi: false
};

export const reducer = createReducer(
  initialState,

  on(DiscoverActions.initializeSearchAttributes, (state) => {
    return {
      ...state,
      searchAttributes: INITIAL_SEARCH_ATTRIBUTES
    };
  }),

  on(DiscoverActions.changePosition, (state, {position}) => {
    return {
      ...state,
      searchAttributes: {
        ...state.searchAttributes,
        position: position
      }
    };
  }),

  on(DiscoverActions.searchPois, (state, {searchAttributes}) => {
    return {
      ...state,
      searchActive: true
    };
  }),

  on(DiscoverActions.searchPoisSuccess, (state, {searchAttributes, pois}) => {
    return recalculatePoiValues({
      ...state,
      searchAttributes: searchAttributes,
      searchActive: false,
      allPois: pois
    });
  }),

  on(DiscoverActions.searchPoisFailure, (state, {searchAttributes, error}) => {
    return {
      ...state,
      searchAttributes: searchAttributes,
      searchActive: false
    };
  }),

  on(DiscoverActions.updateFilterValue, (state, {filterValue}) => {
    return recalculatePoiValues({
      ...state,
      filterValue: filterValue
    });
  }),

  on(DiscoverActions.updateSelectedSort, (state, {selectedSort}) => {
    return recalculatePoiValues({
      ...state,
      selectedSort: selectedSort
    });
  }),

  on(DiscoverActions.selectPoi, (state, {selectedPoi}) => {
    const selectedPoiIndex = state.filteredPois.indexOf(selectedPoi);
    return recalculatStateOfSelectedPoi(state, selectedPoiIndex, selectedPoi);
  }),

  on(DiscoverActions.selectPreviousPoi, (state: State) => {
    const selectedPoiIndex = hasPreviousPoi(state) ? state.selectedPoiIndex - 1 : state.selectedPoiIndex;
    const selectedPoi = state.filteredPois[selectedPoiIndex];
    return recalculatStateOfSelectedPoi(state, selectedPoiIndex, selectedPoi);
  }),

  on(DiscoverActions.selectNextPoi, (state) => {
    const selectedPoiIndex = hasNextPoi(state) ? state.selectedPoiIndex + 1 : state.selectedPoiIndex;
    const selectedPoi = state.filteredPois[selectedPoiIndex];
    return recalculatStateOfSelectedPoi(state, selectedPoiIndex, selectedPoi);
  }),

);

function hasPreviousPoi(state: State) {
  return state.selectedPoiIndex > 0;
}

function hasNextPoi(state) {
  return state.selectedPoiIndex < state.filteredPois.length - 1;
}

function calculateSelectedPoiText(numberOfPois: number, selectedPoiIndex: number) {
  return numberOfPois == 0 ? '0 / 0': ((selectedPoiIndex + 1) + ' / ' + numberOfPois);
}

function recalculatStateOfSelectedPoi(state: State, selectedPoiIndex: number, selectedPoi: Poi) {
  const selectedPoiText = calculateSelectedPoiText(state.filteredPois.length, selectedPoiIndex);
  return {
    ...state,
    selectedPoiIndex: selectedPoiIndex,
    selectedPoi: selectedPoi,
    selectedPoiText: selectedPoiText,
    hasNextPoi: hasNextPoi(state),
    hasPreviousPoi: hasPreviousPoi(state)
  };
}

function recalculatePoiValues(newState: State): State {
  const poisFilterService = new PoisFilterService();
  const poisSorterService = new PoisSorterService();

  const filteredPois = poisFilterService.filterPois(newState.allPois, newState.filterValue);
  const sortedPois = poisSorterService.sortPois(filteredPois, newState.selectedSort);

  const selectedPoiIndex = 0;
  const selectedPoi = sortedPois.length > 0 ? sortedPois[selectedPoiIndex] : null;
  const selectedPoiText = calculateSelectedPoiText(sortedPois.length, selectedPoiIndex);
  const hasNextPoi = sortedPois.length >= 2;
  return {
    ...newState,
    selectedPoi: selectedPoi,
    selectedPoiIndex: selectedPoiIndex,
    selectedPoiText: selectedPoiText,
    filteredPois: sortedPois,
    hasNextPoi: hasNextPoi,
    hasPreviousPoi: false
  };
}
