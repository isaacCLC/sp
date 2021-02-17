import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AccidentGuideStepComponent } from "./accident-guide-step.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  declarations: [
    AccidentGuideStepComponent
  ],
  exports: [
    AccidentGuideStepComponent
  ],
})
export class AccidentGuideStepModule { }