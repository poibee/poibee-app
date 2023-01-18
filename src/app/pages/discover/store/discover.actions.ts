import { createAction, props } from '@ngrx/store';
import {Poi} from "../../../data/poi";
import {SearchAttributes} from "../../../data/search-attributes";

export const searchPois = createAction(
  '[Discover] Search POIs',
  props<{ searchAttributes: SearchAttributes }>()
);

export const searchPoisSuccess = createAction(
  '[Discover] Search POIs Success',
  props<{ searchAttributes: SearchAttributes, pois: Poi[] }>()
);

export const searchPoisFailure = createAction(
  '[Discover] Search POIs Failure',
  props<{ searchAttributes: SearchAttributes, error: any }>()
);

export const updateSelectedSort = createAction(
  '[Discover] Update Selected Sort',
  props<{ selectedSort: string }>()
);

export const updateFilterValue = createAction(
  '[Discover] Update Filter Value',
  props<{ filterValue: string }>()
);

export const selectPoi = createAction(
  '[Discover] Select POI',
  props<{ selectedPoi: Poi }>()
);

export const selectNextPoi = createAction(
  '[Discover] Select Next POI'
);

export const selectPreviousPoi = createAction(
  '[Discover] Select Previous POI'
);
