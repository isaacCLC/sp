import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimProperty } from 'src/app/Helpers/claim-manager';
import { getLookupData } from 'src/app/Helpers/responses';
import { LookupId, LookupOperation } from 'src/app/Providers/lookup-operation';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-small-craft-damage-detail',
  templateUrl: 'small-craft-damage-detail.page.html',
  styleUrls: ['small-craft-damage-detail.page.scss'],
})
export class SmallCraftDamageDetailPage implements OnInit {

  prop: ClaimProperty = new ClaimProperty();
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };
  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  paintworkOptions: getLookupData[] = [];

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, private lookupOperation: LookupOperation) {
    this.prop.propType = this.navParams.get('propType') || 'Craft';
    this.prop.propMake = this.navParams.get('propMake') || '';
    this.prop.propModel = this.navParams.get('propModel') || '';
    this.prop.propCrewTotal = this.navParams.get('propCrewTotal') || 0;
    this.prop.propDescription = this.navParams.get('propDescription') || '';
    this.prop.propYear = this.navParams.get('propYear') || 2019;
    this.prop.propWherePurchased = this.navParams.get('propWherePurchased') || '';
    this.prop.propLengthFeet = this.navParams.get('propLengthFeet') || 0;
    this.prop.propDesignedSpeed = this.navParams.get('propDesignedSpeed') || '';
    this.prop.propHorsePower = this.navParams.get('propHorsePower') || '';
    this.prop.propRegistrationNumber = this.navParams.get('propRegistrationNumber') || '';
    this.prop.propPaintworkDescription = this.navParams.get('propPaintworkDescription') || '';
    this.prop.propReplacementValue = this.navParams.get('propReplacementValue') || '';
    this.prop.propMarketValue = this.navParams.get('propMarketValue') || '';
    this.prop.propSumInsured = this.navParams.get('propSumInsured') || '';
    this.index = this.navParams.get('index') || -1;
  }

  async ngOnInit() {
    await this.getPaintworkOptions();
  }

  async getPaintworkOptions() {
    let response = await this.lookupOperation.getLookup(LookupId.paintwork);
    if (!response.status) {
      await this.popup.showError(response.error.errorMessage);
      return;
    }
    else {
      this.paintworkOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
    }
  }

  clearProperty() {
    this.prop.propAddress = "";
    this.prop.propContactNumber = "";
    this.prop.propCrewTotal = 0;
    this.prop.propDamageDescription = "";
    this.prop.propDescription = "";
    this.prop.propDesignedSpeed = "";
    this.prop.propFirstName = "";
    this.prop.propHorsePower = "";
    this.prop.propIdNumber = "";
    this.prop.propLastName = "";
    this.prop.propLengthFeet = 0;
    this.prop.propMake = "";
    this.prop.propMarketValue = "";
    this.prop.propModel = "";
    this.prop.propPaintworkDescription = "";
    this.prop.propRegistrationNumber = "";
    this.prop.propReplacementValue = "";
    this.prop.propSumInsured = "";
    this.prop.propWherePurchased = "";
    this.prop.propYear = 2019;
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
    await this.popup.showConfirm("Delete this damaged item?", "This will permanently delete this damaged item.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    // this.property.witnessAddress = address.formatted_address;
  }
}
