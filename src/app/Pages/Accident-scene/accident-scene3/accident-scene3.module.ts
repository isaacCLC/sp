import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccidentScene3Page } from './accident-scene3.page';

const routes: Routes = [
  {
    path: '',
    component: AccidentScene3Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccidentScene3Page]
})
export class AccidentScene3PageModule {}
