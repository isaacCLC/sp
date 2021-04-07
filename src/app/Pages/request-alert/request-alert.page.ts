import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController, ModalController, NavParams, Platform } from "@ionic/angular";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker, GoogleMapOptions, Circle, GoogleMapsEvent } from "@ionic-native/google-maps";
import { Storage } from "@ionic/storage";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { DriverDetails, iServiceRequest } from '../../models/appModels';
import { StaticMapService } from "src/app/utils/static-map";
import { ServiceRequestsService } from "src/app/utils/service-requests.service";
import { AppLocation } from "src/app/utils/app-location";

@Component({
  selector: "app-request-alert",
  templateUrl: "./request-alert.page.html",
  styleUrls: ["./request-alert.page.scss"]
})
export class RequestAlertPage implements OnInit {
  reqAccepted: boolean;
  serviceProvider: DriverDetails;
  clientFullAddress: any;
  distance: any = 0;
  eta: any = "0";
  map2: GoogleMap;
  spDetials: any;
  termsState: boolean;
  tNc: string
  gotToTns: boolean;
  finalDest: string = '0';
  vehicleDescription: string;
  vehicleRegistration: string;

  staticMapsURL = "https://maps.googleapis.com/maps/api/staticmap?center=-25.881055,%2028.181996&zoom=13&size=640x640&maptype=roadmap&key=AIzaSyBo-0cSqDB1H3mAsfJEdnyhTu0vrBGXsy0"

  constructor(
    private _api: ApiGateWayService,
    private modalCtrl: ModalController,
    private storgae: Storage,
    private route: Router,
    private helpers: Helpers,
    private activatedRoute: ActivatedRoute,
    private alertProvider: AlertsProviderService,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public mapService: StaticMapService,
    public serviceRequestsService: ServiceRequestsService,
    public appLocation: AppLocation,
  ) {
    this.reqAccepted = false;
    this.gotToTns = false;
  }


  ngOnInit() {

  }

  ionViewWillEnter(){
    this.reqAccepted = false;
    this.gotToTns = false;
  }

  async acceptRequest() {
    this.gotToTns = true;
    this.getCallTerms();
    this.helpers.stopSoundAlert();
  }

  getTermsState(evt: any) {
    this.termsState = evt;
  }

  checkState(){
    console.log(this.termsState)
  }

  continue() {
    console.log(typeof this.termsState)
    if (this.termsState.toString() == 'true') {
      this._api.acceptJob(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, true, this.serviceRequestsService.serviceReq.data.serviceRequests.callRef).then(apiResponse => {
        if(apiResponse.data.Allocated){
          this.alertProvider.presentAlert(
            "JOB REF #"+this.serviceRequestsService.serviceReq.data.serviceRequests.callRef,
            "Job Accepted",
            "Thank you for accepting this job. You will be notified if this job is allocated to you shortly"
          );
        }else{
          this.alertProvider.presentAlert(
            "JOB REF #"+this.serviceRequestsService.serviceReq.data.serviceRequests.callRef,
            "Oops..",
            "This job has already been allocated"
          );
        }
            
        this.route.navigate(["app/tabs/tab1"]);
      })
    } else {
      this.cancelRequest();
    }
  }

  getCallTerms() {
    this._api.getCallTerms(this.serviceRequestsService.serviceReq.data.serviceRequests.callId).then(res => {
      if (res.status)
        this.tNc = res.data.termsAndConditions
    })
  }

  cancelRequest() {
    this.helpers.stopSoundAlert();
    this.reqAccepted = false;
    this.alertProvider.presentAlert(
      "Alert",
      "Job Declined",
      "You have declined this job request. Stay online for more service requests."
    );
    this._api.acceptJob(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, false,  this.serviceRequestsService.serviceReq.data.serviceRequests.callRef).then(response => {
      this.route.navigate(["app/tabs/tab1"]);
    })
  }
}
