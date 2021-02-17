import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { IonicModule } from '@ionic/angular';
import { ValidatorsModule } from "src/app/utils/validators/validators.module";
import { PassengerDetailPage } from './passenger-detail.page';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ValidatorsModule,
  ],
  declarations: [PassengerDetailPage],
  entryComponents: [PassengerDetailPage]
})
export class PassengerDetailModule { }
