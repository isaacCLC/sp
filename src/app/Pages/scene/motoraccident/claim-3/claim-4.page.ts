import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { NavController, Platform } from "@ionic/angular";
import * as moment from 'moment';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimCall, ClaimManager, CurrentClaim } from 'src/app/helpers/claim-manager';
import { MediaManager } from "src/app/utils/media-manager";
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-motoraccident-claim-4',
  templateUrl: 'claim-4.page.html',
  styleUrls: ['claim-4.page.scss'],
})
export class Claim4Page implements OnInit {

  step: number = 3;

  description;
  estimate;
  repairerName;
  repairerContactNumber;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  claim: CurrentClaim = new CurrentClaim();

  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };
  claimId: string = '';

  constructor(private popup: PopupHelper, private statusBar: StatusBar, private platform: Platform, private navController: NavController,
    private claimManager: ClaimManager, private mediaManager: MediaManager) {
    if (!this.claim.call)
      this.claim.call = new ClaimCall();


  }

  async ngOnInit() {
    this.claimId = await this.claimManager.getClaimId();
    await this.getClaim();
  }

  async getClaim() {
    let claims = await this.claimManager.getClaims();
    this.claim = claims.get(this.claimId);
    if (!this.claim.call)
      this.claim.call = new ClaimCall();
  }

  public handleVehicleInspectedAddressChange(address: Address) {
    // Do some stuff
    this.claim.call.ownDamageInspectionLocation = address.formatted_address;
  }

  public handleRepairerAddressChange(address: Address) {
    // Do some stuff
    this.claim.call.repAddress = address.formatted_address;
  }

  getQuoteImage() {
    this.mediaManager.pickImage(true, true, -1).then(async image => {
      if (image == null)
        return;
      this.claim.images.quoteImage = image;
    });
  }

  async deleteQuoteImage(e) {
    e.stopPropagation();
    await this.mediaManager.deleteMedia(this.claim.images.quoteImage);
    this.claim.images.quoteImage = null;
  }

  getDamagePhotos(side) {
    console.log(this.claim)
    this.mediaManager.pickImage(true, true, -1).then(async image => {
      if (image == null)
        return;
      switch (side) {
        case 1:
          this.claim.images.damagePhotos.front = image;
          break;
        case 2:
          this.claim.images.damagePhotos.back = image;
          break;
        case 3:
          this.claim.images.damagePhotos.left = image;
          break;
        case 4:
          this.claim.images.damagePhotos.right = image;
          break;
      }
    });
  }

  getDamageVideo() {
    this.mediaManager.pickVideo(true, true, -1).then(async video => {
      this.claim.videos.damageVideo = video
    })
  }

  async deleteDamageImage(e, side: any) {
    e.stopPropagation();
    switch (side) {
      case 1:
        this.mediaManager.deleteMedia(this.claim.images.damagePhotos.front);
        this.claim.images.damagePhotos.front = null;
        break;
      case 2:
        this.mediaManager.deleteMedia(this.claim.images.damagePhotos.back);
        this.claim.images.damagePhotos.back = null;
        break;
      case 3:
        this.mediaManager.deleteMedia(this.claim.images.damagePhotos.left);
        this.claim.images.damagePhotos.left = null;
        break;
      case 4:
        this.mediaManager.deleteMedia(this.claim.images.damagePhotos.right);
        this.claim.images.damagePhotos.right = null;
        break;
      case 5:
        this.mediaManager.deleteMedia(this.claim.videos.damageVideo);
        this.claim.videos.damageVideo = null;
        break;
    }
  }

  async save() {
    // Check completeness
    if (this.stepForm.valid) {
      if (this.claim.completed.indexOf(this.step - 1) <= -1) {
        this.claim.completed.push(this.step - 1);
        this.claim.completed = this.claim.completed.sort((n1, n2) => n1 - n2);
      }
    }
    else {
      const index = this.claim.completed.indexOf(this.step - 1, 0);
      if (index > -1) {
        this.claim.completed.splice(index, 1);
      }
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
    this.navController.navigateForward('/motoraccident/step' + (this.step + 1));
  }

  async previousStep() {
    await this.save();
    this.navController.navigateBack('/motoraccident/step' + (this.step - 1));
  }
}