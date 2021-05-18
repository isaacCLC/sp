import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SignaturePadModule } from "angular2-signaturepad";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { IconImgModule } from "../../../components/icon-img/icon-img.module";
import { MotorAccidentClaimStepModule } from "../../../components/motoraccident-claim-step/motoraccident-claim-step.module";
import { PassengerDetailModule } from "../../../modals/claim/passenger-detail/passenger-detail.module";
import { ThirdPartyDetailModule } from "../../../modals/claim/third-party-detail/third-party-detail.module";
import { WitnessDetailModule } from "../../../modals/claim/witness-detail/witness-detail.module";
import { SignatureCaptureModule } from "../../../modals/signature-capture/signature-capture.module";
import { AppPipeModule } from "../../../pipes/app.pipe.module";
import { ValidatorsModule } from "src/app/utils/validators/validators.module";
import { MotorAccidentOverviewPage } from "./motoraccident-overview/motoraccident-overview.page";
import { OtherPropertyDetailModule } from 'src/app/modals/claim/other-property-detail/other-property-detail.module';
import { Claim2Page } from './claim-1/claim-2.page';
import { Claim3Page } from './claim-2/claim-3.page';
import { Claim4Page } from './claim-3/claim-4.page';
import { Claim6Page } from './claim-4/claim-6.page';
import { Claim9Page } from './claim-5/claim-9.page';


const routes: Routes = [
  // {
  //   path: 'step0',
  //   component: Claim1Page
  // },
  {
    path: 'step1',
    component: Claim2Page
  },
  {
    path: 'step2',
    component: Claim3Page
  },
  {
    path: 'step3',
    component: Claim4Page
  },
  {
    path: 'step4',
    component: Claim6Page
  },
  {
    path: 'step5',
    component: Claim9Page
  },
  {
    path: 'overview',
    component: MotorAccidentOverviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes),
    MotorAccidentClaimStepModule,
    ValidatorsModule,
    SignaturePadModule,
    GooglePlaceModule,
    PassengerDetailModule,
    OtherPropertyDetailModule,
    ThirdPartyDetailModule,
    WitnessDetailModule,
    IconImgModule,
    AppPipeModule,
    SignatureCaptureModule,
  ],
  declarations: [ Claim2Page, Claim3Page, Claim4Page, Claim6Page,  Claim9Page, MotorAccidentOverviewPage]
})
export class ClaimMotorAccidentModule { }
