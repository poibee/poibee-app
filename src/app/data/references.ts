import {WikipediaEntry} from './wikipedia-entry';
import {WikidataEntry} from './wikidata-entry';

export class References {

  constructor(
    public readonly osmDatasetUrl: string,
    public readonly osmLocationUrl: string,
    public readonly googleLocationUrl: string,
    public readonly wikipediaUrl: WikipediaEntry,
    public readonly wikidataUrl: WikidataEntry
  ) {
  }

}
