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
    const compareDistance = (p1: Poi, p2: Poi) => p1.ownPosition.distance - p2.ownPosition.distance;
    const compareRelevance = (p1: Poi, p2: Poi) => p2.relevance - p1.relevance;

    let compareMethod = compareCategory || compareDistance || compareName || compareRelevance;
    if (selectedSort === 'category') {
      compareMethod = compareCategory || compareDistance || compareName || compareRelevance;
    } else if (selectedSort === 'name') {
      compareMethod = compareName || compareDistance || compareCategory || compareRelevance;
    } else if (selectedSort === 'distance') {
      compareMethod = compareDistance || compareName || compareCategory || compareRelevance;
    } else if (selectedSort === 'relevance') {
      compareMethod = compareRelevance || compareDistance || compareName || compareCategory;
    }

    const copiedPois: Poi[] = [];
    pois.forEach(poi => copiedPois.push(poi));
    const resultPois = copiedPois.sort(compareMethod);
    return resultPois;
  }
}
