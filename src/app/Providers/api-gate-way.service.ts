import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Helpers } from "../Helpers/helpers";
import { HttpHeaders } from "@angular/common/http";
import { AlertsProviderService } from './alerts-provider.service';
import { GeneralService } from '../Helpers/generals';
import { getJobHistory, iServiceRequest } from '../models/appModels';
import { ClaimManager } from "../Helpers/claim-manager";
import { AddClaimRequest } from "../Helpers/requests";
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
  constructor(private claimManager: ClaimManager, private _http: HttpClient, private helpers: Helpers, private alertProvider: AlertsProviderService) {

    this.prodHost = "https://api.lmsystem.co.za";
    this.devHost = "https://apidev.lmsystem.co.za";
    // this.localhost = "https://192.168.220.209"
    this.api_key = "15fc9b573b4eadda81d386689dfaff3a";
    this.serverHost = this.devHost;
  }


  validateLogIn(credentialObj: any): Observable<any> {
    try {
      return this._http.get(this.serverHost + "/rest/cca/v1/sp/getDriverLogin.php", {
        params: {
          key: this.api_key,
          appUsername: credentialObj.userName,
          appPassword: credentialObj.passWord,
          pushPlayerId: credentialObj.pushPlayerId
        }
      });
    } catch (error) {
      throw error;
    }
  }

  changePassword(payLoad: any): Observable<any> {
    try {
      return this._http.get(this.serverHost + "/rest/cca/v1/calls/addDriver.php", {
        params: {
          key: this.api_key,
          driverId: payLoad.driverId,
          driverPassword: payLoad.driverPassword
        }
      });

    } catch (error) {
      throw error
    }
  }

  acceptJob(driverId: any, callId, acceptJob, callRef): Observable<any> {
    try {
      return this._http.get(this.serverHost + "/rest/cca/v1/sp/acceptServiceRequest.php", {
        params: {
          key: this.api_key,
          driverId: driverId,
          callRef: callRef,
          acceptJob: acceptJob,
          callId: callId
        }
      });

    } catch (error) {
      throw error
    }
  }

  getSPDetails(driverID: any): Observable<any> {
    try {
      return this._http.get(this.serverHost + "/rest/cca/v1/calls/getDriver.php", {
        params: {
          key: this.api_key,
          driverId: driverID,
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // async addClaim(claim: any): Promise<any> {
  //   // Make sure datetime fields are correct format
  //   claim = await this.claimManager.formatClaim(claim);

  //   let tp = [];
  //   let prop = [];

  //   claim.thirdparty.forEach(x => {
  //     tp.push({ ...x, licenseImage: undefined, vehicleImage: undefined });
  //   });
  //   claim.property.forEach(x => {
  //     prop.push({ ...x, tyreImage: undefined, tyreThreadImage: undefined, rimImage: undefined });
  //   });

  //   let data = <AddClaimRequest>{
  //     address: claim.address,
  //     call: claim.call,
  //     claimant: claim.claimant,
  //     drivers: claim.drivers,
  //     passenger: claim.passenger,
  //     patient: claim.patient,
  //     property: prop,
  //     thirdparty: tp,
  //     vehicle: claim.vehicle,
  //     witness: claim.witness
  //   };

  //   try {
  //     let response = await this._http.get<any>(this.serverHost + "/rest/cca/v1/calls/addClaim.php?key="+this.api_key, {params: {
  //       address: claim.address,
  //       call: claim.call,
  //       claimant: claim.claimant,
  //       drivers: claim.drivers,
  //       passenger: claim.passenger,
  //       patient: claim.patient,
  //       property: prop,
  //       thirdparty: tp,
  //       vehicle: claim.vehicle,
  //       witness: claim.witness
  //     }}).toPromise();
  //     console.log("claim response")
  //     console.log(response)
  //     return response;
  //   }
  //   catch (e) {
  //     throw e;
  //   }
  // }

  getSpVehicleList(spID: any): Observable<any> {
    console.log(spID)

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
  completeJOB(spID): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/sp/addDriverJobComplete.php",
      {
        params: {
          driverId: spID,
          key: this.api_key
        },
        observe: "response"
      }
    );
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

  // checkServiceRequests(payLoad): Promise<any> { 
  //   try {
  //     let res = fetch(this.serverHost + "/rest/cca/v1/sp/checkServiceRequests.php?key=" +this.api_key, {
  //       method: 'post',
  //       body: JSON.stringify(payLoad)
  //     }) .then(response => response.json()).catch(err=>{
  //       this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"],this._generals.getGeneralError()["mainMessage"]  );}) 
  //     return res; 
  //   } catch (error) {
  //     this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"],this._generals.getGeneralError()["mainMessage"]  );
  //   } 
  // }
 checkServiceRequests(driverID): Observable<any> {
    try {
      //  https://apidev.lmsystem.co.za/rest/cca/v1/sp/checkServiceRequests.php?key=15fc9b573b4eadda81d386689dfaff3a&driverId=16
      return this._http.get(this.serverHost + "/rest/cca/v1/sp/checkServiceRequests.php", {
        params: {
          driverId: driverID,
          key: this.api_key
        }
      });
    } catch (error) {

    }

  } 

  ServiceRequestsResponse(payLoad): Observable<any> {
    try {
      //  https://apidev.lmsystem.co.za/rest/cca/v1/sp/checkServiceRequests.php?key=15fc9b573b4eadda81d386689dfaff3a&driverId=16
      return this._http.get(this.serverHost + "/rest/cca/v1/sp/checkServiceRequests.php", {
        params: {
          driverId: payLoad.driverId,
          key: this.api_key
        }
      });
    } catch (error) {

    }

  }

  addDiverNumber(payLoad): Promise<any> {
    console.log(payLoad)
    try {
      console.log(payLoad)
      let res = fetch(this.serverHost + "/rest/cca/v1/sp/addDriverMobile.php?key=" + this.api_key, {
        method: 'post',
        body: JSON.stringify(payLoad)
      }).then(response => response.json()).catch(err => {
        this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
      })
      return res;
    } catch (error) {
      this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
    }
  }

  getDriverlogout(payLoad): Promise<any> {
    try {
      console.log(payLoad)
      let res = fetch(this.serverHost + "/rest/cca/v1/sp/getDriverlogout.php?key=" + this.api_key, {
        method: 'post',
        body: JSON.stringify(payLoad)
      }).then(response => response.json()).catch(err => {
        this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
      })
      return res;
    } catch (error) {
      this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
    }
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
    try {
      let res = fetch(this.serverHost + "/rest/cca/v1/sp/getSPTerms.php?key=" + this.api_key, {
        method: 'post',
        body: JSON.stringify(payLoad)
      }).then(response => response.json()).catch(err => {
        this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
      })
      return res;
    } catch (error) {
      this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
    }

  }

  getCallTerms(payLoad): Observable<any> {
    try {
      return this._http.get(this.serverHost + "/rest/cca/v1/calls/getCallTerms.php", {
        params: {
          appUserId: payLoad.driverId,
          callRef: payLoad.callRef,
          key: this.api_key,
        }
      });
    } catch (error) {
      this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
    }

  }


  getJobHistory(payLoad): Promise<getJobHistory> {
    try {
      let res = fetch(this.serverHost + "/rest/cca/v1/sp/spGetJobHistory.php?key=" + this.api_key, {
        method: 'post',
        body: JSON.stringify(payLoad)
      }).then(response => response.json()).catch(err => {
        this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
      })
      return res;
    } catch (error) {
      this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
    }
  }



  getDistance(payLoad): Promise<any> {

    try {
      let res = fetch(this.serverHost + "/rest/cca/v1/helper/getLocationDistTime.php?key=" + this.api_key, {
        method: 'post',
        body: JSON.stringify(payLoad)
      }).then(response => response.json()).catch(err => {
        this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
      })
      return res;
    } catch (error) {
      this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"], this._generals.getGeneralError()["mainMessage"]);
    }
  }

  setSpLocation(coordinates: any): Observable<any> {

    return this._http.get(this.serverHost + "/rest/cca/v1/sp/setDriverLocation.php", {
      params: {
        driverId: coordinates.driverId,
        key: this.api_key,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        mobileNumber: coordinates.mobileNumber,
        call_id: coordinates.call_id
      }
    });
  }

  setDriveStatus(driverID: any, diverStatus: any): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/calls/addDriver.php", {
      params: {
        driverId: driverID,
        key: this.api_key,
        driverStatus: diverStatus
      }
    });
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


  getOTP(spId: any, cellNumber: any): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/getVerifyMobile.php", {
      params: {
        key: this.api_key,
        driverId: spId,
        mobileNumber: cellNumber
      },
      observe: "response"
    });
  }

  verifyOtp(spId: any, otpNum: any): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/getVerifyOTP.php", {
      params: {
        key: this.api_key,
        driverId: spId,
        OTP: otpNum
      },
      observe: "response"
    });
  }

  verifyVehicle(driverId: any, carReg: any): Observable<any> {
    return this._http.get(this.serverHost + "/rest/cca/v1/sp/validateSpVehicle.php", {
      params: {
        key: this.api_key,
        driverId: driverId,
        registration: carReg
      },
      observe: "response"
    });
  }

  viewNotifications(driverId: any): Observable<any> {
    return this._http.get(
      this.serverHost + "/rest/cca/v1/sp/notifications/getNotifications.php",
      {
        params: {
          key: this.api_key,
          driverId: driverId
        },
        observe: "response"
      }
    );
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
}

// export class CurrentClaim implements AddClaimRequest {

//   constructor() {
//     this.call = new ClaimCall();
//     this.passenger = [];
//     this.witness = [];
//     this.property = [];
//     this.thirdparty = [];
//     this.vehicle = [];
//     this.address = [];
//     this.isThirdParty = false;
//     this.completed = [];
//     this.claimant = [];
//     this.patient = [];
//     this.drivers = [];
//     this.images = new ClaimImages();
//   }
//   claimName: string = '';
//   lastUpdated: string = '';
//   call: ClaimCall;
//   passenger: ClaimPassenger[] = [];
//   witness: ClaimWitness[] = [];
//   property: ClaimProperty[] = [];
//   thirdparty: ClaimThirdparty[] = [];
//   vehicle: ClaimVehicle[];
//   address: ClaimAddress[] = [];
//   isThirdParty: boolean;
//   completed: number[] = [];
//   claimant: ClaimClaimant[];
//   patient: ClaimPatient[];
//   drivers: ClaimDriver[];
//   images: ClaimImages;
// }

