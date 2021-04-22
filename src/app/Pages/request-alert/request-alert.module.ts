import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestAlertPage } from './request-alert.page';

const routes: Routes = [
  {
    path: '',
    component: RequestAlertPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [RequestAlertPage]
})
export class RequestAlertPageModule {}
