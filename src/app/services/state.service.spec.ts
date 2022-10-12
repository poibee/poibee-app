import { TestBed } from '@angular/core/testing';

import { StateService } from './state.service';
import {Poi} from "../data/poi";
import {SortTypes} from "../data/sort-types";

describe('StateService', () => {
  let service: StateService;

  const pois = [
    new Poi('1', 'Charisma', ['restaurant'], null, 1, null, null, null, {}),
    new Poi('2', 'Christuskirche', ['church'], null, 1, null, null, null, {}),
    new Poi('3', 'Marktkieker', ['community_centre'], null, 1, null, null, null, {}),
  ];

  const poiCharisma = pois[0];
  const poiChristuskirche = pois[1];
  const poiMarktkieker = pois[2];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);

    service.updatePois(pois);
    service.updateSelectedSort('name');
  });

  it('should navigate between pois', () => {
    service.selectPoi(poiCharisma);
    expect(service.getSelectPoi()).toBe(poiCharisma);
    expect(service.hasPreviousPoi()).toBeFalsy();
    expect(service.hasNextPoi()).toBeTruthy();
    expect(service.navigatorLabel()).toBe('1 / 3');

    expect(service.selectNextPoi()).toBe(poiChristuskirche);
    expect(service.hasPreviousPoi()).toBeTruthy();
    expect(service.hasNextPoi()).toBeTruthy();
    expect(service.navigatorLabel()).toBe('2 / 3');

    expect(service.selectNextPoi()).toBe(poiMarktkieker);
    expect(service.hasPreviousPoi()).toBeTruthy();
    expect(service.hasNextPoi()).toBeFalsy();
    expect(service.navigatorLabel()).toBe('3 / 3');

    expect(service.selectPreviousPoi()).toBe(poiChristuskirche);
    expect(service.hasPreviousPoi()).toBeTruthy();
    expect(service.hasNextPoi()).toBeTruthy();
    expect(service.navigatorLabel()).toBe('2 / 3');
  });

});