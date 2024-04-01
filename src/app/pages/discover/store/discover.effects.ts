import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as DiscoverActions from './discover.actions';
import {doNothing, searchPois} from './discover.actions';
import {Action} from '@ngrx/store';
import {PoisOverpassService} from '../../../services/pois-overpass.service';
import {CategoryService} from '../../../services/category.service';
import {INITIAL_SEARCH_ATTRIBUTES, SearchAttributes} from '../../../data/search-attributes';
import {DiscoverPageQueryParameter} from "../../../data/discover-page-query-parameter";

@Injectable()
export class DiscoverEffects {

    // TODO extend state values by parameter values
    // wenn store state => keine Suche starten
    // wenn kein store state + parameter => Suche starten
    // wenn kein store state + keine parameter => keine Suche starten

  initializeDiscoverPage$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.initializeDiscoverPage),
      map(props => {
        const parameters: DiscoverPageQueryParameter = props.parameters;
        if (parameters.position || parameters.distance || parameters.category) {
          const position = parameters.position ? parameters.position : INITIAL_SEARCH_ATTRIBUTES.position;
          const distance = parameters.distance ? parameters.distance : INITIAL_SEARCH_ATTRIBUTES.distance;
          const categoryEntry = this.categoryService.ofKey(parameters.category);
          const category = categoryEntry ? categoryEntry : INITIAL_SEARCH_ATTRIBUTES.category;
          return searchPois({searchAttributes: new SearchAttributes(position, distance, category)});
        }
        return doNothing();
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
