import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController, ModalController, NavParams, Platform } from "@ionic/angular";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker, GoogleMapOptions, Circle, GoogleMapsEvent } from "@ionic-native/google-maps";
import { Storage } from "@ionic/storage";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { iServiceRequest } from '../../models/appModels';

@Component({
  selector: "app-request-alert",
  templateUrl: "./request-alert.page.html",
  styleUrls: ["./request-alert.page.scss"]
})
export class RequestAlertPage implements OnInit {
  reqAccepted: boolean;
  clientDetails: iServiceRequest = {
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
      finalDestination: "Unknown",
      driverStatus: 0,
      client: {}
    }

  };
  clientFullAddress: any;
  distance: any = 0;
  eta: any = "0";
  map2: GoogleMap;
  spDetials: any;
  spLocation: any;
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

  // ngOnInit(){

  // }

  // ngAfterViewInit(){


  // }


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
        // this.platform.ready().then(() => {
        //   console.log("Platform rady")
        //   this.map2 = GoogleMaps.create("map_canvass",{gestures: {
        //     rotate: false,
        //     tilt: false,
        //     scroll: false,
        //     zoom: false,
        //   }});
        //   this.map2.one(GoogleMapsEvent.MAP_READY).then(()=>{


        //   });        
        // });
      })
    })
  }

  initMap(params) {
    console.log(this.map2)
    console.log("Printing query parameters")
    console.log(params)
    if (params) {
      this.clientDetails = JSON.parse(params.clientDetails);
      this.clientDetails = this.clientDetails;
      this.spDetials = JSON.parse(params.spDetials);
      this.spLocation = JSON.parse(params.spLocation);
      this.vehicleDescription = this.clientDetails.data.driverVehicle.vehicleDescription
      this.vehicleRegistration = this.clientDetails.data.driverVehicle.vehicleRegistration
      if (this.clientDetails.data.finalDestination) {
        this.finalDest = this.clientDetails.data.finalDestination
      }

      // this.map2.animateCamera({
      //   target: {
      //     lat: this.clientDetails.data.clientLocation.latitude,
      //     lng: this.clientDetails.data.clientLocation.longitude
      //   },
      //   zoom: 12,
      //   duration: 1000
      // }).then(moved=>{
      //   console.log(moved)
      //   this.map2.addCircleSync({
      //     'center': {
      //       lat: this.clientDetails.data.clientLocation.latitude,
      //       lng: this.clientDetails.data.clientLocation.longitude
      //     },
      //     'radius': 3000,
      //     // 'strokeColor': '#AA00FF',
      //     'strokeWidth': 2,
      //     'fillColor': '#ffcccc'
      //   })
      // }).catch(err=>{
      //   console.log(err)
      // })
      this.getDistance({
        latA: this.spLocation.lat,
        lonA: this.spLocation.lng,
        latB: this.clientDetails.data.clientLocation.latitude,
        lonB: this.clientDetails.data.clientLocation.longitude
      });
      this.getClientAddress();
    }
  }

  // loadMap() {

  //   console.log("Maps loaded")
  // }

  getClientAddress() {
    let icon = {
      url: this.helpers.clientIcon,
      size: {
        width: 40,
        height: 40
      }
    };
    this._api.getGeoCoding(this.clientDetails.data.clientLocation.latitude, this.clientDetails.data.clientLocation.longitude)
      .subscribe(res => {
        this.clientFullAddress = res.body.data.results[0].formatted_address;
        // let marker: Marker = this.map.addMarkerSync({
        //   position: {
        //     lat: this.clientDetails.data.clientLocation.latitude,
        //     lng: this.clientDetails.data.clientLocation.longitude
        //   }
        // });
        // marker.showInfoWindow();
        // Add circle


      }, err => { console.log(err) });
  }

  getDistance(locationDetails) {
    console.log("Getting distance")
    this._api.getDistance(locationDetails)
      .then(res => {
        console
          .log("Getting ditance response")
        console.log(res)
        if (res) {
          console.log("Setting distance")
          this.distance = res.data.distance
          this.eta = res.data.time
        }
      }, err => {
        console.log(err)
        alert(JSON.stringify(err))
      });
  }

  async acceptRequest() {
    this.gotToTns = true;
    // if (this.map2)
    //   this.map2.remove();
    this.getCallTerms();
    this.helpers.stopSoundAlert();
  }
  getTermsState(evt: any) {
    this.termsState = evt;
  }

  continue() {
    if (this.termsState == true) {
      this.reqAccepted = true;
      this._api.acceptJob(this.spDetials.driverId, this.clientDetails.data.serviceRequests.callId, true).subscribe(apiResponse => {
        console.log(apiResponse.data.Allocated)
        if (apiResponse.data.Allocated == true) {
          console.log("JOb assigned")
          let response = {
            reqAccepted: apiResponse.data.Allocated,
            clientAddress: this.clientFullAddress,
            lat: this.clientDetails.data.clientLocation.latitude,
            lng: this.clientDetails.data.clientLocation.longitude,
            distance: this.distance,
            eta: this.eta,
            requestDate: this.clientDetails.data.serviceRequests.dateSent
          };
          console.log(response)
          this.storgae.set("clcrequestResponse", response).then(
            () => {
              this.route.navigate(["app/tabs/tab1"]);
            },
            err => {
              this.alertProvider.presentAlert(
                "Job Error",
                "Uhmm, something is not good!"
              );
              this.cancelRequest();
            }
          );
        } else {
          this.alertProvider.presentAlert(
            "Oops",
            "This job request has already been allocated."
          );
          this.cancelRequest();
        }
      })

    } else {

      this.alertProvider.presentAlert(
        "Job Declined",
        "You Have Declined A Job Request, We Will Place You As Available Again"
      );
      this.cancelRequest();
    }
  }

  getCallTerms() {
    let params = {
      callRef: this.clientDetails.data.serviceRequests.callId,
      driverId: this.spDetials.driverId
    }
    this._api.getCallTerms(params).subscribe(res => {
      if (res.status)
        this.tNc = res.data.termsAndConditions
    })
  }

  cancelRequest() {
    this.helpers.stopSoundAlert();
    this.reqAccepted = false;
    this.storgae.set("clcrequestResponse", { reqAccepted: this.reqAccepted }).then(
      () => {
        this._api.acceptJob(this.spDetials.driverId, this.clientDetails.data.serviceRequests.callId, false).subscribe(response => {
          console.log("Rejecting job")
          console.log(response)
          this.route.navigate(["app/tabs/tab1"]);
        })
      },
      err => {
        this.alertProvider.presentAlert(
          "Job Error",
          "Uhmm, something is not good!"
        );
        this.cancelRequest();
      }
    );


  }

  closemodal() {
    this.cancelRequest();
  }
}
