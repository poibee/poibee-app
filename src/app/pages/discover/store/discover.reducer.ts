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
  pois: Poi[];

/* TODO:  --------- */
  selectedPoi: Poi;
  allPois: Poi[];
  selectedSort: string;
  filterValue: string;

  selectedPoiIndex: number;
  selectedPoiText: string;
}

export const initialState: State = {
  searchAttributes: INITIAL_SEARCH_ATTRIBUTES,
  searchActive: false,
  pois: [],

  /* --------- */
  selectedPoi: null,
  allPois: [],
  selectedSort: sortTypesAsArray()[0][0],
  filterValue: '',
  selectedPoiIndex: 0,
  selectedPoiText: '0 / 0'
};

export const reducer = createReducer(
  initialState,

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

  /* ---------------------------------------------------- */

  on(DiscoverActions.selectPoi, (state, {selectedPoi}) => {
    const selectedPoiIndex = state.pois.indexOf(selectedPoi);
    const selectedPoiText = calculateSelectedPoiText(state);

    return {
      ...state,
      selectedPoiIndex: selectedPoiIndex,
      selectedPoi: selectedPoi,
      selectedPoiText: selectedPoiText
    };
  }),

  on(DiscoverActions.selectPreviousPoi, (state: State) => {
    var selectedPoiIndex = state.selectedPoiIndex;
    if (selectedPoiIndex > 0) {
      selectedPoiIndex = selectedPoiIndex - 1;
    }
    const selectedPoi = state.pois[selectedPoiIndex];
    const selectedPoiText = calculateSelectedPoiText(state);

    return {
      ...state,
      selectedPoiIndex: selectedPoiIndex,
      selectedPoi: selectedPoi,
      selectedPoiText: selectedPoiText
    };
  }),

  on(DiscoverActions.selectNextPoi, (state) => {
    var selectedPoiIndex = state.selectedPoiIndex;
    if (selectedPoiIndex < state.pois.length - 1) {
      selectedPoiIndex = selectedPoiIndex + 1;
    }

    const selectedPoi = state.pois[selectedPoiIndex];
    const selectedPoiText = calculateSelectedPoiText(state);

    return {
      ...state,
      selectedPoiIndex: selectedPoiIndex,
      selectedPoi: selectedPoi,
      selectedPoiText: selectedPoiText
    };
  }),

);

function calculateSelectedPoiText(state: State) {
  var result = '0 / 0';
  if (state.pois.length > 0) {
    result = (state.selectedPoiIndex + 1) + ' / ' + state.pois.length;
  }
  return result;
}

function recalculatePoiValues(newState: State): State {
  const poisFilterService = new PoisFilterService();
  const poisSorterService = new PoisSorterService();

  const filteredPois = poisFilterService.filterPois(newState.allPois, newState.filterValue);
  const sortedPois = poisSorterService.sortPois(filteredPois, newState.selectedSort);

  const selectedPoi = sortedPois.length > 0 ? sortedPois[0] : null;
  return {
    ...newState,
    selectedPoi: selectedPoi,
    selectedPoiIndex: 0,
    selectedPoiText: '1 / ' + filteredPois.length, // TODO - calculateSelectedPoiText()
    pois: sortedPois,
  };
}
