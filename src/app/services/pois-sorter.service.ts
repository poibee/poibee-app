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
    const compareDistance = (p1: Poi, p2: Poi) => p1.distance - p2.distance;
    let compareMethod = compareCategory || compareName || compareDistance;
    if (selectedSort === 'category') {
      compareMethod = compareCategory || compareName || compareDistance;
    } else if (selectedSort === 'name') {
      compareMethod = compareName || compareCategory || compareDistance;
    } else if (selectedSort === 'distance') {
      compareMethod = compareDistance || compareName || compareCategory;
    }

    const copiedPois: Poi[] = [];
    pois.forEach(poi => copiedPois.push(poi));
    const resultPois = copiedPois.sort(compareMethod);
    return resultPois;
  }
}
