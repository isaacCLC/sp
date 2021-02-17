import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MotorAccidentClaimStepComponent } from "./motoraccident-claim-step.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  declarations: [
    MotorAccidentClaimStepComponent
  ],
  exports: [
    MotorAccidentClaimStepComponent
  ],
})
export class MotorAccidentClaimStepModule { }