import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as DiscoverActions from './discover.actions';
import {Action} from "@ngrx/store";
import {PoisOverpassService} from "../../../services/pois-overpass.service";

@Injectable()
export class DiscoverEffects {

  constructor(
    private actions$: Actions,
    private poisOverpassService: PoisOverpassService) {
  }

  searchPoisEffects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.searchPois),
      switchMap(props => {
        return this.poisOverpassService.searchPoisByAttributes(props.searchAttributes).pipe(
          map(pois => DiscoverActions.searchPoisSuccess({searchAttributes: props.searchAttributes, pois: pois})),
          catchError(error => of(DiscoverActions.searchPoisFailure({searchAttributes: props.searchAttributes, error: error})))
        )
      })
    )
  );

}
