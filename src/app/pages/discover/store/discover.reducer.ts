import {createReducer, on} from '@ngrx/store';
import * as DiscoverActions from './discover.actions';
import {Poi} from "../../../data/poi";
import {PoiId} from "../../../data/poi-id";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../../../data/search-attributes";

export const discoverFeatureKey = 'discover';

export interface State {
  searchAttributes: SearchAttributes;
  searchActive: boolean;
  pois: Poi[];
}

export const initialState: State = {
  searchAttributes: INITIAL_SEARCH_ATTRIBUTES,
  searchActive: false,
  pois: [new Poi(PoiId.of('way-1'), 'name', [], null, null, null, null, null, 0, '', null)]
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
    return {
      ...state,
      searchAttributes: searchAttributes,
      searchActive: false,
      pois: pois
    };
  }),

  on(DiscoverActions.searchPoisFailure, (state, {searchAttributes, error}) => {
    return {
      ...state,
      searchActive: false,
      searchAttributes: searchAttributes
    };
  }),
);
