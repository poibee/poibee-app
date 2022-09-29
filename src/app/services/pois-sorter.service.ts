import { Injectable } from '@angular/core';
import {Poi} from "../data/poi";

@Injectable({
  providedIn: 'root'
})
export class PoisSorterService {

  constructor() { }

  sortPois(pois: Poi[], selectedSort: string): Poi[] {
    const compareCategory = (p1: Poi, p2: Poi) => ('' + p1.categories[0]).localeCompare(p2.categories[0]);
    const compareName = (p1: Poi, p2: Poi) => ('' + p1.name).localeCompare(p2.name);
    let compareMethod = compareCategory || compareName;
    if (selectedSort === 'category') {
      compareMethod = compareCategory || compareName;
    } else if (selectedSort === 'name') {
      compareMethod = compareName || compareCategory;
    }

    const copiedPois: Poi[] = [];
    pois.forEach(poi => copiedPois.push(poi));
    const resultPois = copiedPois.sort(compareMethod);
    return resultPois;
  }
}
