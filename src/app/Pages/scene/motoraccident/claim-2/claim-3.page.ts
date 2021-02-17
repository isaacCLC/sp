import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { NavController, Platform } from "@ionic/angular";
import * as moment from 'moment';
import { ClaimCall, ClaimManager, ClaimVehicle, CurrentClaim } from 'src/app/Helpers/claim-manager';
import { GetUserVehicleListResponseData } from 'src/app/Helpers/responses';
import { ApiGateWayService } from 'src/app/Providers/api-gate-way.service';
import { LookupOperation } from 'src/app/Providers/lookup-operation';
import { LicenceDiscScanner } from "src/app/utils/licence-disc-scanner";
import { MediaManager } from "src/app/utils/media-manager";
import { PopupHelper } from "src/app/utils/popup-helper";


@Component({
  selector: 'app-motoraccident-claim-3',
  templateUrl: 'claim-3.page.html',
  styleUrls: ['claim-3.page.scss'],
})
export class Claim3Page implements OnInit {
  step: number = 2;

  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  claim: CurrentClaim = new CurrentClaim();
  claimId: string = '';

  vehicleList: GetUserVehicleListResponseData[] = [];
  myVehicle: GetUserVehicleListResponseData;
  vehicle: ClaimVehicle = new ClaimVehicle();
  constructor(private popup: PopupHelper,private _api: ApiGateWayService, private statusBar: StatusBar, private platform: Platform, private navController: NavController,
    private claimManager: ClaimManager, private lookupOperation: LookupOperation, private mediaManager: MediaManager, private barcode: LicenceDiscScanner, public zone: NgZone) {
    if (!this.claim.call)
      this.claim.call = new ClaimCall();
    ;
  }

  async ngOnInit() {
    this.claimId = await this.claimManager.getClaimId();
    await this.getClaim();
    // await this.getVehicleList();
  }

  async getClaim() {
    let claims = await this.claimManager.getClaims();
    this.claim = claims.get(this.claimId);
    if (!this.claim.call)
      this.claim.call = new ClaimCall();
    if (this.claim.vehicle.length > 0)
      this.vehicle = this.claim.vehicle[0];
    this.vehicle.dontUpdate = true;
  }

  // async getVehicleList() {
  //   let response = await this.lookupOperation.getUserVehicleList(this.state.appUserId);
  //   if (!response.status) {
  //     return;
  //   }
  //   if (response.data)
  //     this.vehicleList = response.data;
  // }

  vehicleChosen() {
    this.claim.call.makeDescription = this.myVehicle.makeDescription;
    this.vehicle.model = this.myVehicle.model;
    this.vehicle.vehicleColour = this.myVehicle.vehicleColour;
    this.vehicle.vehicleYear = Number.parseInt(this.myVehicle.vehicleYear);
    this.vehicle.vehicleVinNumber = this.myVehicle.vehicleVinNumber;
    this.vehicle.registrationNumber = this.myVehicle.registrationNumber;
    this.vehicle.dontUpdate = this.myVehicle.dontUpdate;

  }


  async scanLicenseDisc() {
    let response = await this.barcode.scan();
    this.zone.run(() => {
      this.claim.call.makeDescription = response.make;
      this.vehicle.model = response.seriesName;
      this.vehicle.make = response.make;
      this.vehicle.vehicleColour = response.color;
      this.vehicle.vehicleVinNumber = response.vinNo;
      this.vehicle.registrationNumber = response.licenceNo;
    });
  }

  async deleteLicenseImage(e) {
    e.stopPropagation();
    await this.mediaManager.deleteMedia(this.claim.images.licenseDiscImage);
    this.claim.images.licenseDiscImage = null;
  }

  async save() {
    // Check completeness
    if (this.stepForm.valid || !!this.claim.images.licenseDiscImage) {
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
    if (this.claim.vehicle.length <= 0)
      this.claim.vehicle.push(this.vehicle);
    else
      this.claim.vehicle[0] = this.vehicle;
    this.claim.lastUpdated = moment().toISOString();
    await this.claimManager.updateClaims(this.claimId, this.claim);
  }

  async pause() {
    await this.save();
    this.navController.navigateBack('/motoraccident/overview');
  }

  async nextStep() {
    this.save();
    console.log(this.vehicle.dontUpdate)
    this._api.addVehicle(this.claim).then(response => {
      if (response.data[0]) {
        this.vehicle.vehId = response.data[0].vehicleId
        this.save();
      }
      this.navController.navigateForward('/motoraccident/step' + (this.step + 1));
    })
  }

  async previousStep() {
    await this.save();
    this.navController.navigateBack('/motoraccident/step' + (this.step - 1));
  }
}