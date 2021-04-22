import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { AlertsProviderService } from './alerts-provider.service';
import { GeneralService } from '../helpers/generals';
import { BaseMessage, DriverDetails, getJobHistory, iServiceRequest } from '../models/appModels';
import { ClaimManager, CurrentClaim } from "../helpers/claim-manager";
import { AddClaimRequest } from "../helpers/requests";
import { Storage } from "@ionic/storage";
import { FormParameter } from "./base";
import { addToDocumentWarehouseResponse } from "../helpers/responses";
import { SmsRetriever } from "@ionic-native/sms-retriever/ngx";
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  })
};

@Injectable({
  providedIn: "root"
})
export class ApiGateWayService {
  private serverHost: string;
  private prodHost: string;
  private devHost: string;
  private localhost: string;
  private _generals: GeneralService = new GeneralService();
  private api_key: string;

  constructor(private claimManager: ClaimManager, private storage: Storage, private _http: HttpClient, private alertProvider: AlertsProviderService,  private smsRetriever: SmsRetriever) {

    this.prodHost = "https://api.lmsystem.co.za";
    this.devHost = "https://apidev.lmsystem.co.za";
    // this.localhost = "https://192.168.220.209"
    this.api_key = "15fc9b573b4eadda81d386689dfaff3a";
    this.serverHost = this.devHost;
  }


  createFormData(...params: FormParameter[]) {
    const formData = new FormData();

    for (let item of params)
      formData.append(item.key, item.value);
    return formData;
  }

  parseResponse<T extends BaseMessage>(message: T): T {
    // if this message has an error, move it's properties from data to error objects
    if (!message.status) {
      message.error = {
        errorCode: message.data.errorCode,
        errorMessage: message.data.errorMessage,
        errorTechMessage: message.data.errorTechMessage
      };
      message.data = {};
    }

    return message;
  }


  async addToDocumentWarehouse(callId: number, docType: number, imgData: string) {
    let data = this.createFormData(
      { key: "callId", value: callId.toString() },
      { key: "docType", value: docType.toString() },
      { key: "mobile_sp_upload", value: '1' },
      { key: "imgData", value: imgData.split(',')[1] },
    );

    return this._http.post(this.serverHost + "/rest/cca/v1/calls/addToDocumentWarehouse.php?key=" + this.api_key, data).toPromise();

  }


