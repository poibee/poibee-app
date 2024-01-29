import {Url} from './url';

describe('Url', () => {

  describe('supports of()', () => {

    it('should work for a given value with http schema', () => {
      const url = Url.of('http://my-poi.com');
      expect(url.text).toBe('http://my-poi.com');
    });

    it('should work for a given value with https schema', () => {
      const url = Url.of('https://my-poi.com');
      expect(url.text).toBe('https://my-poi.com');
    });

    it('should add http schema if there is no http/https schema', () => {
      const url = Url.of('www.my-poi.com');
      expect(url.text).toBe('http://www.my-poi.com');
    });

    it('should return null for null', () => {
      const url = Url.of(null);
      expect(url).toBe(null);
    });

    it('should return undefined for undefined', () => {
      const url = Url.of(undefined);
      expect(url).toBe(undefined);
    });
  });

  describe('supports toString()', () => {

    it('should work for a given value', () => {
      const url = Url.of('http://my-poi.com');
      expect(url + '').toBe('http://my-poi.com');
    });
  });
});
