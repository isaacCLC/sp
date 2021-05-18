import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimProperty } from 'src/app/helpers/claim-manager';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-public-liability-property-detail',
  templateUrl: 'public-liability-property-detail.page.html',
  styleUrls: ['public-liability-property-detail.page.scss'],
})
export class PublicLiabilityPropertyDetailPage implements OnInit {

  property: ClaimProperty = new ClaimProperty();
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;

  index: number = -1;

  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper) {
    this.property.propAddress = this.navParams.get('propAddress') || '';
    this.property.propContactNumber = this.navParams.get('propContactNumber') || '';
    this.property.propDamageDescription = this.navParams.get('propDamageDescription') || '';
    this.property.propFirstName = this.navParams.get('propFirstName') || '';
    this.property.propIdNumber = this.navParams.get('propIdNumber') || '';
    this.property.propLastName = this.navParams.get('propLastName') || '';
    this.property.propType = this.navParams.get('propType') || '';
    this.property.propId = this.navParams.get('propId') || 0;
    this.property.propClaimLoggedFlag = this.navParams.get('propClaimLoggedFlag') || false;
    this.property.propClaimLoggedAmount = this.navParams.get('propClaimLoggedAmount') || '';
    this.property.propClaimSettlementOfferFlag = this.navParams.get('propClaimSettlementOfferFlag') || false;
    this.index = this.navParams.get('index') || -1;
  }

  ngOnInit() {

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
    await this.popup.showConfirm("Delete this property?", "This will permanently delete this property.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    this.property.propAddress = address.formatted_address;
  }
}
