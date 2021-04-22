import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../helpers/app-config";
import { ClcApiBase } from "./base";
import { GetContactResponse, getDocumentTypesListResponse, GetFaqResponse, getLookupResponse, GetSettingsResponse, GetTosResponse, GetUserVehicleListResponse } from "../helpers/responses";


@Injectable({
  providedIn: 'root',
})
export class LookupOperation extends ClcApiBase {

  constructor(private http: HttpClient) {
    super();
  }

  async getTitles() {
    return this.getLookup(LookupId.titles);
  }

  async getRelationShipsToMainMember() {
    return this.getLookup(LookupId.relationshipToMainMember);
  }

  async getLookup(lookupId: number): Promise<getLookupResponse> {
    try {

      let response = this.parseResponse(await this.http.get<getLookupResponse>(this.apiUrl + "/rest/cca/v1/lookup/getLookup.php?key=" + AppConfig.ApiKey + "&lookupId=" + lookupId).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }

  async getDocumentTypesList(): Promise<getDocumentTypesListResponse> {
    try {
      let response = this.parseResponse(await this.http.get<getDocumentTypesListResponse>(this.apiUrl + "/rest/cca/v1/lookup/getDocumentTypesList.php?key=" + AppConfig.ApiKey).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }

  async getUserVehicleList(appUserId: number): Promise<GetUserVehicleListResponse> {

    try {
      let response = this.parseResponse(await this.http.get<GetUserVehicleListResponse>(this.apiUrl + "/rest/cca/v1/client/vehicle/getUserVehicleList.php?key=" + AppConfig.ApiKey + "&appUserId=" + appUserId).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }

  async getFaq(appUserId: number, schemeID: number): Promise<GetFaqResponse> {

    try {
      let response = this.parseResponse(await this.http.get<GetFaqResponse>(this.apiUrl + "/rest/cca/v1/lookup/getFaq.php?key=" + AppConfig.ApiKey + "&appUserId=" + appUserId + "&scheme_id="+schemeID).toPromise());
      console.log(response)
      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }

  async getTos(appUserId: number): Promise<GetTosResponse> {

    try {
      let response = this.parseResponse(await this.http.get<GetTosResponse>(this.apiUrl + "/rest/cca/v1/lookup/getTos.php?key=" + AppConfig.ApiKey + "&appUserId=" + appUserId).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }
  
  async getAddress(latLng: any): Promise<any> {

    try {
      let response = this.parseResponse(await this.http.get<any>(this.apiUrl + "/rest/cca/v1/client/address/getAddressFromLatLong.php?key=" + AppConfig.ApiKey+"&latitude="+latLng.latitude+"&longitude="+latLng.longitude).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }
  async getAddressFromAddress(address:string):Promise<any>{ //returns full address(including latlng) from physical address provided

    try {
      let response = this.parseResponse(await this.http.get<any>(this.apiUrl + "/rest/cca/v1/client/address/getAddressFromAddress.php?key=" + AppConfig.ApiKey+"&address=="+address).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }

  async getContact(appUserId: number): Promise<GetContactResponse> {

    try {
      let response = this.parseResponse(await this.http.get<GetContactResponse>(this.apiUrl + "/rest/cca/v1/lookup/getContact.php?key=" + AppConfig.ApiKey + "&appUserId=" + appUserId).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }

  async getSettings(schemeID: number): Promise<GetSettingsResponse> {
    try {
      let response = this.parseResponse(await this.http.get<GetSettingsResponse>(this.apiUrl + "/rest/cca/v1/lookup/getSchemeSettings.php?key=" + AppConfig.ApiKey + "&scheme_id=" + schemeID).toPromise());

      return response;
    }
    catch (e) {
      return this.createStandardErrorMessage(e);
    }
  }
}

export enum LookupId {
  titles = 1,
  relationshipToMainMember = 50,
  incidentType = 78,
  locationType = 79,
  visibility = 80,
  stateOfRoad = 81,
  widthOfRoad = 82,
  weatherConditions = 83,
  occupation = 84,
  previousMotorOffence = 85,
  vehiclePurpose = 86,
  streetLighting = 87,
  licenseCode = 88,
  paintwork = 89,
}