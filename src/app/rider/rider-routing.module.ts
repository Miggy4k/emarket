import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiderPage } from './rider.page';

const routes: Routes = [
  {
    path: '',
    component: RiderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiderPageRoutingModule {}
