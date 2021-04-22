import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { ClaimTypeId, CurrentClaim } from 'src/app/helpers/claim-manager';
import { getClaimTypesListData } from 'src/app/helpers/responses';
import { ClaimOperation } from 'src/app/providers/claim-operation';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-contact-me',
  templateUrl: 'contact-me.page.html',
  styleUrls: ['contact-me.page.scss'],
})
export class contactMePage implements OnInit {

  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  type: string = 'email';
  claim: CurrentClaim = new CurrentClaim();
  claimTypes: getClaimTypesListData[] = [];
  claimNames: Record<ClaimTypeId, string> = {
    [ClaimTypeId.AllRisk]: 'All risks claim',
    [ClaimTypeId.MotorAccidentTP]: 'Motor accident - including third party',
    [ClaimTypeId.MotorAccidentSingle]: 'Motor accident - single',
    [ClaimTypeId.MotorTheft]: 'Motor theft',
    [ClaimTypeId.PublicLiability]: 'Public liability claim',
    [ClaimTypeId.Gadget]: 'Gadget claim (Phones)',
    [ClaimTypeId.Glass]: 'Glass claim',
    [ClaimTypeId.TyreAndRim]: 'Tyre and rim',
    [ClaimTypeId.SmallCraftLeisure]: 'Small craft / leisure',
    [ClaimTypeId.PropertyLoss]: 'Property/Infrastructure Damage',
    [ClaimTypeId.Geyser]: 'Geyser claim',
  };


  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, private claimOperation: ClaimOperation) {
    // this.claimant.claimantAddress = this.navParams.get('claimantAddress') || '';
    this.type = this.navParams.get('type') || 'email';
    this.claimTypes = this.navParams.get('claimTypes') || [];

  }

  ngOnInit() {

  }

  async save(data: any = null) {
    if (!this.stepForm.valid) {
      await this.popup.showAlert('Missing fields', 'All fields must be completed in this form.');
      return;
    }
    let response = await this.submitClaim();
    // if (!response)
    //   return;

    this.close(data);
  }

  public async close(data: any = null) {
    await this.modalController.dismiss(data);
  }

  async submitClaim() {
    // this.claim.call.appUserId = this.state.appUserId;
    // this.claim.call.subProductId = 8;
    // this.claim.call.subSubProductId = 48;
    // await this.popup.showLoading('Submitting Claim request...');
    // let response = await this.claimOperation.addClaim(this.claim);
    // if (!response.status) {
    //   await this.popup.dismissLoading();
    //   await this.popup.showError(response.error.errorMessage);
    //   return false;
    // }

    // await this.popup.dismissLoading();
    // if (this.type == 'email')
    //   await this.popup.showToast('Thank you, an email with the claim form will be sent to you shortly.');
    // else
    //   await this.popup.showAlert('Call request successful', 'We will be in contact with you shortly! Your case number is ' + response.data[0].callRef + '.');

    // return true;
  }

}
