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

            expect(receivedPoi.contact.website.text).toEqual('http://my-contact-website.de');
        });

        it('should use attribute "website" as website', () => {
            const data = {...jsonData, tags: {
                    website: 'http://my-website.de',
                    url: 'http://my-url.de'
                }} as unknown as PoiJson;

            const receivedPoi = service.convert(data);

            expect(receivedPoi.contact.website.text).toEqual('http://my-website.de');
        });

        it('should use attribute "url" as website', () => {
            const data = {...jsonData, tags: {
                    url: 'http://my-url.de'
                }} as unknown as PoiJson;

            const receivedPoi = service.convert(data);

            expect(receivedPoi.contact.website.text).toEqual('http://my-url.de');
        });

        it('should work, when no attribute is set', () => {
            const receivedPoi = service.convert(jsonData);

            expect(receivedPoi.contact.website).toBe(undefined);
        });
    });
});
