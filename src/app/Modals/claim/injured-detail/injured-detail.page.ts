import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimPatient } from 'src/app/helpers/claim-manager';
import { AppLocation } from "src/app/utils/app-location";
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-injured-detail',
  templateUrl: 'injured-detail.page.html',
  styleUrls: ['injured-detail.page.scss'],
})
export class InjuredDetailPage implements OnInit {

  injured: ClaimPatient = new ClaimPatient();
  index: number = -1;
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };

  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, public location: AppLocation) {
    this.injured.injuredFirstName = this.navParams.get('injuredFirstName') || '';
    this.injured.injuredLastName = this.navParams.get('injuredLastName') || '';
    this.injured.injuredIdNumber = this.navParams.get('injuredIdNumber') || '';
    this.injured.injuredContactNumber = this.navParams.get('injuredContactNumber') || '';
    this.injured.injuredDescriptionOfInuries = this.navParams.get('injuredDescriptionOfInuries') || '';
    this.injured.injuredMedicalServiceProvider = this.navParams.get('injuredMedicalServiceProvider') || '';
    this.injured.injuredClaimAmount = this.navParams.get('injuredClaimAmount') || '';
    this.index = this.navParams.get('index') || -1;
  }

  ngOnInit() {
    this.location.locate(true);
  }

  async save(data: any = null) {
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
    await this.popup.showConfirm("Delete this patient?", "This will permanently delete this patient.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    this.injured.injuredAddress = address.formatted_address;
  }

  async locateUser() {
    // await this.popup.showLoading('Locating you...');
    // let response = await this.profileOperation.getAddressFromLatLong(this.location.LastKnownLatitude, this.location.LastKnownLongitude);
    // await this.popup.dismissLoading();
    // if (!response.status) {
    //   await this.popup.showError(response.error.errorMessage);
    //   return;
    // }
    // if (!response.data.results || response.data.results.length <= 0) {
    //   await this.popup.showError("We are not able to locate you at the moment. Have you enabled your location settings for this app?");
    // }
    // else {
    //   this.injured.injuredAddress = response.data.results[0].formatted_address;
    // }
  }
}
