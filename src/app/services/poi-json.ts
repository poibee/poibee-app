import {Feature, Geometry} from 'geojson';

export interface PoiJson {
    id: string;
    name: string;
    categories: string[];
    coordinates: { lat: number; lon: number };
    tags: { key: string; value: string } [];
    original: Feature<Geometry, { [p: string]: string }>;
}
