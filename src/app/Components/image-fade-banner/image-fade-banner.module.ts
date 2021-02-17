import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ImageFadeBannerComponent } from "./image-fade-banner.component";

@NgModule({
  imports: [
    CommonModule,
    //BrowserAnimationsModule
  ],
  declarations: [
    ImageFadeBannerComponent
  ],
  exports: [
    ImageFadeBannerComponent
  ],
})
export class ImageFadeBannerModule { }