import {Injectable} from '@angular/core';
import {LatLon} from '../data/lat-lon';
import {Poi} from '../data/poi';
import {Contact} from '../data/contact';
import {References} from '../data/references';
import {Attributes} from '../data/attributes';
import {GeoService} from './geo.service';
import {OwnPosition} from '../data/own-position';
import {directionToPoi} from '../data/direction';
import {Cuisine} from '../data/cuisine';
import {PoiId} from '../data/poi-id';
import {Url} from '../data/url';
import {PoiJson} from './poi-json';

@Injectable({
  providedIn: 'root'
})
export class JsonToPoiConverterService {

  constructor(
    private geoService: GeoService) {
  }

  convert(p: PoiJson, position?: LatLon): Poi {
    const categories = p.categories.map(c => this.capitalizeString(c));

    const coordinates = new LatLon(p.coordinates.lat, p.coordinates.lon);

    let ownPosition: OwnPosition = null;
    if (position) {
      const distance = this.geoService.distanceToPositionInKm(position, coordinates);
      const direction = directionToPoi(position, coordinates);
      ownPosition = new OwnPosition(position, distance, direction);
    }

    const cuisine = Cuisine.of(p.tags['cuisine']);
    const openingHours = p.tags['opening_hours'];
    const vending = p.tags['vending'];
    const isBar = p.tags['bar'];
    const isCafe = p.tags['cafe'];
    const isBuilding = p.tags['building'];
    const attributes = new Attributes(cuisine, openingHours, vending, isBar, isCafe, isBuilding);

    const name = p.tags['name'];
    const address = this.calculateAddress(p);
    const phone = p.tags['phone'];
    const fax = p.tags['fax'];
    const email = p.tags['email'];
    const website = Url.of(['contact:website', 'website', 'url'].map(k => p.tags[k]).find(v => v !== null && v !== undefined));
    // .    Url.of(p.tags['website']);
    const contact = new Contact(name, address, phone, fax, email, website);

    const poiId = PoiId.ofOsm(p.id);
    const osmDatasetUrl = `https://www.openstreetmap.org/${poiId.toOsm()}`;
    const osmLocationUrl = `https://www.openstreetmap.org/#map=19/${coordinates.lat}/${coordinates.lon}`;
    const googleLocationUrl = `https://www.google.de/maps/@${coordinates.lat},${coordinates.lon},18z`;

    let wikipediaUrl: string;
    const wikipediaValue = p.tags['wikipedia'];
    if (wikipediaValue) {
      const parts = wikipediaValue.split(':');
      if (parts.length === 2) {
        wikipediaUrl = `https://${parts[0]}.wikipedia.org/wiki/${parts[1]}`;
      }
    }

    const wikidataEntity = p.tags['wikidata'];
    const wikidataUrl = wikidataEntity != null ? `https://www.wikidata.org/wiki/${wikidataEntity}` : null;

    const references = new References(osmDatasetUrl, osmLocationUrl, googleLocationUrl, wikipediaUrl, wikidataUrl);

    const relevance = Object.keys(p.tags).length;

    const rawData = JSON.stringify(p, null, 2);

    const originalOsmData = p.original;

    return new Poi(poiId, categories, coordinates, ownPosition, attributes, contact, references, relevance, rawData, originalOsmData);
  }

  private calculateAddress(p: PoiJson) {
    const streetString = [p.tags['addr:street'], p.tags['addr:housenumber']].filter(pf => pf).join(' ');
    const cityString = [p.tags['addr:postcode'], p.tags['addr:city']].filter(pf => pf).join(' ');
    const addressString = [streetString, cityString].filter(pf => pf).join(', ');
    return addressString;
  }

  private capitalizeString(value: string) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }
}
