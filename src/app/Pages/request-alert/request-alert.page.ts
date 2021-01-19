import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController, ModalController, NavParams, Platform } from "@ionic/angular";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker, GoogleMapOptions, Circle, GoogleMapsEvent } from "@ionic-native/google-maps";
import { Storage } from "@ionic/storage";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { iServiceRequest, ServiceProviderDetails } from '../../models/appModels';

@Component({
  selector: "app-request-alert",
  templateUrl: "./request-alert.page.html",
  styleUrls: ["./request-alert.page.scss"]
})
export class RequestAlertPage implements OnInit {
  reqAccepted: boolean;
  serviceRequest: iServiceRequest = {
    status: false,
    data: {
      driverId: 0,
      serviceRequests: {
        callId: 0,
        callRef: 0,
        dateSent: {
          date: "0",
          timezone_type: 0,
          timezone: "0"
        },
        sub_sub_product_name: "",
        status: 0
      },
      driverVehicle: {
        vehicleId: "0",
        vehicleDescription: "0",
        vehicleRegistration: "0"
      },
      clientLocation: {
        latitude: 0,
        longitude: 0
      },
      finalDestination: {
        latitude: 0,
        longitude: 0,
        address: "Not yet available"
      },
      driverStatus: 0,
      client: {
        name : "",
        surname: "",
        number: ""
      }
    }

  };
  serviceProvider: ServiceProviderDetails = {};
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
  initialMapLoad: boolean = true;
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
  ) {
    this.reqAccepted = false;
    this.gotToTns = false;
  }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadingCtrl.create({
        message: "Please wait..."
      }).then(loader => {
        loader.present()
        this.reqAccepted = false;
        this.gotToTns = false;
        console.log("Initting")
        console.log(this.map2)
        this.initMap(params)
        loader.dismiss()
        this.serviceRequest.data.driverVehicle
      })
    })
  }

  initMap(params) {
    if (params) {
      this.serviceRequest = JSON.parse(params.serviceRequest);
      this.serviceProvider = JSON.parse(params.serviceProvider);

      console.log(this.serviceProvider)
      this.getDistance({
        latA: this.serviceProvider.location.coords.latitude,
        lonA: this.serviceProvider.location.coords.longitude,
        latB: this.serviceRequest.data.clientLocation.latitude,
        lonB: this.serviceRequest.data.clientLocation.longitude
      });
      this.getClientAddress();
    }
  }

  getClientAddress() {
    let icon = {
      url: this.helpers.clientIcon,
      size: {
        width: 40,
        height: 40
      }
    };
    this._api.getGeoCoding(this.serviceRequest.data.clientLocation.latitude, this.serviceRequest.data.clientLocation.longitude)
      .subscribe(res => {
        this.clientFullAddress = res.body.data.results[0].formatted_address;
      }, err => { console.log(err) });
  }

  getDistance(locationDetails) {
    this._api.getDistance(locationDetails)
      .then(res => {
        if (res) {
          this.distance = res.data.distance
          this.eta = res.data.time
        }
      }, err => {
        alert(JSON.stringify(err))
      });
  }

  async acceptRequest() {
    this.gotToTns = true;
    this.getCallTerms();
    this.helpers.stopSoundAlert();
  }
  getTermsState(evt: any) {
    this.termsState = evt;
  }

  continue() {
    if (this.termsState == true) {
      this._api.acceptJob(this.serviceProvider.driverId, this.serviceRequest.data.serviceRequests.callId, true, this.serviceRequest.data.serviceRequests.callRef).subscribe(apiResponse => {
        this.alertProvider.presentAlert(
          "Job Accepted",
          "Thank you for accepting this job. You will be notified if this job is allocated to you shortly"
        );    
        this.route.navigate(["app/tabs/tab1"]);
      })
    } else {
      this.cancelRequest();
    }
  }

  getCallTerms() {
    let params = {
      callRef: this.serviceRequest.data.serviceRequests.callId,
      driverId: this.serviceProvider.driverId
    }
    this._api.getCallTerms(params).subscribe(res => {
      if (res.status)
        this.tNc = res.data.termsAndConditions
    })
  }

  cancelRequest() {
    this.helpers.stopSoundAlert();
    this.reqAccepted = false;
    this.alertProvider.presentAlert(
      "Job Declined",
      "You have declined this job request. Stay online for more service requests."
    );
    this._api.acceptJob(this.serviceProvider.driverId, this.serviceRequest.data.serviceRequests.callId, false,  this.serviceRequest.data.serviceRequests.callRef).subscribe(response => {
      this.route.navigate(["app/tabs/tab1"]);
    })
  }
}
