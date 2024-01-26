import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Poi} from '../../../../data/poi';

@Component({
  selector: 'app-poi-osm-tags',
  templateUrl: './poi-osm-tags.component.html',
  styleUrls: ['./poi-osm-tags.component.scss'],
})
export class PoiOsmTagsComponent implements OnChanges {

  @Input() poi: Poi;

  osmTags: OsmTags[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const poiRawObject = JSON.parse(this.poi.rawData);
    const osmTags = poiRawObject.tags;
    this.osmTags = Object.keys(osmTags).map(key => {
      const osmTagValue = osmTags[key];
      return {
        key,
        tag: osmTagValue,
        tagInfoKeyHref: `https://taginfo.openstreetmap.org/keys/${key}`,
        tagInfoTagHref: `https://taginfo.openstreetmap.org/tags/${key}=${osmTagValue}`,
        wikiKeyHref: `https://wiki.openstreetmap.org/wiki/Key:${key}`,
        wikiTagHref: `https://wiki.openstreetmap.org/wiki/Tag:${key}=${osmTagValue}`
      };
    });
  }
}

export type OsmTags = {
  key: string;
  tag: string;
  tagInfoKeyHref: string;
  tagInfoTagHref: string;
  wikiKeyHref: string;
  wikiTagHref: string;
};

