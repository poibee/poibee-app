import {inject, TestBed} from '@angular/core/testing';

import {PoisOverpassService} from './pois-overpass.service';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {of} from "rxjs";
import {Poi} from "../data/poi";
import {LatLon} from "../data/lat-lon";
import AsymmetricMatcher = jasmine.AsymmetricMatcher;

describe('PoisOverpassService', () => {

  let httpMock;

  beforeEach(() => {
    httpMock = {
      get: () => of([
        {
          id: 'myId',
          name: 'myName',
          categories: ['myCategory'],
          coordinates: {
            lat: 1.1,
            lon: 2.2
          }
        }, {
          id: 'otherId',
          name: 'otherName',
          categories: ['otherCategory'],
          coordinates: {
            lat: 1.12,
            lon: 2.23
          }
        }
      ])
    };

    spyOn(httpMock, 'get').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: httpMock},
        PoisOverpassService
      ]
    });
  });

  it('should GET a list of POIs',
    inject([PoisOverpassService], (service: PoisOverpassService) => {
      let receivedPois: Poi[] = [];

      service.searchPois(new LatLon(1, 2), 10, 'restaurant').subscribe(pois => receivedPois = pois);

      expect(receivedPois.length).toBe(2);

      expect(receivedPois[0].id).toBe('myId');
      expect(receivedPois[0].name).toBe('myName');
      expect(receivedPois[0].category).toBe('myCategory');
      expect(receivedPois[0].coordinates).toEqual(new LatLon(1.1, 2.2));

      expect(receivedPois[1].id).toBe('otherId');

      expect(httpMock.get).toHaveBeenCalledTimes(1);
      expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/pois', httpParamsMatcher("lat=1&lon=2&category=restaurant&distance=10"));
    }));

  function httpParamsMatcher(expectedParamsQuery: string): AsymmetricMatcher<HttpRequest<null>> {
    return {
      asymmetricMatch: function (actual: HttpRequest<null>) {
        return actual.params.toString() === expectedParamsQuery;
      }
    };
  }
});
