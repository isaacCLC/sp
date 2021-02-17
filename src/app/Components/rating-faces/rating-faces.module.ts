import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ValidatorsModule } from "src/app/utils/validators/validators.module";
import { RatingFacesComponent } from "./rating-faces.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ValidatorsModule
  ],
  declarations: [
    RatingFacesComponent
  ],
  exports: [
    RatingFacesComponent
  ],
})
export class RatingFacesModule { }