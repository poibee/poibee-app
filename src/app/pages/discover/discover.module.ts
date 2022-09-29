import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DiscoverPageRoutingModule} from './discover-routing.module';

import {DiscoverListComponent} from "./components/discover-list/discover-list.component";
import {DiscoverPage} from './discover.page';
import {DiscoverFilterComponent} from "./components/discover-filter/discover-filter.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule
  ],
  declarations: [
    DiscoverFilterComponent,
    DiscoverListComponent,
    DiscoverPage
  ]
})
export class DiscoverPageModule {
}
