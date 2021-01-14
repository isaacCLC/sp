import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddNumberOtpPage } from './add-number-otp.page';
import { CodeInputModule } from 'angular-code-input';



const routes: Routes = [
  {
    path: '',
    component: AddNumberOtpPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CodeInputModule
  ],
  declarations: [AddNumberOtpPage]
})
export class AddNumberOtpPageModule {}
