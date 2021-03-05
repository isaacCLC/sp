import { Component, ɵConsole, ViewChild, ElementRef } from "@angular/core";
import { Helpers } from "../../../Helpers/helpers";
import { ApiGateWayService } from "../../../Providers/api-gate-way.service";
import { GoogleMaps, GoogleMap, Marker, GoogleMapOptions, Environment, GoogleMapsEvent, LatLngBounds, Polyline, PolylineOptions, Poly, ILatLng} from "@ionic-native/google-maps";
import { Geolocation, Geoposition, PositionError } from "@ionic-native/geolocation/ngx";
import { TripDetails, ClientDetails, myLoc, iServiceRequest, iFinalDest, DriverDetails } from "../../../models/appModels";
import { Insomnia } from '@ionic-native/insomnia/ngx';
import {
  Platform, LoadingController, ModalController, NavController, AlertController
} from "@ionic/angular";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { interval, Subscriber, Observable, Subscription, throwError } from "rxjs";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { AlertsProviderService } from "../../../Providers/alerts-provider.service";
import { GeneralService } from "../../../Helpers/generals";
import { ActionSheetController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { ClaimCall, ClaimManager, ClaimTypeId, CurrentClaim } from "src/app/Helpers/claim-manager";
import { UserState } from "src/app/Helpers/user-state";
import { CommonUtils } from "src/app/Helpers/common-utils";
import { PopupHelper } from "src/app/Helpers/popup-helper";

declare var google;

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild('draggable') private startTowing: ElementRef;
  fdPolyline: any;
  path: ILatLng[];
  lastLocationUpdate: number = Date.now();
  lastMarkerUpdate: number = Date.now();
  cameraMoving: boolean = false;
  isToggled: boolean = false;
  isAvailable: boolean;
  counter: number = 0;
  statusChanged: boolean;
  serviceReq: iServiceRequest = {
    status: false,
    data: {
      driverId: 0,
      serviceRequests: {
        callId: 0,
        dateSent: {
          date: "",
          timezone_type: "",
          timezone: ""
        },
        status: 0,
        sub_sub_product_name: "",
        callRef: 0,
      },
      driverVehicle: {
        vehicleId: "",
        vehicleDescription: "",
        vehicleRegistration: ""
      },
      clientLocation: {
        latitude: 0,
        longitude: 0
      },
      finalDestination: {
        latitude: 0,
        longitude: 0,
        address: "Not yet Available"
      },
      driverStatus: 0,
      client: {
        name: "",
        surname: "",
        number: ""
      }
    }
  };
  navigatingToFD: boolean = false;
  checkingRequest: boolean;
  driverDetails: DriverDetails = {};
  firstTime: boolean;
  map: GoogleMap;
  loader: any;
  watchLocation: Subscription;
  requestCheck: any;
  btnArridedDisabled = true;
  isReqAccepted: boolean;
  navigationStarted: boolean;
  spArrived: boolean;
  mapBounds: any;
  checkAloc: any;
  isJobAllocaed: boolean = false;
  finalDestination: string;
  lastUpdate: Date;
  spCoordinatesPack: any = {
    latitude: 0,
    longitude: 0,
    driverId: 0,
    mobileNumber: 0
  };
  checkRadius: any
  DriverTarget: number
  driveFinDistTarget: number = null;
  startTow: boolean = false;
  _genServices: GeneralService;
  iscarSelected: boolean;

  tripDetails: TripDetails = {
    Distance: null,
    Eta: null,
    finalDestination: null,
    timeMinutesValue: -1
  };

  spMarker: Marker;
  stayActive: boolean;
  appPaused: boolean = false;
  awaitingFD: boolean;
  failedToSetLocationCounter: number;
  currentLocation = {
    latitude: 0,
    longitude: 0
  }
  locationUpdated

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private helpers: Helpers,
    private _api: ApiGateWayService,
    private modalCtrl: ModalController,
    private route: Router,
    private storage: Storage,
    private alertprovider: AlertsProviderService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private activateRoute: ActivatedRoute,
    private insomnia: Insomnia,
    public actionSheetController: ActionSheetController,
    private locationAccuracy: LocationAccuracy,
    private userState: UserState,
    private claimManager: ClaimManager,
    private popup: PopupHelper
  ) {
    this._genServices = new GeneralService();
    this.stayActive = false;

    platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        this.appPaused = true;
      });

      this.platform.resume.subscribe(() => {
        this.appPaused = false;
      });

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log("Location accuracy")
        console.log(canRequest)
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
            console.log('Request successful')
          }
          ).catch(error => {
            console.log('Error requesting location permissions', error)
            this.popup.showToast("You will not receive service requests unless you turn on you location.")
          })
        } else {
          throw "Cannot request users location"
        }

      });
    });
  }




  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.map = GoogleMaps.create("map_canvas");
      this.map.one(GoogleMapsEvent.MAP_READY).then(this.initLocation.bind(this));
      Environment.setBackgroundColor("white")
    });
  }

  initLocation() {
    this.helpers.setWatchLocation(this.geolocation
      .watchPosition({
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true,
      })
      .subscribe(location => {
        if ("coords" in location) {
          this.driverDetails.location = location;
          if (this.serviceReq.data.driverStatus == 1 && ((Date.now() - this.lastLocationUpdate) > 1000)) {
            this.lastLocationUpdate = Date.now();
            this._api.setSpLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              driverId: this.driverDetails.driverId,
              mobileNumber: this.driverDetails.driverContactNumber,
              // call_id: 0
              call_id: this.serviceReq.data.serviceRequests.callId
            }).then(
              setLocationResponse => {
                if (setLocationResponse.status == true && this.serviceReq.data.serviceRequests.status != 14) {
                  this.failedToSetLocationCounter = 0;
                  this.tripDetails.Eta = setLocationResponse.data.distance.time;
                  this.tripDetails.Distance = setLocationResponse.data.distance.distance
                  this.tripDetails.timeMinutesValue = setLocationResponse.data.distance.timeMinutesValue
                }
              },
              err => {
                this.failedToSetLocationCounter++;
                if (this.failedToSetLocationCounter > 10) {
                  // this.alertprovider.presentAlert(
                  //   "Oops",
                  //   "Connection Error",
                  //   "Could not set your location. Please check your internet connection."
                  // );
                  // this.isToggled = false;
                  // this.isAvailable = false;
                }
              }
            );
          }
          if (this.route.isActive('app/tabs/tab1', false) && this.serviceReq.data.driverStatus == 1 && this.map) {

            this.spMarker ? this.spMarker.isVisible() ? this.spMarker.setPosition({
              lat: location.coords.latitude,
              lng: location.coords.longitude
            }) : this.drawDriverMarker() : this.drawDriverMarker();

            if (!this.cameraMoving) {
              switch (this.serviceReq.data.serviceRequests.status) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                  this.cameraMoving = true;
                  this.map.animateCamera({
                    target: {
                      lat: location.coords.latitude,
                      lng: location.coords.longitude
                    },
                    zoom: 15,
                    duration: 500
                  }).finally(() => {
                    this.cameraMoving = false;
                  });
                  break;
                case 4:
                case 15:
                  this.cameraMoving = true;
                  this.map.animateCamera({
                    target: new LatLngBounds([
                      { lat: this.serviceReq.data.clientLocation.latitude, lng: this.serviceReq.data.clientLocation.longitude },
                      { lat: location.coords.latitude, lng: location.coords.longitude }
                    ]),
                    duration: 500,
                    zoom: 1
                  }).finally(() => {
                    this.cameraMoving = false;
                  })
                  break;
                case 13:
                case 16:
                  this.cameraMoving = true;
                  this.map.animateCamera({
                    target: [
                      { lat: this.serviceReq.data.finalDestination.latitude, lng: this.serviceReq.data.finalDestination.longitude },
                      { lat: location.coords.latitude, lng: this.driverDetails.location.coords.longitude }
                    ],
                    duration: 500,
                    zoom: 10
                  }).finally(() => {
                    this.cameraMoving = false;
                  })
                  console.log(this.fdPolyline)
                  let currentLoc = new google.maps.LatLng(location.coords.latitude,location.coords.longitude)
                  this.path?console.log(google.maps.geometry.poly.containsLocation(currentLoc, this.fdPolyline)):"";
              
                  break;
              }
            }

          }
        }
      }))
  }

  async ionViewWillEnter() {
    this.loadingCtrl.create({ "message": "Please wait" }).then(loader => {
      loader.present()
      this._api.getDriver().then(
        res => {
          let loc = this.driverDetails.location
          this.iscarSelected = res.data[0].driverVehicleId
          this.driverDetails = res.data[0];
          this.driverDetails.location = loc
          console.log(this.driverDetails)
          this.getRequests().then(() => {
            loader.dismiss()
            this.availableClick()
            if (!this.iscarSelected) {
              this.alertprovider.presentAlert(
                "Alert",
                "Select vehicle",
                "Please select a vehicle before going on duty!"
              );
            }
          })
          if (this.driverDetails.driverImageUrl == "")
            this.driverDetails.driverImageUrl = null;
        }
      ).catch(err => {
        console.log(err)
        loader.dismiss()
        this.alertprovider.presentAlert(
          "Oops..",
          "Error",
          "Something went wrong, please login and try again!"
        );
        // this.navCtrl.navigateBack(["/login"]);
      })
    })
  }

  async availableClick() {
    if (this.serviceReq.data.driverStatus && this.iscarSelected) {
      this._api.setDriveStatus(this._genServices.driveStatus.available)
      this.insomnia.keepAwake()

    } else {
      this._api.setDriveStatus(this._genServices.driveStatus.notAvailable)
      this.map.clear();
      this.insomnia.allowSleepAgain()

    }
  }


  selectVeh() {
    this.route.navigateByUrl("select-vehicle");
  }
  count: number = 0;


  async getRequests() {
    if (this.helpers.requestCheckClosed()) {
      console.log("Starting to check for locations")
      this.helpers.setRequestCheck(interval(5000).subscribe(() => {
        if (this.serviceReq.data.driverStatus == 1) {
          this.getRequests()
        }
      }))
    }
    return this._api.checkServiceRequests().then(serviceRequestResponse => {
      this.statusChanged = this.serviceReq.data.serviceRequests.status != serviceRequestResponse.data.serviceRequests.status
      this.serviceReq = serviceRequestResponse
      if (!this.checkingRequest) {
        switch (this.serviceReq.data.serviceRequests.status) {
          default:
            this.isJobAllocaed = false;
            this.navigatingToFD = false;
            this.serviceReq.data.serviceRequests = {
              callId: 0,
              dateSent: {
                date: "",
                timezone_type: "",
                timezone: ""
              },
              status: 0,
              sub_sub_product_name: "",
              callRef: 0,
            }
            this.tripDetails = {
              Distance: null,
              Eta: null,
              finalDestination: null,
              timeMinutesValue: -1
            };
            break;
          case 1:
          case 2:
            this.resetTripDetails();
            this.map.clear()
            this.route.isActive('app/tabs/tab1', false) && this.driverDetails.location ? this.checkRequest("reviewing") : "";
          case 3:
            break;
          case 4:
            this.statusChanged ? this.resetTripDetails() : "";
            this.statusChanged ? this.map.clear() : "";
            !this.isJobAllocaed && this.driverDetails.location ? this.allocateJob() : "";
            console.log(this.tripDetails.timeMinutesValue)
            this.tripDetails.timeMinutesValue > 0 && this.tripDetails.timeMinutesValue < 6 ? this.checkRequest("nearScene") : "";
            break;
          case 8:
            this.checkRequest("notAllocated");
            break;
          case 10:
            this.route.isActive('app/tabs/tab1', false) ? this.arrived() : "";
            this.navigatingToFD = false
            this.resetTripDetails();
            break;
          case 11:
            this.map.clear()
            this.resetTripDetails();
            this.navigatingToFD = false
            this.isJobAllocaed = false
            this.checkRequest("endTowResponse");
            break;
          case 13:
            this.navigatingToFD ? "" : this.resetTripDetails();
            !this.navigatingToFD && this.driverDetails.location ? this.map.clear().then(() => { this.navToFinalDest() }) : "";
            this.tripDetails.timeMinutesValue > 0 && this.tripDetails.timeMinutesValue < 6 ? this.checkRequest("nearFD") : "";
            break;
          case 14:
            this.resetTripDetails();
            this.statusChanged ? this.map.clear() : "";
            this.serviceReq.data.finalDestination.latitude ? this.checkRequest("startTow") : "";
            break;
          case 15:
            !this.isJobAllocaed && this.driverDetails.location ? this.allocateJob() : "";
            break;
          case 16:
            !this.navigatingToFD && this.driverDetails.location ? this.map.clear().then(() => { this.navToFinalDest() }) : "";
            break;
        }
      }
    })
  }

  resetTripDetails() {
    this.tripDetails = {
      Distance: null,
      Eta: null,
      finalDestination: null,
      timeMinutesValue: -1
    };
  }


  cloneAsObject(obj) {
    if (obj === null || !(obj instanceof Object)) {
      return obj;
    }
    var temp = (obj instanceof Array) ? [] : {};
    // ReSharper disable once MissingHasOwnPropertyInForeach
    for (var key in obj) {
      temp[key] = this.cloneAsObject(obj[key]);
    }
    return temp;
  }

  async checkRequest(acceptResponse) {
    console.log("Response")
    this._api.acceptJob(this.serviceReq.data.serviceRequests.callId, acceptResponse, this.serviceReq.data.serviceRequests.callRef).then(response => {
      this.checkingRequest = false;
      if (acceptResponse == "notAllocated") {
        this.alertprovider.presentAlert(
          "Oops",
          "Job REF #" + this.serviceReq.data.serviceRequests.callRef,
          "Unfortunately we could not allocate the job to you!"
        );
        if(this.route.isActive('request-alert', false)){
          this.route.navigate(['app/tabs/tab1']);
        }
      }
      if (acceptResponse == "reviewing") {
        this.route.navigate(["request-alert"], {
          queryParams: {
            serviceRequest: JSON.stringify(this.serviceReq),
            serviceProvider: JSON.stringify(this.cloneAsObject(this.driverDetails))
          }
        });
      }
    }, err => {
      this.checkingRequest = false;
      console.log(err)
    })
  }




  async navToFinalDest() {
    this.alertprovider.presentAlert(
      "JOB REF:#" + this.serviceReq.data.serviceRequests.callRef,
      "Final destination",
      "You may now drop of the vehicle at the final destination shown on the map."
    );
    this.navigatingToFD = true;
    let marker = this.map.addMarkerSync({
      position: {
        lat: this.serviceReq.data.finalDestination.latitude,
        lng: this.serviceReq.data.finalDestination.longitude
      },
      title: "Final Destination"
    })
    marker.showInfoWindow();
    this.addPolyLines(this.driverDetails.location.coords.latitude, this.driverDetails.location.coords.longitude, this.serviceReq.data.finalDestination.latitude, this.serviceReq.data.finalDestination.longitude);
  }

  async allocateJob() {
    this.checkRequest("allocated") 
    this.isJobAllocaed = true;
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

    let marker2 = this.map.addMarker({
      position: {
        lat: this.serviceReq.data.clientLocation.latitude,
        lng: this.serviceReq.data.clientLocation.longitude
      },
      title: "Scene Location",
      icon: {
        url: this.helpers.clientIcon,
        size: {
          width: 40,
          height: 40
        }
      }
    }).then(marker2 => {
      marker2.showInfoWindow()
    })


    this.addPolyLines(this.driverDetails.location.coords.latitude, this.driverDetails.location.coords.longitude, this.serviceReq.data.clientLocation.latitude, this.serviceReq.data.clientLocation.longitude);
  }

  addPolyLines(spLat: number, spLong: number, clientLat: number, clientLng: number) {
    let nRoutes;
    let directionsService = new google.maps.DirectionsService;
    let navPoints = [];
    let drivePlanCoordinates = null;
    directionsService.route({
      origin: { lat: spLat, lng: spLong },
      destination: { lat: clientLat, lng: clientLng }, //lat: -25.997911, lng: 28.133915   
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        nRoutes = response.routes[0].legs[0].steps;
      } else {
        this.alertprovider.presentAlert(
          "Opps..",
          "Error",
          "Couldn't Process Routes due to " + status
        );
      }

      for (let i: number = 0; i < nRoutes.length; i++) {
        for (let j: number = 0; j < nRoutes[i].lat_lngs.length; j++) {
          drivePlanCoordinates = {
            lat: nRoutes[i].lat_lngs[j].lat(),
            lng: nRoutes[i].lat_lngs[j].lng()
          };
          navPoints.push(drivePlanCoordinates);
          
        }
      }
      this.path = navPoints;
      this.fdPolyline = new google.maps.Polyline({
        points: navPoints,
        color: "#000000",
        width: 5,
        // geodesic: true
      })
      this.map.addPolyline(this.fdPolyline);

    });
  }


  distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  async canceljob() {
    this.alertController.create({
      header: "Confirm Cancellation",
      message: "Are you sure you want to cancel this job?",
      buttons: [
        {
          text: "Yes",
          cssClass: "secondary",
          handler: () => {
            this._api.acceptJob(this.serviceReq.data.serviceRequests.callId, "cancel", this.serviceReq.data.serviceRequests.callRef).then(() => {
              this.map.clear();
            })
          }
        },
        {
          text: "No",
        }
      ],
      backdropDismiss: false
    }).then(alert => {
      alert.present()
    })
  }

  async jobInfo() {
    if (this.serviceReq.data.serviceRequests.status == 3) {
      this.alertprovider.presentAlert(
        "REF #" + this.serviceReq.data.serviceRequests.callRef,
        "Please wait",
        "You will be notified if you are allocated this job"
      )
    } else {
      this.route.navigate(["job-info"], {
        queryParams: {
          jobInfo: JSON.stringify(this.cloneAsObject(this.serviceReq)),
          spDetails: JSON.stringify(this.cloneAsObject(this.driverDetails))
        }
      });
    }
  }

  async navigate() {
    let destination = []
    this.navigationStarted = true;
    if (this.navigatingToFD) {
      destination.push(this.serviceReq.data.finalDestination.latitude)
      destination.push(this.serviceReq.data.finalDestination.longitude)
    } else {
      destination.push(this.serviceReq.data.clientLocation.latitude);
      destination.push(this.serviceReq.data.clientLocation.longitude);
    }
    this.DriverTarget = 80;
    this.helpers.navigate(destination);
    this.checkRadius = interval(1000).subscribe(() => {
      this.DriverTarget = this.DriverTarget - 10;
      if (this.DriverTarget == 10) { this.checkRadius.unsubscribe() }
    })
  }


  arrivedFinDist() {
    this.route.navigate(["final-checklist"])
  }


  async arrived() {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this._api.acceptJob(this.serviceReq.data.serviceRequests.callId, "arrived", this.serviceReq.data.serviceRequests.callRef).then(response => {
        loader.dismiss();
        let claim = new CurrentClaim();
        claim.call = new ClaimCall();
        let id = this.serviceReq.data.serviceRequests.callId.toString();
        claim.call.callRef = this.serviceReq.data.serviceRequests.callRef.toString();
        this.claimManager.updateClaims(id, claim)
        this.claimManager.setClaimId(id)
        this.route.navigateByUrl("/motoraccident/step1");
      })
    })
  }

  async drawDriverMarker() {
    this.spMarker = this.map.addMarkerSync({
      title: "Current Location",
      position: {
        lat: this.driverDetails.location.coords.latitude,
        lng: this.driverDetails.location.coords.longitude,
      },
      animation: 'DROP',
      icon: {
        url: this.helpers.SPIcon,
        size: {
          width: 30,
          height: 50
        }
      }
    })
    this.spMarker.showInfoWindow();
  }
}
