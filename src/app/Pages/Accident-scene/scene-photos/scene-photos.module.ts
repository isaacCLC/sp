import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScenePhotosPage } from './scene-photos.page';

const routes: Routes = [
  {
    path: '',
    component: ScenePhotosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScenePhotosPage]
})
export class ScenePhotosPageModule {}
