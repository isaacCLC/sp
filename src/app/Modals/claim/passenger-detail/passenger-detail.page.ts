import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { ClaimPassenger } from 'src/app/Helpers/claim-manager';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-passenger-detail',
  templateUrl: 'passenger-detail.page.html',
  styleUrls: ['passenger-detail.page.scss'],
})
export class PassengerDetailPage implements OnInit {

  index: number = -1;
  passenger: ClaimPassenger = new ClaimPassenger();
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;

  idOrPass = 'ID';

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper) {
    this.passenger.pasFirstName = this.navParams.get('pasFirstName') || '';
    this.passenger.pasLastName = this.navParams.get('pasLastName') || '';
    this.passenger.pasIdNumber = this.navParams.get('pasIdNumber') || '';
    this.passenger.pasContactNumber = this.navParams.get('pasContactNumber') || '';
    this.passenger.pasInjuriesDescription = this.navParams.get('pasInjuriesDescription') || '';
    this.passenger.pasPurpose = this.navParams.get('pasPurpose') || '';
    this.index = this.navParams.get('index') || -1;
  }

  ngOnInit() {

  }

  async  save(data: any = null) {
    if (!this.stepForm.valid) {
      await this.popup.showAlert('Missing fields', 'All fields must be completed in this form.');
      return;
    }

    this.close(data);
  }
  public async close(data: any = null) {
    await this.modalController.dismiss(data);
  }

  public async closeAndDelete() {
    await this.popup.showConfirm("Delete this witness?", "This will permanently delete this witness.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }
}
