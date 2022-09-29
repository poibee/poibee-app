import { TestBed } from '@angular/core/testing';

import { PoisSorterService } from './pois-sorter.service';
import {LatLon} from "../data/lat-lon";
import {of} from "rxjs";
import {Poi} from "../data/poi";

describe('PoisSorterService', () => {
  let service: PoisSorterService;

  const pois = [
    new Poi('1', 'Charisma', ['restaurant'], null, null, null, null, {}),
    new Poi('2', 'Marktkieker', ['community_centre'], null, null, null, null, {}),
    new Poi('3', 'Christuskirche', ['church'], null, null, null, null, {})
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisSorterService);
  });

  it('should sort by category', () => {
    const resultPois = service.sortPois(pois, 'category');

    expect(resultPois[0].categories[0]).toBe('church');
    expect(resultPois[1].categories[0]).toBe('community_centre');
    expect(resultPois[2].categories[0]).toBe('restaurant');
  });

  it('should sort by name', () => {
    const resultPois = service.sortPois(pois, 'name');

    expect(resultPois[0].name).toBe('Charisma');
    expect(resultPois[1].name).toBe('Christuskirche');
    expect(resultPois[2].name).toBe('Marktkieker');
  });
});
