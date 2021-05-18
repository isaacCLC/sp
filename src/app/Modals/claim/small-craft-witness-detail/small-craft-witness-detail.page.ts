import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimWitness } from 'src/app/helpers/claim-manager';
import { AppLocation } from "src/app/utils/app-location";
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-small-craft-witness-detail',
  templateUrl: 'small-craft-witness-detail.page.html',
  styleUrls: ['small-craft-witness-detail.page.scss'],
})
export class SmallCraftWitnessDetailPage implements OnInit {

  witness: ClaimWitness = new ClaimWitness();
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };
  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, public location: AppLocation) {
    this.witness.witnessAddress = this.navParams.get('witnessAddress') || '';
    this.witness.witnessContactNumber = this.navParams.get('witnessContactNumber') || '';
    this.witness.witnessFirstName = this.navParams.get('witnessFirstName') || '';
    this.witness.witnessLastName = this.navParams.get('witnessLastName') || '';
    this.witness.witnessIdNumber = this.navParams.get('witnessIdNumber') || '';
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
    await this.popup.showConfirm("Delete this witness?", "This will permanently delete this witness.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    this.witness.witnessAddress = address.formatted_address;
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
    //   this.witness.witnessAddress = response.data.results[0].formatted_address;
    // }
  }

}
