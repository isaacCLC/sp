import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimThirdparty } from 'src/app/Helpers/claim-manager';
import { AppLocation } from "src/app/utils/app-location";
import { AppStorage } from "src/app/utils/app-storage";
import { MediaManager } from "src/app/utils/media-manager";
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-small-craft-third-party-detail',
  templateUrl: 'small-craft-third-party-detail.page.html',
  styleUrls: ['small-craft-third-party-detail.page.scss'],
})
export class SmallCraftThirdPartyDetailPage implements OnInit {

  thirdParty: ClaimThirdparty = new ClaimThirdparty();

  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };

  sameAsDriver: boolean = false;
  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;


  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, private mediaManager: MediaManager, private appStorage: AppStorage,
    public location: AppLocation) {
    this.thirdParty.tpFirstName = this.navParams.get('tpFirstName') || '';
    this.thirdParty.tpLastName = this.navParams.get('tpLastName') || '';
    this.thirdParty.tpIdNumber = this.navParams.get('tpIdNumber') || '';
    this.thirdParty.tpAddress = this.navParams.get('tpAddress') || '';
    this.thirdParty.tpContactNumber = this.navParams.get('tpContactNumber') || '';
    this.thirdParty.tpPropertyDescription = this.navParams.get('tpPropertyDescription') || '';
    this.thirdParty.tpDamageDescription = this.navParams.get('tpDamageDescription') || '';
    this.thirdParty.tpIsInsured = this.navParams.get('tpIsInsured') || false;
    this.index = this.navParams.get('index') || -1;
  }

  ngOnInit() {
    this.location.locate(true);
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
    //   this.thirdParty.tpAddress = response.data.results[0].formatted_address;
    // }
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
    await this.popup.showConfirm("Delete this third party?", "This will permanently delete this third party.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    this.thirdParty.tpAddress = address.formatted_address;
  }

  public handleOwnerAddressChange(address: Address) {
    this.thirdParty.tpVehicleOwnerAddress = address.formatted_address;
  }

  addLicenseImage() {

  }

  addVehicleImage() {

  }
}
