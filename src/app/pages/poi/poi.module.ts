import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoiPageRoutingModule } from './poi-routing.module';

import { PoiPage } from './poi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoiPageRoutingModule
  ],
  declarations: [PoiPage]
})
export class PoiPageModule {}
