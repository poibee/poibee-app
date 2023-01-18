import { TestBed } from '@angular/core/testing';

import { PoisSorterService } from './pois-sorter.service';
import {LatLon} from "../data/lat-lon";
import {of} from "rxjs";
import {Poi} from "../data/poi";
import {OwnPosition} from "../data/own-position";
import {PoiId} from "../data/poi-id";
import {Contact} from "../data/contact";

describe('PoisSorterService', () => {
  let service: PoisSorterService;

  const pois = [
    new Poi(PoiId.of('node-1'), ['restaurant'], null, new OwnPosition(null, 3, null), null, Contact.of('Charisma'), null, 2, '{}', null),
    new Poi(PoiId.of('node-2'), ['community_centre'], null, new OwnPosition(null, 1, null), null, Contact.of('Marktkieker'), null, 1, '{}', null),
    new Poi(PoiId.of('node-3'), ['church'], null, new OwnPosition(null, 2, null), null, Contact.of('Christuskirche'), null, 3, '{}', null)
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisSorterService);
  });

  it('should sort by name', () => {
    const resultPois = service.sortPois(pois, 'name');

    expect(resultPois[0].contact.name).toBe('Charisma');
    expect(resultPois[1].contact.name).toBe('Christuskirche');
    expect(resultPois[2].contact.name).toBe('Marktkieker');
  });

  it('should sort by distance', () => {
    const resultPois = service.sortPois(pois, 'distance');

    expect(resultPois[0].contact.name).toBe('Marktkieker');
    expect(resultPois[1].contact.name).toBe('Christuskirche');
    expect(resultPois[2].contact.name).toBe('Charisma');
  });

  it('should sort by relevance', () => {
    const resultPois = service.sortPois(pois, 'relevance');

    expect(resultPois[0].contact.name).toBe('Christuskirche');
    expect(resultPois[1].contact.name).toBe('Charisma');
    expect(resultPois[2].contact.name).toBe('Marktkieker');
  });

  it('should sort by category', () => {
    const resultPois = service.sortPois(pois, 'category');

    expect(resultPois[0].categories[0]).toBe('church');
    expect(resultPois[1].categories[0]).toBe('community_centre');
    expect(resultPois[2].categories[0]).toBe('restaurant');
  });

});
