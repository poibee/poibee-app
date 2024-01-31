import { TestBed } from '@angular/core/testing';

import { PoisFilterService } from './pois-filter.service';
import {Poi} from '../data/poi';
import {PoiId} from '../data/poi-id';
import {Contact} from '../data/contact';

describe('PoisFilterService', () => {
  let service: PoisFilterService;

  const pois = [
    new Poi(PoiId.of('node-1'), ['restaurant'], null, null, null, Contact.of('Charisma'), null, 1, '{}', null),
    new Poi(PoiId.of('node-2'), ['community_centre'], null, null, null, Contact.of('Marktkieker'), null, 1, '{}', null),
    new Poi(PoiId.of('node-3'), ['church'], null, null, null, Contact.of('Christuskirche'), null, 1, '{}', null)
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisFilterService);
  });

  it('should filter by name with lowercase', () => {
    const resultPois = service.filterPois(pois, 'ch');

    expect(resultPois.length).toBe(2);
    expect(resultPois[0].contact.name).toBe('Charisma');
    expect(resultPois[1].contact.name).toBe('Christuskirche');
  });

  it('should filter by name with uppercase', () => {
    const resultPois = service.filterPois(pois, 'CH');

    expect(resultPois.length).toBe(2);
    expect(resultPois[0].contact.name).toBe('Charisma');
    expect(resultPois[1].contact.name).toBe('Christuskirche');
  });

  it('should not filter by name with empty string', () => {
    const resultPois = service.filterPois(pois, '');

    expect(resultPois.length).toBe(3);
    expect(resultPois[0].contact.name).toBe('Charisma');
    expect(resultPois[1].contact.name).toBe('Marktkieker');
    expect(resultPois[2].contact.name).toBe('Christuskirche');
  });
});
