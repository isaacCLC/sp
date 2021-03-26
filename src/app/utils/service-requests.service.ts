import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Helpers } from '../Helpers/helpers';
import { UserState } from '../Helpers/user-state';
import { iServiceRequest, TripDetails } from '../models/appModels';
import { AlertsProviderService } from '../Providers/alerts-provider.service';
import { ApiGateWayService } from '../Providers/api-gate-way.service';
import { AppLocation } from './app-location';
import { ClaimCall, ClaimManager, ClaimTypeId, CurrentClaim } from "src/app/Helpers/claim-manager";
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { StaticMapService } from './static-map';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {
  serviceReq: iServiceRequest;
  checkingRequest: Boolean;
  allocated: Boolean;
  appPaused: boolean;
  tripDetails: TripDetails;
  staticMapsURL = "https://maps.googleapis.com/maps/api/staticmap?center=-25.881055,%2028.181996&zoom=13&size=640x640&maptype=roadmap&key=AIzaSyBo-0cSqDB1H3mAsfJEdnyhTu0vrBGXsy0";
  staticMap;
  timeGotFD;
  public _currenServiceRequest: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: Router,
    private userState: UserState,
    private _api: ApiGateWayService,
    private alertprovider: AlertsProviderService,
    private appLocation: AppLocation,
    private helpers: Helpers,
    public loadingCtrl: LoadingController,
    private claimManager: ClaimManager,
    private platform: Platform,
    private insomnia: Insomnia,
    public mapService: StaticMapService,
  ) {

    // setup a timer check for service requests every 5 seconds
    window.setInterval(() => {
      !this.checkingRequest ? this.getServiceRequest() : "";
    }, 5000);

    platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        this.appPaused = true;
      });

      this.platform.resume.subscribe(() => {
        this.appPaused = false;
      });

    });
  }

  private getServiceRequest() {
    this.checkingRequest = true;
    this._api.checkServiceRequests()
      .then(serviceRequestResponse => {
        this.appLocation.serviceReq = serviceRequestResponse
        this.serviceReq = serviceRequestResponse
        if (this.serviceReq.data.driverStatus) {
          this.insomnia.keepAwake()
        } else {
          this.insomnia.allowSleepAgain()
        }
        switch (serviceRequestResponse.data.serviceRequests.status) {
          case 1:
          case 2:
            if (!this.route.isActive("/request-alert", false)) {
              this.checkRequest("reviewing");
              this.route.navigate(["request-alert"]);
            }
            if(this.mapService.currenLocLat != serviceRequestResponse.data.clientLocation.latitude && this.mapService.currenLocLng != serviceRequestResponse.data.clientLocation.longitude){
              console.log("Updating map")
              this.mapService.getStaticMapBase64(Number(serviceRequestResponse.data.clientLocation.latitude), Number(serviceRequestResponse.data.clientLocation.longitude), '5', 12).then(pic=>{
                this.staticMapsURL = pic
                this.mapService.currenLocLat = serviceRequestResponse.data.clientLocation.latitude
                this.mapService.currenLocLng = serviceRequestResponse.data.clientLocation.longitude
              })
            }
            break;
          case 17:
            this.checkRequest("allocated");
            if (this.appPaused) {
              this.helpers.allocationPush(
                "Congragulations!! The job has been allocated to you."
              );
            } else {
              this.alertprovider.presentAlert(
                "Congragulations",
                "Job Allocation",
                "The job has been allocated to you."
              );
            }
            break;
          case 4:
            this.appLocation.tripDetails && this.appLocation.tripDetails.timeMinutesValue < 6 ? this.checkRequest("nearScene") : "";              
            break;
          case 8:
            this.checkRequest("notAllocated");
            this.alertprovider.presentAlert(
              "Oops",
              "Job REF #" + this.serviceReq.data.serviceRequests.callRef,
              "Unfortunately we could not allocate the job to you!"
            );
            if (this.route.isActive('request-alert', false)) {
              this.route.navigate(['app/tabs/tab1']);
            }
            break;
          case 10:
            if (!this.route.isActive("/motoraccident", false)) {
              this.route.navigateByUrl("/motoraccident/step1");
            }
            break;
          case 11:
            this.checkRequest("endTowResponse");
            break;
          case 13:
            if(this.timeGotFD && ((Date.now()-this.timeGotFD)>30000)){
              this.appLocation.tripDetails && this.appLocation.tripDetails.timeMinutesValue < 6 ? this.checkRequest("nearFD") : "";
            }
            break;
          case 14:
            this.serviceReq.data.finalDestination.latitude ? this.checkRequest("startTow") : "";
            break;
        }
      }).finally(() => {
        this.checkingRequest = false;
      }).catch(err => {
        console.log(err)
        throw err;
      })
  }

  async checkRequest(acceptResponse) {
    this.checkingRequest = true;
    this._api.acceptJob(this.serviceReq.data.serviceRequests.callId, acceptResponse, this.serviceReq.data.serviceRequests.callRef)
    .finally(()=>{
      this.checkingRequest = false;
    })
  }
}