  validateLogIn(credentialObj: any): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/getDriverLogin.php", {
      params: {
        key: this.api_key,
        appUsername: credentialObj.userName,
        appPassword: credentialObj.passWord,
        pushPlayerId: credentialObj.pushPlayerId
      }
    });

  }

  async changePassword(payLoad: any): Promise<any> {
    let id = await this.storage.get("driverID")

    return this._http.get(this.serverHost + "/rest/cca/v1/calls/addDriver.php", {
      params: {
        key: this.api_key,
        driverId: id,
        driverPassword: payLoad.driverPassword
      }
    }).toPromise()

  }

  async acceptJob(callId, acceptJob, callRef, claim?): Promise<any> {
    // Make sure datetime fields are correct format
    let params = {};
    let id = await this.storage.get("driverID")
    if (claim) {
      claim = await this.claimManager.formatClaim(claim);

      let tp = [];
      let prop = [];

      claim.thirdparty.forEach(x => {
        tp.push({ ...x, licenseImage: undefined, vehicleImage: undefined });
      });
      claim.property.forEach(x => {
        prop.push({ ...x, tyreImage: undefined, tyreThreadImage: undefined, rimImage: undefined });
      });

      let data = <AddClaimRequest>{
        address: claim.address,
        call: claim.call,
        drivers: claim.drivers,
        vehicle: claim.vehicle,
        checklist: claim.checklist
      };

      params = {
        key: this.api_key,
        driverId: id,
        callRef: callRef,
        acceptJob: acceptJob,
        callId: callId,
        claim: JSON.stringify(data)
      }
    } else {
      params = {
        key: this.api_key,
        driverId: id,
        callRef: callRef,
        acceptJob: acceptJob,
        callId: callId,
      }
    }


    return this._http.get(this.serverHost + "/rest/cca/v1/sp/acceptServiceRequest.php", {
      params: params
    }).toPromise()
  }



  async getDriver(): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/calls/getDriver.php", {
      params: {
        key: this.api_key,
        driverId: id,
      }
    }).toPromise()

  }

  async checkServiceRequests(): Promise<any> {
    let id = await this.storage.get("driverID")
    if(id){
      return this._http.get(this.serverHost + "/rest/cca/v1/sp/checkServiceRequests.php", {
        params: {
          driverId: id,
          key: this.api_key
        }
      }).toPromise()
    }
  }

  async getJobHistory(): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/spGetJobHistory.php", {
      params: {
        key: this.api_key,
        driverId: id,
      }
    }).toPromise()
  }

  async getChats(callID): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/chat.php", {
      params: {
        key: this.api_key,
        call_id: callID,
        action: 'getChats',
        driverId: id
      }
    }).toPromise()
  }

  async sendMessage(callID, message): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/chat.php", {
      params: {
        key: this.api_key,
        call_id: callID,
        message: message,
        driverID: id,
        action: 'sendMessage'
      }
    }).toPromise()
  }

  async markMessageAsRead(callID, messageID): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/chat.php", {
      params: {
        key: this.api_key,
        call_id: callID,
        messageID: messageID,
        action: 'markAsRead'
      }
    }).toPromise()
  }

  getSpVehicleList(spID: any): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/client/vehicle/getUserVehicleList.php",
      {
        params: {
          vehicleSpId: spID,
          key: this.api_key
        },
        observe: "response"
      }
    );
  }

  async completeJOB(): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(
      this.serverHost + "/rest/cca/v1/sp/addDriverJobComplete.php",
      {
        params: {
          driverId: id,
          key: this.api_key
        },
        observe: "response"
      }
    ).toPromise()
  }

  getGeoCoding(lat: any, lng: any): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/client/address/getAddressFromLatLong.php",
      {
        params: {
          latitude: lat,
          longitude: lng,
          key: this.api_key
        },
        observe: "response"
      }
    );
  }

  getReverseGeocoding(address: string): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/client/address/getAddressFromAddress.php",
      {
        params: {
          address: address,
          key: this.api_key
        },
        observe: "response"
      }
    );
  }


  async ServiceRequestsResponse(): Promise<any> {
    let id = await this.storage.get("driverID")

    return this._http.get(this.serverHost + "/rest/cca/v1/sp/checkServiceRequests.php", {
      params: {
        driverId: id,
        key: this.api_key
      }
    }).toPromise()

  }

  addDiverNumber(payLoad): Promise<any> {
    let res = fetch(this.serverHost + "/rest/cca/v1/sp/addDriverMobile.php?key=" + this.api_key, {
      method: 'post',
      body: JSON.stringify(payLoad)
    }).then(response => response.json())
    return res;

  }

  getDriverlogout(payLoad): Promise<any> {
    console.log(payLoad)
    let res = fetch(this.serverHost + "/rest/cca/v1/sp/getDriverlogout.php?key=" + this.api_key, {
      method: 'post',
      body: JSON.stringify(payLoad)
    }).then(response => response.json())
    return res;
  }

  getContactInfo(): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/lookup/getContact.php", {
      params: {
        key: this.api_key,
        appUserId: "12"
      },
      observe: "response"
    });
  }

  getFAQs(): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/lookup/getFaq.php", {
      params: {
        key: this.api_key
      },
      observe: "response"
    });
  }

  getTerms(payLoad): Promise<any> {
    let res = fetch(this.serverHost + "/rest/cca/v1/sp/getSPTerms.php?key=" + this.api_key, {
      method: 'post',
      body: JSON.stringify(payLoad)
    }).then(response => response.json())
    return res;
  }

  async getCallTerms(callRef): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/calls/getCallTerms.php", {
      params: {
        appUserId: id,
        callRef: callRef,
        key: this.api_key,
      }
    }).toPromise()
  }

  getDistance(payLoad): Promise<any> {
    let res = fetch(this.serverHost + "/rest/cca/v1/helper/getLocationDistTime.php?key=" + this.api_key, {
      method: 'post',
      body: JSON.stringify(payLoad)
    }).then(response => response.json())
    return res;

  }

  async setSpLocation(coordinates: any): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/setDriverLocation.php", {
      params: {
        driverId: id,
        key: this.api_key,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        call_id: coordinates.call_id
      }
    }).toPromise()
  }

  async setDriveStatus(diverStatus: any): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/calls/addDriver.php", {
      params: {
        driverId: id,
        key: this.api_key,
        driverStatus: diverStatus
      }
    }).toPromise();
  }


  getDirectionRoutes(payLoad): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/helper/getDrivingDirections.php?key" + this.api_key, {
      params: {
        latA: payLoad.spLat,
        lonA: payLoad.spLng,
        latB: payLoad.clientLat,
        lonB: payLoad.clientLng
      },
      responseType: "json"
    });
  }
  checkIfJobAssigned() {
    return {
      isAssigned: "yes"
    };
  }


  async getOTP(cellNumber: any): Promise<any> {
    let id = await this.storage.get("driverID")
    let hash = await this.smsRetriever.getAppHash()
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/getVerifyMobile.php", {
      params: {
        key: this.api_key,
        driverId: id,
        mobileNumber: cellNumber,
        hash: hash
      },
      observe: "response"
    }).toPromise()
  }

  async verifyOtp(otpNum: any): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/getVerifyOTP.php", {
      params: {
        key: this.api_key,
        driverId: id,
        OTP: otpNum,
      },
      observe: "response"
    }).toPromise()
  }

  async verifyVehicle(carReg: any): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/validateSpVehicle.php", {
      params: {
        key: this.api_key,
        driverId: id,
        registration: carReg
      },
      observe: "response"
    }).toPromise()
  }

  async viewNotifications(): Promise<any> {
    let id = await this.storage.get("driverID")
    return this._http.get(
      this.serverHost + "/rest/cca/v1/sp/notifications/getNotifications.php",
      {
        params: {
          key: this.api_key,
          driverId: id
        },
        observe: "response"
      }
    ).toPromise()
  }

  readNotification(notificationId: any): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/sp/notifications/setNotificationAsRead.php",
      {
        params: {
          key: this.api_key,
          id_notification: notificationId
        },
        observe: "response"
      }
    );
  }

  clearNotification(notificationId: any): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/sp/notifications/clearNotification.php",
      {
        params: {
          key: this.api_key,
          id_notification: notificationId
        },
        observe: "response"
      }
    );
  }



  async addDriver(claim): Promise<any> {
    claim = await this.claimManager.formatClaim(claim);

    let data = {
      // address: claim.address,
      call: claim.call,
      drivers: claim.drivers,
      callID: claim.callID
    };
    console.log(data)

    return this._http.post(this.serverHost + "/rest/cca/v1/calls/addDriver.php?key=" + this.api_key, JSON.stringify(data)).toPromise()
  }


  async addVehicle(claim): Promise<any> {
    claim = await this.claimManager.formatClaim(claim);

    let data = {
      // address: claim.address,
      call: claim.call,
      vehicle: claim.vehicle,
      callID: claim.callID
    };
    console.log(data)

    return this._http.post(this.serverHost + "/rest/cca/v1/client/vehicle/addUserVehicle.php?key=" + this.api_key, JSON.stringify(data)).toPromise()
  }

  /**
   * sends a Base64 string to decrypt and return information about the driveing license  
   * @param base64Lic 
   */
  async getSALicenseInfo(base64Lic: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
        //'Authorization': 'Basic '+ btoa('admin:supersecret')
      })
    };
    try {
      // let jsonReq={
      //   "key":AppConfig.ApiKey,
      //   "license":base64Lic
      // }
      //let r = this.parseResponse( await this.http.post<any>( this.apiUrl+ "/rest/client/verifyid/sadl/index.php",jsonReq).toPromise());
      // return r
      //  return this.http.get<any>(this.apiUrl+ "/rest/client/verifyid/sadl/index.php?licence="+base64Lic+"&key="+AppConfig.ApiKey).toPromise();
    } catch (e) {
      // return this.createStandardErrorMessage(e); 
    }
  }

}
