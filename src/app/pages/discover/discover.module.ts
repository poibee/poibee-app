import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DiscoverPageRoutingModule} from './discover-routing.module';

import {DiscoverListComponent} from "./components/discover-list/discover-list.component";
import {DiscoverPage} from './discover.page';
import {DiscoverFilterToolbarComponent} from "./components/discover-filter-toolbar/discover-filter-toolbar.component";
import {DiscoverSearchToolbarComponent} from "./components/discover-search-toolbar/discover-search-toolbar.component";
import {DiscoverSearchModalComponent} from "./components/discover-search-modal/discover-search-modal.component";
import {MyPositionMapComponent} from "./components/my-position-map/my-position-map.component";
import {CategoryModalMainItemComponent} from "./components/category-modal-main-item/category-modal-main-item.component";
import {CategoryModalComponent} from "./components/category-modal/category-modal.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule
  ],
  declarations: [
    DiscoverFilterToolbarComponent,
    DiscoverListComponent,
    DiscoverSearchModalComponent,
    DiscoverSearchToolbarComponent,
    MyPositionMapComponent,
    CategoryModalMainItemComponent,
    CategoryModalComponent,
    DiscoverPage
  ]
})
export class DiscoverPageModule {
}
