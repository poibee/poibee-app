export class WikipediaEntry {

  private constructor(public readonly value: string, public readonly url: string) {}

  static of(value: string): WikipediaEntry {
    if (value === undefined) {return undefined;}
    if (value === null) {return null;}

    const parts = value.split(':');
    if (parts.length !== 2) {return undefined;}

    const url = `https://${parts[0]}.wikipedia.org/wiki/${parts[1]}`.replace(/ /g, '_');
    return new WikipediaEntry(value, url);
  }

  toString = (): string => this.value;

}
