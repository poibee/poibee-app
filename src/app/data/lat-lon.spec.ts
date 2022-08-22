import { LatLon } from './lat-lon';

describe('LatLon', () => {
  describe('constructor', () => {
    it('should create LatLon', () => {
      const latLon = new LatLon(52.3, 8.6);
      expect(latLon.lat).toEqual(52.3);
      expect(latLon.lon).toEqual(8.6);
    });
  });
});
