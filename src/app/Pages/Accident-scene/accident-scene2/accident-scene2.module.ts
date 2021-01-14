import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccidentScene2Page } from './accident-scene2.page';

const routes: Routes = [
  {
    path: '',
    component: AccidentScene2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccidentScene2Page]
})
export class AccidentScene2PageModule {}
