import {createReducer, on} from '@ngrx/store';
import * as DiscoverActions from './discover.actions';
import {Poi} from "../../../data/poi";
import {PoiId} from "../../../data/poi-id";
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from "../../../data/search-attributes";

export const discoverFeatureKey = 'discover';

export interface State {
  searchAttributes: SearchAttributes;
  loading: boolean;
  pois: Poi[];
}

export const initialState: State = {
  searchAttributes: INITIAL_SEARCH_ATTRIBUTES,
  pois: [new Poi(PoiId.of('way-1'), 'name', [], null, null, null, null, null, 0, '', null)],
  loading: false
};

export const reducer = createReducer(
  initialState,

  on(DiscoverActions.searchPoisSuccess, (state, {searchAttributes, pois}) => {
    const newResult = {
      ...state,
      searchAttributes: searchAttributes,
      pois: pois,
      loading: false,
    };
    return newResult;
  }),
);
