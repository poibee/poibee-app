import {PoiId} from './poi-id';

describe('PoiId', () => {


  describe('factory', () => {

    it('should support standard', () => {
      const poiId = PoiId.of('way-4711');
      expect(poiId.type).toBe('way');
      expect(poiId.id).toBe('4711');
    });

    it('should support osm', () => {
      const poiId = PoiId.ofOsm('way/4711');
      expect(poiId.type).toBe('way');
      expect(poiId.id).toBe('4711');
    });
  });

  describe('has type', () => {

    it('should check type node', () => {
      const poiId = PoiId.ofOsm('node/4711');
      expect(poiId.isNode()).toBeTrue();
      expect(poiId.isWay()).toBeFalse();
      expect(poiId.isRelation()).toBeFalse();
    });

    it('should check type way', () => {
      const poiId = PoiId.ofOsm('way/4711');
      expect(poiId.isNode()).toBeFalse();
      expect(poiId.isWay()).toBeTrue();
      expect(poiId.isRelation()).toBeFalse();
    });

    it('should check type relation', () => {
      const poiId = PoiId.ofOsm('relation/4711');
      expect(poiId.isNode()).toBeFalse();
      expect(poiId.isWay()).toBeFalse();
      expect(poiId.isRelation()).toBeTrue();
    });
  });

  describe('supports formats', () => {

    it('should give standard format', () => {
      const poiId = PoiId.ofOsm('node/4711');
      expect(poiId.toString()).toBe('node-4711');
    });

    it('should give OSM format', () => {
      const poiId = PoiId.ofOsm('node/4711');
      expect(poiId.toOsm()).toBe('node/4711');
    });

  });

  describe('supports standard methods', () => {

    it('should has equals method', () => {
      expect(PoiId.ofOsm('node/4711').equals(PoiId.ofOsm('node/4711'))).toBeTrue();
      expect(PoiId.ofOsm('node/4711').equals(PoiId.ofOsm('node/4712'))).toBeFalse();
      expect(PoiId.ofOsm('node/4711').equals(PoiId.ofOsm('way/4711'))).toBeFalse();
    });

    it('should has toString method', () => {
      expect(PoiId.ofOsm('node/4711').toString()).toBe('node-4711');
    });

  });

});
