import {LatLon} from '../data/lat-lon';
import {PoiId} from '../data/poi-id';
import {JsonToPoiConverterService} from './json-to-poi-converter.service';
import {GeoService} from './geo.service';
import {PoiJson} from './poi-json';
import {Url} from '../data/url';

describe('JsonToPoiConverterService', () => {

    const jsonData: PoiJson = {
        id: 'node/11',
        categories: ['myCategory'],
        coordinates: {
            lat: 1.1,
            lon: 2.2
        },
        tags: {
            name: 'myName'
        }
    } as unknown as PoiJson;

    const service = new JsonToPoiConverterService(new GeoService());

    describe('converts POI', () => {

        it('should convert fields', () => {
            const receivedPoi = service.convert(jsonData);

            expect(receivedPoi.id).toEqual(PoiId.of('node-11'));
            expect(receivedPoi.contact.name).toBe('myName');
            expect(receivedPoi.categories).toEqual(['MyCategory']);
            expect(receivedPoi.coordinates).toEqual(new LatLon(1.1, 2.2));
        });
    });

    describe('converts contact website', () => {

        it('should use attribute "contact:website" as website', () => {
            const data = {...jsonData, tags: {
                'contact:website': 'http://my-contact-website.de',
                website: 'http://my-website.de',
                url: 'http://my-url.de'
            }} as unknown as PoiJson;

            const receivedPoi = service.convert(data);

            expect(receivedPoi.contact.website.value).toEqual('http://my-contact-website.de');
        });

        it('should use attribute "website" as website', () => {
            const data = {...jsonData, tags: {
                    website: 'http://my-website.de',
                    url: 'http://my-url.de'
                }} as unknown as PoiJson;

            const receivedPoi = service.convert(data);

            expect(receivedPoi.contact.website.value).toEqual('http://my-website.de');
        });

        it('should use attribute "url" as website', () => {
            const data = {...jsonData, tags: {
                    url: 'http://my-url.de'
                }} as unknown as PoiJson;

            const receivedPoi = service.convert(data);

            expect(receivedPoi.contact.website.value).toEqual('http://my-url.de');
        });

        it('should work, when no attribute is set', () => {
            const receivedPoi = service.convert(jsonData);

            expect(receivedPoi.contact.website).toBe(undefined);
        });
    });


  describe('converts reference wikipedia website', () => {

    it('should use attribute "url" as website', () => {
      const data = {...jsonData, tags: {
          wikipedia: 'de:Bremer Roland'
        }} as unknown as PoiJson;

      const receivedPoi = service.convert(data);

      expect(receivedPoi.references.wikipediaUrl.url).toEqual('https://de.wikipedia.org/wiki/Bremer_Roland');
    });

    it('should work, when no attribute is set', () => {
      const receivedPoi = service.convert(jsonData);

      expect(receivedPoi.references.wikipediaUrl).toBe(undefined);
    });
  });

  describe('converts reference wikidata website', () => {

    it('should use attribute "url" as website', () => {
      const data = {...jsonData, tags: {
          wikidata: '42'
        }} as unknown as PoiJson;

      const receivedPoi = service.convert(data);

      expect(receivedPoi.references.wikidataUrl.url).toEqual('https://www.wikidata.org/wiki/42');
    });

    it('should work, when no attribute is set', () => {
      const receivedPoi = service.convert(jsonData);

      expect(receivedPoi.references.wikidataUrl).toBe(undefined);
    });
  });
});
