import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MediaManagerSafeSrcPipe, MediaManagerSafeStylePipe } from '../utils/media-manager';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MediaManagerSafeSrcPipe,
    MediaManagerSafeStylePipe,
  ],
  exports: [
    MediaManagerSafeSrcPipe,
    MediaManagerSafeStylePipe,
  ]
})
export class AppPipeModule { }
