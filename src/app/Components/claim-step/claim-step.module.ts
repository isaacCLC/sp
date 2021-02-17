import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ClaimStepComponent } from "./claim-step.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  declarations: [
    ClaimStepComponent
  ],
  exports: [
    ClaimStepComponent
  ],
})
export class ClaimStepModule { }