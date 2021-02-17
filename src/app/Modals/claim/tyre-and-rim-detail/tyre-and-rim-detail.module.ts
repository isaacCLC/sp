import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { IonicModule } from '@ionic/angular';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AppPipeModule } from "src/app/pipes/app.pipe.module";
import { ValidatorsModule } from "src/app/utils/validators/validators.module";
import { TyreAndRimDetailPage } from "./tyre-and-rim-detail.page";



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ValidatorsModule,
    GooglePlaceModule,
    AppPipeModule
  ],
  declarations: [TyreAndRimDetailPage],
  entryComponents: [TyreAndRimDetailPage]
})
export class TyreAndRimDetailModule { }
