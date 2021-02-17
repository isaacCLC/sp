import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { UserState } from "../Helpers/user-state";
import { ClaimManager, CurrentClaim } from "../Helpers/claim-manager";
import { AddClaimRequest } from "../Helpers/requests";
import { addClaimResponse, addServiceRatingResponse, addToDocumentWarehouseResponse, GetDriverLocationResponse, GetLocationResponse, getUserCallsListResponse, SetLocationResponse, getSALicenseAPIKey, getDecodedSALicense, GetServiceRequestResponse } from "../Helpers/responses";
import { ApiGateWayService } from "./api-gate-way.service";
import { PopupHelper } from "../Helpers/popup-helper";


@Injectable({
  providedIn: 'root',
})
export class ClaimOperation {

  constructor(private _api: ApiGateWayService, private popup: PopupHelper, private http: HttpClient, private userState: UserState, private claimManager: ClaimManager) {

  }

  async uploadMedia(callId, type, media){
    let response = media?await this._api.addToDocumentWarehouse(callId,type, media): {status: true}
    console.log(response)
    if (!response['status']) {
      await this.popup.showError(response['status']);
      return false;
    }else{
      return true
    }
  }

  async submitImages(callId, claim): Promise<boolean> {
    let driversLicenseResponse = await this.uploadMedia(callId, DocType.DriversLicensePhoto, claim.images.driversLicenseImageBack.base64);
    let driversLicenseResponse2 = await this.uploadMedia(callId, DocType.DriversLicensePhoto, claim.images.driversLicenseImageFront.base64);
    let accidentSketchResponse = await this.uploadMedia(callId, DocType.AccidentSketch, claim.images.accidentSketch);
    let quoteResponse = await this.uploadMedia(callId, DocType.ServiceInvoicePhoto, claim.images.quoteImage.base64);     
    let accidentSceneResponse1 = await this.uploadMedia(callId, DocType.VehicleDamagePhoto, claim.images.damagePhotos.back.base64);
    let accidentSceneResponse2 = await this.uploadMedia(callId, DocType.VehicleDamagePhoto, claim.images.damagePhotos.front.base64);
    let accidentSceneResponse3 = await this.uploadMedia(callId, DocType.VehicleDamagePhoto, claim.images.damagePhotos.left.base64);
    let accidentSceneResponse4 = await this.uploadMedia(callId, DocType.VehicleDamagePhoto, claim.images.damagePhotos.right.base64);
    let video = await this.uploadMedia(callId, DocType.IncidentVideo, claim.videos.damageVideo.base64);
    let driverSignatureResponse = await this.uploadMedia(callId, DocType.DriverSignature, claim.images.insuredSignature);
    return true;
  }



}

export enum DocType {
  DriversLicensePhoto = 138,
  VehicleDamagePhoto = 139,
  AccidentSketch = 140,
  ServiceInvoicePhoto = 142,
  DriverSignature = 144,
  InsuredSignature = 145,
  ThirdPartyIdDocument = 148,
  ThirdPartyVehicleDamage = 149,
  IncidentVideo = 160
}