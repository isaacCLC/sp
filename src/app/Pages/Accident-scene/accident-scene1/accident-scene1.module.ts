import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccidentScene1Page } from './accident-scene1.page';

const routes: Routes = [
  {
    path: '',
    component: AccidentScene1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccidentScene1Page]
})
export class AccidentScene1PageModule {}
