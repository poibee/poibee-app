import {inject, TestBed} from '@angular/core/testing';

import {PoisOverpassService} from './pois-overpass.service';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {of} from 'rxjs';
import {Poi} from '../data/poi';
import {LatLon} from '../data/lat-lon';
import AsymmetricMatcher = jasmine.AsymmetricMatcher;
import {PoiId} from '../data/poi-id';
import {JsonToPoiConverterService} from './json-to-poi-converter.service';
import {GeoService} from './geo.service';

describe('PoisOverpassService', () => {

  let httpMock;

  beforeEach(() => {
    httpMock = {
      get: () => of([
        {
          id: 'node/11',
          categories: ['myCategory'],
          coordinates: {
            lat: 1.1,
            lon: 2.2
          },
          tags: {
            name: 'myName'
          }
        }, {
          id: 'node/22',
          categories: ['otherCategory'],
          coordinates: {
            lat: 1.12,
            lon: 2.23
          },
          tags: {
            name: 'otherName'
          }
        }
      ])
    };

    spyOn(httpMock, 'get').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
          { provide: HttpClient, useValue: httpMock},
          { provide: JsonToPoiConverterService, useValue: new JsonToPoiConverterService(new GeoService()) },
          PoisOverpassService
      ]
    });
  });

  it('should GET a list of POIs',
    inject([PoisOverpassService], (service: PoisOverpassService) => {
      let receivedPois: Poi[] = [];

      service.searchPois(new LatLon(1, 2), 10, 'restaurant').subscribe(pois => receivedPois = pois);

      expect(receivedPois.length).toBe(2);

      expect(receivedPois[0].id).toEqual(PoiId.of('node-11'));
      expect(receivedPois[0].contact.name).toBe('myName');
      expect(receivedPois[0].categories).toEqual(['MyCategory']);
      expect(receivedPois[0].coordinates).toEqual(new LatLon(1.1, 2.2));

      expect(receivedPois[1].id).toEqual(PoiId.of('node-22'));

      expect(httpMock.get).toHaveBeenCalledTimes(1);
      expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/pois', httpParamsMatcher('lat=1&lon=2&category=restaurant&distance=10'));
    }));

  const httpParamsMatcher = (expectedParamsQuery: string): AsymmetricMatcher<HttpRequest<null>> => ({
    asymmetricMatch: (actual: HttpRequest<null>) => actual.params.toString() === expectedParamsQuery
  });
});
