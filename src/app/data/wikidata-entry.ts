export class WikidataEntry {

  private constructor(public readonly value: string, public readonly url: string) {}

  static of(value: string): WikidataEntry {
    if (value === undefined) {return undefined;}
    if (value === null) {return null;}
    return new WikidataEntry(value, `https://www.wikidata.org/wiki/${value}`);
  }

  toString = (): string => this.value;

}
