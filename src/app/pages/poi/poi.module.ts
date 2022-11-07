import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PoiPageRoutingModule} from './poi-routing.module';

import {PoiPage} from './poi.page';
import {PoiMapComponent} from "./components/poi-map/poi-map.component";
import {PoiRawDataComponent} from "./components/poi-raw-data/poi-raw-data.component";
import {PoiReferencesComponent} from "./components/poi-references/poi-references.component";
import {PoiContactComponent} from "./components/poi-contact/poi-contact.component";
import {PoiOverviewComponent} from "./components/poi-overview/poi-overview.component";
import {PoiNavigationToolbarComponent} from "./components/poi-navigation-toolbar/poi-navigation-toolbar.component";
import {PoiOsmTagsComponent} from "./components/poi-osm-tags/poi-osm-tags.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoiPageRoutingModule
  ],
  declarations: [
    PoiContactComponent,
    PoiOverviewComponent,
    PoiMapComponent,
    PoiNavigationToolbarComponent,
    PoiOsmTagsComponent,
    PoiRawDataComponent,
    PoiReferencesComponent,
    PoiPage,
  ]
})
export class PoiPageModule {
}
