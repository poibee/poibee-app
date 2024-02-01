import {WikidataEntry} from './wikidata-entry';

describe('WikidataEntry', () => {

  describe('supports of()', () => {

    it('should create value', () => {
      const wikidataEntry = WikidataEntry.of('42');
      expect(wikidataEntry.value).toBe('42');
      expect(wikidataEntry.url).toBe('https://www.wikidata.org/wiki/42');
    });

    it('should return null for null', () => {
      const wikidataEntry = WikidataEntry.of(null);
      expect(wikidataEntry).toBe(null);
    });

    it('should return undefined for undefined', () => {
      const wikidataEntry = WikidataEntry.of(undefined);
      expect(wikidataEntry).toBe(undefined);
    });
  });

  describe('supports toString()', () => {

    it('should work for a given value', () => {
      const wikidataEntry = WikidataEntry.of('42');
      expect(wikidataEntry + '').toBe('42');
    });
  });
});
