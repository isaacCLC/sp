import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureCapturePage } from "./signature-capture.page";



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignaturePadModule
  ],
  declarations: [SignatureCapturePage],
  entryComponents: [SignatureCapturePage]
})
export class SignatureCaptureModule { }
