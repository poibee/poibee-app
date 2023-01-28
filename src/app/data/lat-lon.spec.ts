import { LatLon } from './lat-lon';

describe('LatLon', () => {
  describe('constructor', () => {
    it('should create LatLon', () => {
      const latLon = new LatLon(52.3, 8.6);
      expect(latLon.lat).toEqual(52.3);
      expect(latLon.lon).toEqual(8.6);
    });
  });

  describe('of', () => {
    it('should create LatLon of string position', () => {
      expect(LatLon.ofPosition("52,8")).toEqual(new LatLon(52, 8));
      expect(LatLon.ofPosition("52.3,8.6")).toEqual(new LatLon(52.3, 8.6));
      expect(LatLon.ofPosition("52.3.8.6")).toBeUndefined();
      expect(LatLon.ofPosition("52.3;8.6")).toBeUndefined();
      expect(LatLon.ofPosition("52")).toBeUndefined();
      expect(LatLon.ofPosition("52,8,7")).toBeUndefined();
      expect(LatLon.ofPosition("invalid")).toBeUndefined();
      expect(LatLon.ofPosition("inv,alid")).toBeUndefined();
    });
  });

});
