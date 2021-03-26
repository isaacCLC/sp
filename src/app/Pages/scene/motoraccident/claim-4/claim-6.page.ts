import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { NavController, Platform } from "@ionic/angular";
import { data } from 'jquery';
import * as moment from 'moment';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimCall, ClaimManager, CurrentClaim } from 'src/app/Helpers/claim-manager';
import { Helpers } from 'src/app/Helpers/helpers';
import { getLookupData } from 'src/app/Helpers/responses';
import { ApiGateWayService } from 'src/app/Providers/api-gate-way.service';
import { LookupOperation,LookupId } from 'src/app/Providers/lookup-operation';
import { AppLocation } from "src/app/utils/app-location";
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-motoraccident-claim-6',
  templateUrl: 'claim-6.page.html',
  styleUrls: ['claim-6.page.scss'],
})
export class Claim6Page implements OnInit {
  step: number = 4;
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };

  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  claim: CurrentClaim = new CurrentClaim();
  claimId: string = '';
  maxDate = moment().toISOString();
  visibilityOptions: getLookupData[] = [];
  roadStateOptions: getLookupData[] = [];
  roadWidthOptions: getLookupData[] = [];
  weatherOptions: getLookupData[] = [];
  streetLightingOptions: getLookupData[] = [];

  constructor( private helpers: Helpers,private popup: PopupHelper, private statusBar: StatusBar, private platform: Platform, private navController: NavController,
    private claimManager: ClaimManager, public location: AppLocation, private lookupOperation: LookupOperation, private _api: ApiGateWayService) {
    if (!this.claim.call)
      this.claim.call = new ClaimCall();

  }

  async ngOnInit() {
    this.location.locate(true);
    this.claimId = await this.claimManager.getClaimId();
    await this.getClaim();
    await this.getAllOptions();
  }

  async getClaim() {
    let claims = await this.claimManager.getClaims();
    this.claim = claims.get(this.claimId);
    if (!this.claim.call.accDateOfLoss || this.claim.call.accDateOfLoss == '')
      this.claim.call.accDateOfLoss = moment().toISOString();
    if (!this.claim.call.accTimeOfLoss || this.claim.call.accTimeOfLoss == '')
      this.claim.call.accTimeOfLoss = moment().toISOString();
  }

  async getAllOptions() {
    await this.getOptions(LookupId.visibility);
    await this.getOptions(LookupId.stateOfRoad);
    await this.getOptions(LookupId.widthOfRoad);
    await this.getOptions(LookupId.weatherConditions);
    await this.getOptions(LookupId.streetLighting);
  }


  async getOptions(lookup: LookupId) {
    let response = await this.lookupOperation.getLookup(lookup);
    if (!response.status) {
      await this.popup.showError(response.error.errorMessage);
      this.navController.navigateRoot('/app/tabs/tab1', { animated: true });
      return;
    }
    else {
      switch (lookup) {
        case LookupId.visibility:
          this.visibilityOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
          break;
        case LookupId.stateOfRoad:
          this.roadStateOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
          break;
        case LookupId.widthOfRoad:
          this.roadWidthOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
        case LookupId.weatherConditions:
          this.weatherOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
        case LookupId.streetLighting:
          this.streetLightingOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
        default:
          break;
      }
    }
  }


  public handleAddressChange(address: Address) {
    // Do some stuff
    this.claim.call.accPlace = address.formatted_address;
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