import {LatLon} from './lat-lon';
import {CategoryEntry} from './category-entry';

export class SearchAttributes {

  constructor(
    public readonly position: LatLon,
    public readonly distance: number,
    public readonly category: CategoryEntry,
    public readonly hasEverSearched: boolean,
  ) {
  }
}

export const INITIAL_SEARCH_ATTRIBUTES = new SearchAttributes(new LatLon(52.908, 8.588), 250, new CategoryEntry('all', 'Alles', []), false);
