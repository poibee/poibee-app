import {Cuisine} from "./cuisine";

describe('Cuisine', () => {

  describe('of string value', () => {

    it('should be created', () => {
      expect(Cuisine.of('german').values).toEqual(['German']);
      expect(Cuisine.of(null).values).toEqual([]);
      expect(Cuisine.of(undefined).values).toEqual([]);
      expect(Cuisine.of('steak_house').values).toEqual(['Steak House']);
      expect(Cuisine.of('italian;pizza;pasta;fish').values).toEqual(['Fish','Italian','Pasta','Pizza']);
    });

    it('should give a preview value as string', () => {
      expect(Cuisine.of('german').previewValue()).toEqual('German');
      expect(Cuisine.of(null).previewValue()).toEqual('');
      expect(Cuisine.of(undefined).previewValue()).toEqual('');
      expect(Cuisine.of('italian;pizza;pasta;fish').previewValue()).toEqual('Fish, ...');
    });

    it('should give a complete value as string', () => {
      expect(Cuisine.of('german').completeValue()).toEqual('German');
      expect(Cuisine.of(null).completeValue()).toEqual('');
      expect(Cuisine.of(undefined).completeValue()).toEqual('');
      expect(Cuisine.of('italian;pizza;pasta;fish').completeValue()).toEqual('Fish, Italian, Pasta, Pizza');
    });
  });
});
