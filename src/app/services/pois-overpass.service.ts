import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {LatLon} from "../data/lat-lon";
import {Poi} from "../data/poi";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PoisOverpassService {

  constructor(
    private http: HttpClient) {
  }

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
          poisJsons.map(poiJson => PoisOverpassService.jsonToPoi(poiJson))
        )
      );
  }

  private baseUrl(): string {
    return environment.backendUrlOverpass;
  }

  private static jsonToPoi(p: PoiJson): Poi {
    return new Poi(p.id, p.categories[0], p.name, new LatLon(p.coordinates[0], p.coordinates[1]), {});
  }
}

export interface PoiJson {
  id: string;
  name: string;
  website: string;
  categories: string[];
  coordinates: [number, number];
  tags: { key: string, value: string } [];
}
