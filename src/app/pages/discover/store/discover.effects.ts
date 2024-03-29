import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as DiscoverActions from './discover.actions';
import {initializeSearchAttributes, searchPois} from './discover.actions';
import {Action} from '@ngrx/store';
import {PoisOverpassService} from '../../../services/pois-overpass.service';
import {CategoryService} from '../../../services/category.service';
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from '../../../data/search-attributes';

@Injectable()
export class DiscoverEffects {

  initializeDiscoverPage$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.initializeDiscoverPage),
      map(props => {
        if (props.position || props.distance || props.category) {
          const position = props.position ? props.position : INITIAL_SEARCH_ATTRIBUTES.position;
          const distance = props.distance ? props.distance : INITIAL_SEARCH_ATTRIBUTES.distance;
          const categoryEntry = this.categoryService.ofKey(props.category);
          const category = categoryEntry ? categoryEntry : INITIAL_SEARCH_ATTRIBUTES.category;
          return searchPois({searchAttributes: new SearchAttributes(position, distance, category)});
        }
        return initializeSearchAttributes();
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
    private categoryService: CategoryService,
    private poisOverpassService: PoisOverpassService) {
  }

}
