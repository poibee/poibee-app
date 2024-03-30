import {createReducer, on} from '@ngrx/store';
import * as DiscoverActions from './discover.actions';
import {Poi} from '../../../data/poi';
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from '../../../data/search-attributes';
import {sortTypesAsArray} from '../../../data/sort-types';
import {PoisFilterService} from '../../../services/pois-filter.service';
import {PoisSorterService} from '../../../services/pois-sorter.service';
import {PoisViewMode} from "../../../data/pois-view-mode";

export const discoverFeatureKey = 'discover';

export interface State {
  poisViewMode: PoisViewMode;
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
  poisViewMode: PoisViewMode.MAP,
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

  on(DiscoverActions.initializeSearchAttributes, (state) => ({
      ...state,
      searchAttributes: INITIAL_SEARCH_ATTRIBUTES
    })),

  on(DiscoverActions.changePosition, (state, {position}) => ({
      ...state,
      searchAttributes: {
        ...state.searchAttributes,
        position
      }
    })),

  on(DiscoverActions.searchPois, (state, {searchAttributes}) => ({
      ...state,
      searchActive: true
    })),

  on(DiscoverActions.searchPoisSuccess, (state, {searchAttributes, pois}) => recalculatePoiValues({
      ...state,
      searchAttributes,
      searchActive: false,
      allPois: pois
    })),

  on(DiscoverActions.searchPoisFailure, (state, {searchAttributes, error}) => ({
      ...state,
      searchAttributes,
      searchActive: false
    })),

  on(DiscoverActions.updateFilterValue, (state, {filterValue}) => recalculatePoiValues({
      ...state,
      filterValue
    })),

  on(DiscoverActions.updateSelectedSort, (state, {selectedSort}) => recalculatePoiValues({
      ...state,
      selectedSort
    })),

  on(DiscoverActions.selectPoi, (state, {selectedPoi}) => {
    const selectedPoiIndex = state.filteredPois.indexOf(selectedPoi);
    return recalculatStateOfSelectedPoi(state, selectedPoiIndex, selectedPoi);
  }),

  on(DiscoverActions.selectPreviousPoi, (state: State) => {
    const selectedPoiIndex = hasPreviousPoiFunction(state) ? state.selectedPoiIndex - 1 : state.selectedPoiIndex;
    const selectedPoi = state.filteredPois[selectedPoiIndex];
    return recalculatStateOfSelectedPoi(state, selectedPoiIndex, selectedPoi);
  }),

  on(DiscoverActions.selectNextPoi, (state) => {
    const selectedPoiIndex = hasNextPoiFunction(state) ? state.selectedPoiIndex + 1 : state.selectedPoiIndex;
    const selectedPoi = state.filteredPois[selectedPoiIndex];
    return recalculatStateOfSelectedPoi(state, selectedPoiIndex, selectedPoi);
  }),

  on(DiscoverActions.selectPoisViewMode, (state: State, { poisViewMode}) => ({
    ...state,
    poisViewMode: poisViewMode
  })),
);

const hasPreviousPoiFunction = (state: State) => state.selectedPoiIndex > 0;

const hasNextPoiFunction = state => state.selectedPoiIndex < state.filteredPois.length - 1;

const calculateSelectedPoiText = (numberOfPois: number, selectedPoiIndex: number) => numberOfPois === 0 ? '0 / 0' : ((selectedPoiIndex + 1) + ' / ' + numberOfPois);

const recalculatStateOfSelectedPoi = (state: State, selectedPoiIndex: number, selectedPoi: Poi) => {
  const selectedPoiText = calculateSelectedPoiText(state.filteredPois.length, selectedPoiIndex);
  return {
    ...state,
    selectedPoiIndex,
    selectedPoi,
    selectedPoiText,
    hasNextPoi: hasNextPoiFunction(state),
    hasPreviousPoi: hasPreviousPoiFunction(state)
  };
};

const recalculatePoiValues = (newState: State): State => {
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
    selectedPoi,
    selectedPoiIndex,
    selectedPoiText,
    filteredPois: sortedPois,
    hasNextPoi,
    hasPreviousPoi: false
  };
};
