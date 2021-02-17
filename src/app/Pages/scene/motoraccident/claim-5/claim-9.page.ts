import { Component, OnInit } from '@angular/core';
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ModalController, NavController, Platform } from "@ionic/angular";
import * as moment from 'moment';
import { ClaimManager, CurrentClaim } from 'src/app/Helpers/claim-manager';
import { UserState } from 'src/app/Helpers/user-state';
import { OtherPropertyDetailPage } from 'src/app/Modals/claim/other-property-detail/other-property-detail.page';

import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-motoraccident-claim-9',
  templateUrl: 'claim-9.page.html',
  styleUrls: ['claim-9.page.scss'],
})
export class Claim9Page implements OnInit {
  step: number = 5;

  claim: CurrentClaim = new CurrentClaim();
  claimId: string = '';

  constructor(private modalController: ModalController, private statusBar: StatusBar, private platform: Platform,
    private navController: NavController, private state: UserState, private claimManager: ClaimManager, private popup: PopupHelper) {


  }

  async ngOnInit() {
    this.claimId = await this.claimManager.getClaimId();
    await this.getClaim();
  }

  async getClaim() {
    let claims = await this.claimManager.getClaims();
    this.claim = claims.get(this.claimId);
  }

  async save() {
    // Check completeness
    if (this.claim.completed.indexOf(this.step - 1) <= -1) {
      this.claim.completed.push(this.step - 1);
      this.claim.completed = this.claim.completed.sort((n1, n2) => n1 - n2);
    }
    this.claim.lastUpdated = moment().toISOString();
    await this.claimManager.updateClaims(this.claimId, this.claim);
  }

  async pause() {
    await this.save();
    this.navController.navigateBack('/motoraccident/overview');
  }

  async nextStep() {
    await this.save();
    this.navController.navigateForward('/motoraccident/overview');
  }

  async previousStep() {
    await this.save();
    this.navController.navigateBack('/motoraccident/step' + (this.step - 1));
  }

  async otherPropertyDetail(index: number) {
    const modal = await this.modalController.create({
      component: OtherPropertyDetailPage,
      componentProps: {
        propAddress: this.claim.property[index].propAddress,
        propContactNumber: this.claim.property[index].propContactNumber,
        propDamageDescription: this.claim.property[index].propDamageDescription,
        propFirstName: this.claim.property[index].propFirstName,
        propIdNumber: this.claim.property[index].propIdNumber,
        propLastName: this.claim.property[index].propLastName,
        propType: this.claim.property[index].propType,
        index: index
      }
    });
    await modal.present();
    let response = await modal.onDidDismiss();
    if (response.data && response.data.index != undefined && response.data.index >= 0) {
      this.claim.property.splice(response.data.index, 1);
    }
  }

  async addOtherProperty() {
    const modal = await this.modalController.create({
      component: OtherPropertyDetailPage,
    });
    await modal.present();
    let response = await modal.onDidDismiss();
    if (response.data && !response.data.index) {
      this.claim.property.push(response.data);
    }
  }

  async delete(index: number) {
    await this.popup.showConfirm("Delete property?", "This will permanently delete this property.", "Yes", () => {
      this.claim.property.splice(index, 1);
    }, "Not yet", null);

  }
}