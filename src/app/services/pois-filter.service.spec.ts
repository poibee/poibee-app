import { TestBed } from '@angular/core/testing';

import { PoisFilterService } from './pois-filter.service';
import {PoisSorterService} from "./pois-sorter.service";
import {Poi} from "../data/poi";

describe('PoisFilterService', () => {
  let service: PoisFilterService;

  const pois = [
    new Poi('1', 'Charisma', ['restaurant'], null, null, null, null, null, 1, '{}', null),
    new Poi('2', 'Marktkieker', ['community_centre'], null, null, null, null, null, 1, '{}', null),
    new Poi('3', 'Christuskirche', ['church'], null, null, null, null, null, 1, '{}', null)
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisFilterService);
  });

  it('should filter by name with lowercase', () => {
    const resultPois = service.filterPois(pois, 'ch');

    expect(resultPois.length).toBe(2);
    expect(resultPois[0].name).toBe('Charisma');
    expect(resultPois[1].name).toBe('Christuskirche');
  });

  it('should filter by name with uppercase', () => {
    const resultPois = service.filterPois(pois, 'CH');

    expect(resultPois.length).toBe(2);
    expect(resultPois[0].name).toBe('Charisma');
    expect(resultPois[1].name).toBe('Christuskirche');
  });

  it('should not filter by name with empty string', () => {
    const resultPois = service.filterPois(pois, '');

    expect(resultPois.length).toBe(3);
    expect(resultPois[0].name).toBe('Charisma');
    expect(resultPois[1].name).toBe('Marktkieker');
    expect(resultPois[2].name).toBe('Christuskirche');
  });
});
