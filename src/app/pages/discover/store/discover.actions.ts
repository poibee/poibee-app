import { createAction, props } from '@ngrx/store';
import {Poi} from "../../../data/poi";
import {SearchAttributes} from "../../../data/search-attributes";

export const searchPois = createAction(
  '[Discover] Search POIs',
  props<{ data: SearchAttributes }>()
);

export const searchPoisSuccess = createAction(
  '[Discover] Search POIs Success',
  props<{ searchAttributes: SearchAttributes, pois: Poi[] }>()
);

export const searchPoisFailure = createAction(
  '[Discover] Search POIs Failure',
  props<{ searchAttributes: SearchAttributes, error: string }>()
);
