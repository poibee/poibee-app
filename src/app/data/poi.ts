import {LatLon} from "./lat-lon";
import {Contact} from "./contact";
import {References} from "./references";
import {Attributes} from "./attributes";
import {OwnPosition} from "./own-position";
import {Feature, Geometry} from "geojson";
import {PoiId} from "./poi-id";

export class Poi {

  constructor(
    public readonly id: PoiId,
    public readonly categories: string[],
    public readonly coordinates: LatLon,
    public readonly ownPosition: OwnPosition,
    public readonly attributes: Attributes,
    public readonly contact: Contact,
    public readonly references: References,
    public readonly relevance: number,
    public readonly rawData: string,
    public readonly original: Feature<Geometry, { [p: string]: string }>) {
  }

  public label() {
    return this.contact.name ? this.contact.name : this.categories[0];
  }
}
