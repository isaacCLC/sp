import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Helpers } from '../helpers/helpers';
import { UserState } from '../helpers/user-state';
import { iServiceRequest, TripDetails } from '../models/appModels';
import { AlertsProviderService } from '../providers/alerts-provider.service';
import { ApiGateWayService } from '../providers/api-gate-way.service';
import { AppLocation } from './app-location';
import { ClaimCall, ClaimManager, ClaimTypeId, CurrentClaim } from "src/app/helpers/claim-manager";
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { StaticMapService } from './static-map';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

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
    private backgroundGeolocation: BackgroundGeolocation
  ) {



    platform.ready().then(() => {
      // setup a timer check for service requests every 5 seconds
      this.getServiceRequest()
      window.setInterval(() => {
        !this.checkingRequest ? this.getServiceRequest() : "";
      }, 10000);

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
        if (serviceRequestResponse) {
          this.appLocation.updateStatus()
          this.appLocation.serviceReq = serviceRequestResponse
          this.serviceReq = serviceRequestResponse
          if (this.serviceReq.data.driverStatus) {
            this.insomnia.keepAwake()
          } else {
            this.insomnia.allowSleepAgain()
          }
          this.backgroundGeolocation.configure({
            notificationTitle: serviceRequestResponse.data.serviceRequests.status ? this.serviceReq.data.serviceRequests.statusDescription : "Available",
            notificationText: serviceRequestResponse.data.serviceRequests.status ? "Click to view job." : "We will alert you when you recieve a service request."
          })
          switch (serviceRequestResponse.data.serviceRequests.status) {
            case 1:
              this.checkRequest("reviewing");
              this.route.navigate(["request-alert"]);
              this.mapService.getStaticMapBase64(Number(serviceRequestResponse.data.clientLocation.latitude), Number(serviceRequestResponse.data.clientLocation.longitude), '5', 12).then(pic => {
                this.staticMapsURL = pic
                this.mapService.currenLocLat = serviceRequestResponse.data.clientLocation.latitude
                this.mapService.currenLocLng = serviceRequestResponse.data.clientLocation.longitude
              })
              break;
            case 2:
              if (!this.route.isActive("/request-alert", false)) {
                this.route.navigate(["request-alert"]);
              }
              if (this.mapService.currenLocLat != serviceRequestResponse.data.clientLocation.latitude && this.mapService.currenLocLng != serviceRequestResponse.data.clientLocation.longitude) {
                this.mapService.getStaticMapBase64(Number(serviceRequestResponse.data.clientLocation.latitude), Number(serviceRequestResponse.data.clientLocation.longitude), '5', 12).then(pic => {
                  this.staticMapsURL = pic
                  this.mapService.currenLocLat = serviceRequestResponse.data.clientLocation.latitude
                  this.mapService.currenLocLng = serviceRequestResponse.data.clientLocation.longitude
                })
              }
              this.backgroundGeolocation.configure({
                notificationText: "You have a new service request"
              })
              break;
            case 3:
              this.backgroundGeolocation.configure({
                notificationText: "You will be notified if this job is allocated to you."
              })
              break;
            case 17:
              this.checkRequest("allocated");
              if (this.appPaused) {
                this.helpers.allocationPush(
                  "Congragulations!! The job has been allocated to you"
                );
              } else {
                this.alertprovider.presentAlert(
                  "Congragulations",
                  "Job Allocation",
                  "The job has been allocated to you."
                );
              }
              this.backgroundGeolocation.configure({
                notificationText: "The job has been allocated to you"
              })
              break;
            case 4:
              this.appLocation.tripDetails && this.appLocation.tripDetails.timeMinutesValue < 6 ? this.checkRequest("nearScene") : "";
              this.backgroundGeolocation.configure({
                notificationText: "Dont forget to take details of the scene when you arive"
              })
              break;
            case 8:
              this.checkRequest("notAllocated");
              this.alertprovider.presentAlert(
                "Oops",
                "Job REF #" + this.serviceReq.data.serviceRequests.callRef,
                "Unfortunately we could not allocate the job to you!"
              );
              this.backgroundGeolocation.configure({
                notificationText: "Unfortunately we could not allocate the job to you!"
              })
              if (this.route.isActive('request-alert', false)) {
                this.route.navigate(['app/tabs/tab1']);
              }
              break;
            case 10:
              if (!this.route.isActive("/motoraccident", false)) {
                this.route.navigateByUrl("/motoraccident/step1");
              }
              this.backgroundGeolocation.configure({
                notificationText: "Please capture the accident scene!"
              })
              break;
            case 11:
              this.backgroundGeolocation.configure({
                notificationText: "Thank you for completing job: #" + this.serviceReq.data.serviceRequests.callRef
              })
              this.checkRequest("endTowResponse");
              break;
            case 13:
              if (this.timeGotFD && ((Date.now() - this.timeGotFD) > 30000)) {
                this.appLocation.tripDetails && this.appLocation.tripDetails.timeMinutesValue < 6 ? this.checkRequest("nearFD") : "";
              }
              this.backgroundGeolocation.configure({
                notificationText: "You are near the final destination. Dont forget to take a photo of the towing slip"
              })
              break;
            case 14:
              this.backgroundGeolocation.configure({
                notificationText: "We will alert you once the final destination is confirmed. Please do not take the car elsewhere"
              })
              this.serviceReq.data.finalDestination.latitude ? this.checkRequest("startTow") : "";
              break;
          }
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
      .finally(() => {
        this.checkingRequest = false;
        this.getServiceRequest()
      })
  }
}
