import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from "@ionic/angular";
@Component({
  selector: 'app-job-desc-modal',
  templateUrl: './job-desc-modal.page.html',
  styleUrls: ['./job-desc-modal.page.scss'],
})
export class JobDescModalPage implements OnInit {

  constructor(private params: NavParams, private modalCtrl: ModalController,) { }

  ngOnInit() {
  }

  
  closemodal() {
    this.modalCtrl.dismiss();
  }

}
