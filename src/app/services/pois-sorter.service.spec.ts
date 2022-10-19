import { TestBed } from '@angular/core/testing';

import { PoisSorterService } from './pois-sorter.service';
import {LatLon} from "../data/lat-lon";
import {of} from "rxjs";
import {Poi} from "../data/poi";

describe('PoisSorterService', () => {
  let service: PoisSorterService;

  const pois = [
    new Poi('1', 'Charisma', ['restaurant'], null, 3, null, null, null, {}, 2, '{}'),
    new Poi('2', 'Marktkieker', ['community_centre'], null, 1, null, null, null, {}, 3, '{}'),
    new Poi('3', 'Christuskirche', ['church'], null, 2, null, null, null, {}, 1, '{}')
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisSorterService);
  });

  it('should sort by name', () => {
    const resultPois = service.sortPois(pois, 'name');

    expect(resultPois[0].name).toBe('Charisma');
    expect(resultPois[1].name).toBe('Christuskirche');
    expect(resultPois[2].name).toBe('Marktkieker');
  });

  it('should sort by distance', () => {
    const resultPois = service.sortPois(pois, 'distance');

    expect(resultPois[0].name).toBe('Marktkieker');
    expect(resultPois[1].name).toBe('Christuskirche');
    expect(resultPois[2].name).toBe('Charisma');
  });

  it('should sort by relevance', () => {
    const resultPois = service.sortPois(pois, 'relevance');

    expect(resultPois[0].name).toBe('Christuskirche');
    expect(resultPois[1].name).toBe('Charisma');
    expect(resultPois[2].name).toBe('Marktkieker');
  });

  it('should sort by category', () => {
    const resultPois = service.sortPois(pois, 'category');

    expect(resultPois[0].categories[0]).toBe('church');
    expect(resultPois[1].categories[0]).toBe('community_centre');
    expect(resultPois[2].categories[0]).toBe('restaurant');
  });

});
