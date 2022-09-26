import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {LatLon} from "../data/lat-lon";
import {Poi} from "../data/poi";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {Contact} from "../data/contact";
import {References} from "../data/references";
import {Attributes} from "../data/attributes";

@Injectable({
  providedIn: 'root'
})
export class PoisOverpassService {

  constructor(
    private http: HttpClient) {
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
          poisJsons.map(poiJson => PoisOverpassService.jsonToPoi(poiJson))
        )
      );
  }

  // GET /pois/way45401909
  searchPoi(poiId: string): Observable<Poi> {
    const url = this.baseUrl() + '/pois/' + poiId;
    return this.http.get<PoiJson>(url)
      .pipe(
        map(poiJson => PoisOverpassService.jsonToPoi(poiJson))
      );
  }

  private baseUrl(): string {
    return environment.backendUrlOverpass;
  }

  private static jsonToPoi(p: PoiJson): Poi {
    const categories = p.categories.map(c => this.capitalizeString(c) );
    const coordinates = new LatLon(p.coordinates.lat, p.coordinates.lon);

    const cuisine = this.capitalizeString(p.tags['cuisine']);
    const openingHours = p.tags['opening_hours'];
    const isBar = p.tags['bar'];
    const isCafe = p.tags['cafe'];
    const isBuilding = p.tags['building'];
    const attributes = new Attributes(cuisine, openingHours, isBar, isCafe, isBuilding);

    const name = p.tags['name'];
    const address = this.calculateAddress(p);
    const phone = p.tags['phone'];
    const fax = p.tags['fax'];
    const email = p.tags['email'];
    const website = p.tags['website'];
    const contact = new Contact(name, address, phone, fax, email, website);

    const osmDatasetUrl = `https://www.openstreetmap.org/${p.id}`;
    const osmLocationUrl = `https://www.openstreetmap.org/#map=19/${coordinates.lat}/${coordinates.lon}`;
    const googleLocationUrl = `https://www.google.de/maps/@${coordinates.lat},${coordinates.lon},18z`;

    let wikipediaUrl: string;
    const wikipediaValue = p.tags['wikipedia'];
    if (wikipediaValue) {
      const parts = wikipediaValue.split(":");
      if (parts.length === 2) {
        wikipediaUrl = `https://${parts[0]}.wikipedia.org/wiki/${parts[1]}`
      }
    }

    const wikidataEntity =  p.tags['wikidata'];
    const wikidataUrl = wikidataEntity != null ? `https://www.wikidata.org/wiki/${wikidataEntity}` : null;

    const references = new References(osmDatasetUrl, osmLocationUrl, googleLocationUrl, wikipediaUrl, wikidataUrl);

    return new Poi(p.id, p.name, categories, coordinates, attributes, contact, references, {});
  }

  private static calculateAddress(p: PoiJson) {
    const streetString = [p.tags['addr:street'], p.tags['addr:housenumber']].filter(p => p).join(" ");
    const cityString = [p.tags['addr:postcode'], p.tags['addr:city']].filter(p => p).join(" ");
    const addressString = [streetString, cityString].filter(p => p).join(", ");
    return addressString;
  }

  private static capitalizeString(value: string) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }
}

export interface PoiJson {
  id: string;
  name: string;
  categories: string[];
  coordinates: { lat: number, lon: number };
  tags: { key: string, value: string } [];
}