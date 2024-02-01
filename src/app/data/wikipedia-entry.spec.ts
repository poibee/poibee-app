import {WikipediaEntry} from './wikipedia-entry';

describe('WikipediaEntry', () => {

  describe('supports of()', () => {

    it('should create value for two part', () => {
      const wikipediaEntry = WikipediaEntry.of('de:Bremer Roland');
      expect(wikipediaEntry.value).toBe('de:Bremer Roland');
      expect(wikipediaEntry.url).toBe('https://de.wikipedia.org/wiki/Bremer_Roland');
    });

    it('should create value for two part with anchor in url', () => {
      const wikipediaEntry = WikipediaEntry.of('de:Bremer Marktplatz#Bremer Loch');
      expect(wikipediaEntry.value).toBe('de:Bremer Marktplatz#Bremer Loch');
      expect(wikipediaEntry.url).toBe('https://de.wikipedia.org/wiki/Bremer_Marktplatz#Bremer_Loch');
    });

    it('should return null for only one part', () => {
      const wikipediaEntry = WikipediaEntry.of('Bremer Roland');
      expect(wikipediaEntry).toBe(undefined);
    });

    it('should return null for three parts', () => {
      const wikipediaEntry = WikipediaEntry.of('de:Bremer Roland:rest');
      expect(wikipediaEntry).toBe(undefined);
    });

    it('should return null for null', () => {
      const wikipediaEntry = WikipediaEntry.of(null);
      expect(wikipediaEntry).toBe(null);
    });

    it('should return undefined for undefined', () => {
      const wikipediaEntry = WikipediaEntry.of(undefined);
      expect(wikipediaEntry).toBe(undefined);
    });
  });

  describe('supports toString()', () => {

    it('should work for a given value', () => {
      const wikipediaEntry = WikipediaEntry.of('de:Bremer Roland');
      expect(wikipediaEntry + '').toBe('de:Bremer Roland');
    });
  });
});
