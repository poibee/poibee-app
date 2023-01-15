import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as DiscoverActions from './discover.actions';
import {Action} from "@ngrx/store";
import {PoisOverpassService} from "../../../services/pois-overpass.service";

@Injectable()
export class DiscoverEffects {

  constructor(
    private actions$: Actions,
    private poisOverpassService: PoisOverpassService
  ) {
  }

  searchPoisEffects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.searchPois),
      switchMap(data => {
        return this.poisOverpassService.searchPoisByAttributes(data.data).pipe(
          map(pois => DiscoverActions.searchPoisSuccess({searchAttributes: data.data, pois: pois})))
        // TODO - implement:
        //  catchError(error => DiscoverActions.searchPoisFailure({searchAttributes: data.data, error: "error !"})))
      })
    )
  );

}
