import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-signature-capture',
  templateUrl: 'signature-capture.page.html',
  styleUrls: ['signature-capture.page.scss'],
})
export class SignatureCapturePage implements OnInit {
  cleared: boolean = true;
  @ViewChild(SignaturePad, { static: true }) signaturePad: SignaturePad;
  signatureData: string = '';


  constructor(protected modalController: ModalController, private navParams: NavParams) {
    this.signatureData = this.navParams.get('signatureData') || '';

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.clearPreview();
      if (this.signatureData && this.signatureData != '')
        this.signaturePad.fromDataURL(this.signatureData);
    }, 150);
  }

  drawStart() {
    this.cleared = false;
  }

  clearPreview() {
    this.signaturePad.clear();
    this.signaturePad.resizeCanvas();
    this.cleared = true;
  }

  public async return(data: any = null) {
    data = this.signaturePad.toDataURL();
    await this.modalController.dismiss(data);
  }

  public async close(data: any = null) {
    await this.modalController.dismiss(data);
  }
}
