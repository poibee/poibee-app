import {Injectable} from '@angular/core';
import {Poi} from '../data/poi';

@Injectable({
  providedIn: 'root'
})
export class PoisFilterService {

  constructor() {
  }

  filterPois(pois: Poi[], filterValue: string): Poi[] {
    const resultPois: Poi[] = [];
    pois.forEach(poi => {
      if (filterValue.length == 0 || (poi.contact.name && poi.contact.name.toLowerCase().includes(filterValue.toLowerCase()))) {
        resultPois.push(poi);
      }
    });
    return resultPois;
  }
}
