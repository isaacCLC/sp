import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ActionSheetController, NavController, Platform } from "@ionic/angular";
import * as moment from 'moment';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimCall, ClaimDriver, ClaimManager, CurrentClaim } from 'src/app/Helpers/claim-manager';
import { getLookupData } from 'src/app/Helpers/responses';
import { ApiGateWayService } from 'src/app/Providers/api-gate-way.service';
import { LookupId, LookupOperation } from 'src/app/Providers/lookup-operation';
import { MediaManager } from "src/app/utils/media-manager";
import { PopupHelper } from "src/app/utils/popup-helper";
import { ServiceRequestsService } from 'src/app/utils/service-requests.service';

@Component({
  selector: 'app-motoraccident-claim-2',
  templateUrl: 'claim-2.page.html',
  styleUrls: ['claim-2.page.scss'],
})
export class Claim2Page implements OnInit {
  selectedOccupation;
  step: number = 1;
  sameAsInsured: boolean = false;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  claim: CurrentClaim = new CurrentClaim();
  driver: ClaimDriver = new ClaimDriver();
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };
  claimId: string = '';
  motorOffencesOptions: getLookupData[] = [];
  purposeOptions: getLookupData[] = [];
  licenseCodeOptions: getLookupData[] = [];
  occupationOptions: getLookupData[] = [];

  constructor(public serviceRequestsService: ServiceRequestsService, private actionSheetController: ActionSheetController, private statusBar: StatusBar, private platform: Platform, private navController: NavController,
    private _api: ApiGateWayService,
    private claimManager: ClaimManager, private mediaManager: MediaManager, private lookupOperation: LookupOperation, private popup: PopupHelper) {
    if (!this.claim.drivers)
      this.claim.drivers = [];
  } 

  async ngOnInit() {
    this.claimId = await this.claimManager.getClaimId();
    if (!this.claimId || this.claimId == ''){
      let claim = new CurrentClaim();
      claim.call = new ClaimCall();
      let id = this.serviceRequestsService.serviceReq.data.serviceRequests.callId.toString();
      claim.call.callRef = this.serviceRequestsService.serviceReq.data.serviceRequests.callRef.toString();
      this.claimManager.updateClaims(id, claim)
      this.claimManager.setClaimId(id)
    }
    await this.getClaim();
    await this.getAllOptions();
  }

  async getClaim() {
    let claims = await this.claimManager.getClaims();
    this.claim = claims.get(this.claimId);
    console.log(this.claim)
    if (!this.claim.call)
      this.claim.call = new ClaimCall();
    if (!this.claim.drivers)
      this.claim.drivers = [];
    if (this.claim.drivers.length > 0)
      this.driver = this.claim.drivers[0];
    this.claim.callID = this.claimId;
  }


  async getAllOptions() {
    await this.getOptions(LookupId.previousMotorOffence);
    await this.getOptions(LookupId.vehiclePurpose);
    await this.getOptions(LookupId.licenseCode);
    await this.getOptions(LookupId.occupation);
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
        case LookupId.previousMotorOffence:
          this.motorOffencesOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
          break;
        case LookupId.vehiclePurpose:
          this.purposeOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
          break;
        case LookupId.licenseCode:
          this.licenseCodeOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
          break;
        case LookupId.occupation:
          this.occupationOptions = response.data.sort((one, two) => (one.lookup_item_id < two.lookup_item_id ? -1 : 1));
          break;
        default:
          break;
      }
    }
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    this.driver.driverAddressDescription = address.formatted_address;
  }



  async setDriversLicence(side) {
    console.log("Getting image")
    this.mediaManager.pickImage(true, true, 2.5).then(async image => {
      console.log("Got image")
      if (image == null)
        return;
      console.log(side)
      side == 1 ? this.claim.images.driversLicenseImageFront = image : this.claim.images.driversLicenseImageBack = image
    });
  }

  async deleteLicenseImage(e, side) {
    e.stopPropagation();
    side == 1 ? await this.mediaManager.deleteMedia(this.claim.images.driversLicenseImageFront) : await this.mediaManager.deleteMedia(this.claim.images.driversLicenseImageBack)
    side == 1 ? this.claim.images.driversLicenseImageFront = null : this.claim.images.driversLicenseImageBack = null
  }


  async save() {
    // Check completeness
    if (this.claim.completed.indexOf(this.step - 1) <= -1) {
      this.claim.completed.push(this.step - 1);
      this.claim.completed = this.claim.completed.sort((n1, n2) => n1 - n2);
    }

    this.claim.lastUpdated = moment().toISOString();
    this.claim.drivers[0] = this.driver;
    await this.claimManager.updateClaims(this.claimId, this.claim);
  }
  pause() {
    this.save();
    this.navController.navigateBack('/motoraccident/overview');
  }

  nextStep() {
    this.save();
    this._api.addDriver(this.claim).then(response => {
      if (response.data[0]) {
        this.driver.driverId = response.data[0].driverId
      }
      this.navController.navigateForward('/motoraccident/step' + (this.step + 1));
    })
  }

  previousStep() {
    this.save();
    this.navController.navigateBack('/motoraccident/step' + (this.step - 1));
  }
}