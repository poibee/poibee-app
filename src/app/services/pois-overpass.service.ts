import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LatLon} from '../data/lat-lon';
import {Poi} from '../data/poi';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {PoiId} from '../data/poi-id';
import {SearchAttributes} from '../data/search-attributes';
import {JsonToPoiConverterService} from './json-to-poi-converter.service';
import {PoiJson} from './poi-json';

@Injectable({
  providedIn: 'root'
})
export class PoisOverpassService {

  constructor(
    private jsonToPoiConverterService: JsonToPoiConverterService,
    private http: HttpClient) {
  }

  // GET /pois?category=restaurant&lat=52.9&lon=8.4&distance=100
  searchPoisByAttributes(searchAttributes: SearchAttributes): Observable<Poi[]> {
    return this.searchPois(searchAttributes.position, searchAttributes.distance, searchAttributes.category.key);
  }

  // GET /pois?category=restaurant&lat=52.9&lon=8.4&distance=100
  searchPois(position: LatLon, distance: number, category: string): Observable<Poi[]> {
    const url = this.baseUrl() + '/pois';
    const params = new HttpParams()
      .set('lat', position.lat)
      .set('lon', position.lon)
      .set('category', category)
      .set('distance', distance);
    return this.http.get<PoiJson[]>(url, {params})
      .pipe(
        map(poisJsons =>
          poisJsons.map(poiJson => this.jsonToPoiConverterService.convert(poiJson, position))
        )
      );
  }

  // GET /pois/way45401909
  searchPoi(poiId: PoiId, position: LatLon): Observable<Poi> {
    const url = this.baseUrl() + '/pois/' + poiId.toString();
    return this.http.get<PoiJson>(url)
      .pipe(
        map(poiJson => this.jsonToPoiConverterService.convert(poiJson, position))
      );
  }

  private baseUrl(): string {
    return environment.backendUrlOverpass;
  }
}
