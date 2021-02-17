import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { IonicModule } from '@ionic/angular';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ValidatorsModule } from "src/app/utils/validators/validators.module";
import { WitnessDetailPage } from './witness-detail.page';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ValidatorsModule,
    GooglePlaceModule
  ],
  declarations: [WitnessDetailPage],
  entryComponents: [WitnessDetailPage]
})
export class WitnessDetailModule { }
