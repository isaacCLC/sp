import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimClaimant } from 'src/app/Helpers/claim-manager';
import { getLookupData } from 'src/app/Helpers/responses';
import { LookupId, LookupOperation } from 'src/app/Providers/lookup-operation';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-claimant-detail',
  templateUrl: 'claimant-detail.page.html',
  styleUrls: ['claimant-detail.page.scss'],
})
export class claimantDetailPage implements OnInit {

  claimant: ClaimClaimant = new ClaimClaimant();
  selectedOccupation;

  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };
  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  occupationOptions: getLookupData[] = [];

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, private lookupOperation: LookupOperation) {
    this.claimant.claimantAddress = this.navParams.get('claimantAddress') || '';
    this.claimant.claimantContactNumber = this.navParams.get('claimantContactNumber') || '';
    this.claimant.claimantFirstName = this.navParams.get('claimantFirstName') || '';
    this.claimant.claimantId = this.navParams.get('claimantId') || 0;
    this.claimant.claimantIdNumber = this.navParams.get('claimantIdNumber') || '';
    this.claimant.claimantLastName = this.navParams.get('claimantLastName') || '';
    this.claimant.claimantOccupation = this.navParams.get('claimantOccupation') || '';
    this.claimant.claimantValid = this.navParams.get('claimantValid') || false;
    this.index = this.navParams.get('index') || -1;

  }

  async ngOnInit() {
    await this.getOccupationList();
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
    await this.popup.showConfirm("Delete this claimant?", "This will permanently delete this claimant.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    this.claimant.claimantAddress = address.formatted_address;
  }

  async getOccupationList() {
    let response = await this.lookupOperation.getLookup(LookupId.occupation);
    if (!response.status) {
      await this.popup.showError(response.error.errorMessage);
      return;
    }
    else {
      this.occupationOptions = response.data;
      this.occupationOptions.forEach(occupation=>{
        occupation.title = this.titleCaseWord(occupation.title);
        if(occupation.lookup_item_id == this.claimant.claimantOccupation.toString()){
          this.selectedOccupation = occupation;
        }
      })
    }
  }

  occupationChosen() {
    this.claimant.claimantOccupation = this.selectedOccupation.lookup_item_id;
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
