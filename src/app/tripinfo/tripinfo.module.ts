import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TripinfoPageRoutingModule } from './tripinfo-routing.module';

import { TripinfoPage } from './tripinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripinfoPageRoutingModule
  ],
  declarations: [TripinfoPage]
})
export class TripinfoPageModule {}
