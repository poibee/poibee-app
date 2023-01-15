import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as DiscoverActions from './discover.actions';
import {Action} from "@ngrx/store";

@Injectable()
export class DiscoverEffects {
  searchPoisEffects$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscoverActions.searchPois),
      map(data => DiscoverActions.searchPoisSuccess({searchAttributes: data.data, pois: []})),
    )
  );

  constructor(private actions$: Actions) {
  }
}
