import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VehicleChecklistPage } from './vehicle-checklist.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleChecklistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VehicleChecklistPage]
})
export class VehicleChecklistPageModule {}
