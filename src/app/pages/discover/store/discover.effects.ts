import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as DiscoverActions from './discover.actions';
import {searchPois} from './discover.actions';
import {Action, select, Store} from '@ngrx/store';
import {PoisOverpassService} from '../../../services/pois-overpass.service';
import {CategoryService} from '../../../services/category.service';
import {SearchAttributes} from '../../../data/search-attributes';
import {DiscoverPageQueryParameter} from "../../../data/discover-page-query-parameter";
import {getSearchAttributes} from "./discover.selectors";

@Injectable()
export class DiscoverEffects {

  initializeDiscoverPage$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.initializeDiscoverPage),
      filter((props) => {
        return !!(props.parameters.position || props.parameters.distance || props.parameters.category);
      }),
      withLatestFrom(this.store.pipe(select(getSearchAttributes))), // Replace selectSomeValue with your actual selector
      map(([props, stateSearchAttributes]) => {
        const parameters: DiscoverPageQueryParameter = props.parameters;
        const existingSearchAttributes: SearchAttributes = stateSearchAttributes.searchAttributes;
        const position = parameters.position ? parameters.position : existingSearchAttributes.position;
        const distance = parameters.distance ? parameters.distance : existingSearchAttributes.distance;
        const categoryEntry = this.categoryService.ofKey(parameters.category);
        const category = categoryEntry ? categoryEntry : existingSearchAttributes.category;
        return searchPois({searchAttributes: new SearchAttributes(position, distance, category, true)});
      })
    )
  );

  searchPoisEffects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.searchPois),
      switchMap(props => this.poisOverpassService.searchPoisByAttributes(props.searchAttributes).pipe(
          map(pois => DiscoverActions.searchPoisSuccess({searchAttributes: props.searchAttributes, pois})),
          catchError(error => of(DiscoverActions.searchPoisFailure({searchAttributes: props.searchAttributes, error})))
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private categoryService: CategoryService,
    private poisOverpassService: PoisOverpassService) {
  }

}
