import { Component, ɵConsole, ViewChild, ElementRef } from "@angular/core";
import { Helpers } from "../../../helpers/helpers";
import { ApiGateWayService } from "../../../providers/api-gate-way.service";
import { GoogleMaps, GoogleMap, Marker, GoogleMapOptions, Environment, GoogleMapsEvent, LatLngBounds, Polyline, PolylineOptions, Poly, ILatLng, Spherical } from "@ionic-native/google-maps";
import { Geolocation, Geoposition, PositionError } from "@ionic-native/geolocation/ngx";
import { TripDetails, ClientDetails, myLoc, iServiceRequest, iFinalDest, DriverDetails } from "../../../models/appModels";
import {
  Platform, LoadingController, ModalController, NavController, AlertController
} from "@ionic/angular";
import { interval, Subscriber, Observable, Subscription, throwError } from "rxjs";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { AlertsProviderService } from "../../../providers/alerts-provider.service";
import { GeneralService } from "../../../helpers/generals";
import { ActionSheetController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { ClaimCall, ClaimManager, ClaimTypeId, CurrentClaim } from "src/app/helpers/claim-manager";
import { UserState } from "src/app/helpers/user-state";
import { PopupHelper } from "src/app/helpers/popup-helper";
import { ServiceRequestsService } from "src/app/utils/service-requests.service";
import { AppLocation } from "src/app/utils/app-location";
import { ChatService } from "src/app/helpers/chat.service";

declare var google;

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild('draggable') private startTowing: ElementRef;
  fdPolyline: Polyline;
  scenePolyline: Polyline;

  path: ILatLng[];
  lastLocationUpdate: number = Date.now();
  lastMarkerUpdate: number = Date.now();
  cameraMoving: boolean = false;
  isToggled: boolean = false;
  isAvailable: boolean;
  counter: number = 0;
  statusChanged: boolean;
  newMessage: string = 'await-btn2';
  navigatingToFD: boolean = false;
  checkingRequest: boolean;
  driverDetails: DriverDetails;
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


  spMarker: Marker;
  sceneMarker: Marker;
  fdMarker: Marker;

  stayActive: boolean;
  appPaused: boolean = false;
  awaitingFD: boolean;
  failedToSetLocationCounter: number;
  currentLocation = {
    latitude: 0,
    longitude: 0
  }
  locationUpdated
  bounds: LatLngBounds;
  points: any[] = [];
  backLocations: [];
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
    public actionSheetController: ActionSheetController,
    private locationAccuracy: LocationAccuracy,
    private userState: UserState,
    private claimManager: ClaimManager,
    private popup: PopupHelper,
    public serviceRequestsService: ServiceRequestsService,
    public appLocation: AppLocation,
    private chatService: ChatService
  ) {
    this._genServices = new GeneralService();
    this.stayActive = false;



  }




  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.map = GoogleMaps.create("map_canvas");
      this.map.one(GoogleMapsEvent.MAP_READY).then(this.initLocation.bind(this));
      Environment.setBackgroundColor("red")
    });
  }

  initLocation() {
    this.appLocation.locationUpdated.subscribe(location => {
      if (this.serviceRequestsService.serviceReq) {
        if (this.route.isActive('app/tabs/tab1', false) && this.serviceRequestsService.serviceReq.data.driverStatus == 1 && this.map) {

          this.spMarker ? this.spMarker.isVisible() ? this.spMarker.setPosition({
            lat: location.latitude,
            lng: location.longitude
          }) : this.drawDriverMarker() : this.drawDriverMarker();

          if (!this.cameraMoving) {
            switch (this.serviceRequestsService.serviceReq.data.serviceRequests.status) {
              default:
              case 0:
              case 1:
              case 2:
              case 3:
              case 5:
              case 6:
              case 7:
              case 8:
              case 9:
                this.fdPolyline?this.fdPolyline.remove():"";
                this.fdPolyline?this.fdPolyline = null:"";
                this.sceneMarker?this.sceneMarker.remove():"";
                this.sceneMarker?this.sceneMarker = null:"";
                this.scenePolyline?this.scenePolyline.remove():"";
                this.scenePolyline?this.scenePolyline = null:"";
                this.fdMarker?this.fdMarker.remove():"";
                this.fdMarker?this.fdMarker = null:"";

                this.cameraMoving = true;
                this.map.animateCamera({
                  target: {
                    lat: location.latitude,
                    lng: location.longitude
                  },
                  zoom: 15,
                  duration: 500
                }).finally(() => {
                  this.cameraMoving = false;
                });
                break;
              case 4:
              case 15:
                this.scenePolyline?"":this.addPolyLines(
                  this.appLocation.LastKnownLatitude,
                  this.appLocation.LastKnownLongitude,
                  this.serviceRequestsService.serviceReq.data.clientLocation.latitude,
                  this.serviceRequestsService.serviceReq.data.clientLocation.longitude
                  , "scene"
                );
                this.sceneMarker?"":this.drawSceneMarker();
                if(this.fdPolyline){
                  this.fdPolyline.destroy();
                  this.fdPolyline = null;
                }
                this.cameraMoving = true;
                let bounds = new LatLngBounds([
                  { lat: this.serviceRequestsService.serviceReq.data.clientLocation.latitude, lng: this.serviceRequestsService.serviceReq.data.clientLocation.longitude },
                  { lat: location.latitude, lng: location.longitude }])
                this.map.animateCamera({
                  target: new LatLngBounds([
                    {lat:bounds.northeast.lat ,lng: bounds.northeast.lng},
                    {lat:bounds.southwest.lat ,lng: bounds.southwest.lng}
                  ]),
                  duration: 500,
                  zoom: 1
                }).finally(() => {
                    this.cameraMoving = false;
                })
                break;
              case 13:
              case 16:
                this.fdPolyline?"":this.addPolyLines(this.appLocation.LastKnownLatitude,
                  this.appLocation.LastKnownLongitude,
                  this.serviceRequestsService.serviceReq.data.finalDestination.latitude,
                  this.serviceRequestsService.serviceReq.data.finalDestination.longitude, "fd");
                this.fdMarker?"":this.drawFDMarker();
                if(this.scenePolyline){
                  this.scenePolyline.destroy();
                  this.scenePolyline = null;
                }
                this.cameraMoving = true;

                this.map.animateCamera({
                  target: new LatLngBounds([{ lat: this.serviceRequestsService.serviceReq.data.finalDestination.latitude, lng: this.serviceRequestsService.serviceReq.data.finalDestination.longitude },
                    { lat: location.latitude, lng: location.longitude }]),
                  duration: 500,
                  zoom: 15
                }).finally(() => {
                    this.cameraMoving = false;
                })
                break;
            }
          }

        }
      }
    })
  }

  async arrived() {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this._api.acceptJob(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, "arrived", this.serviceRequestsService.serviceReq.data.serviceRequests.callRef).then(response => {
        loader.dismiss();
        let claim = new CurrentClaim();
        claim.call = new ClaimCall();
        let id = this.serviceRequestsService.serviceReq.data.serviceRequests.callId.toString();
        claim.call.callRef = this.serviceRequestsService.serviceReq.data.serviceRequests.callRef.toString();
        this.claimManager.updateClaims(id, claim)
        this.claimManager.setClaimId(id)
        this.route.navigateByUrl("/motoraccident/step1");
      })
    })
  }

  getExtendedBounds(map, overlay) {
    //With _mapBoundsEnlargePixels we add some extra space surrounding the map
    //change this value until you get the desired size
    var _mapBoundsEnlargePixels = 500;

    var projection = overlay.getProjection();
    var bounds = map.getBounds();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
        bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
        bounds.getSouthWest().lng());

    // Convert the points to pixels and extend out
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x = trPix.x + _mapBoundsEnlargePixels;
    trPix.y = trPix.y - _mapBoundsEnlargePixels;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x = blPix.x - _mapBoundsEnlargePixels;
    blPix.y = blPix.y + _mapBoundsEnlargePixels;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
}

  async ionViewWillEnter() {
    this.loadingCtrl.create({ "message": "Please wait" }).then(loader => {
      loader.present()
      this._api.getDriver().then(
        res => {
          this.driverDetails = res.data[0];
          loader.dismiss()
          if (!this.driverDetails.driverVehicle) {
            this._api.setDriveStatus(0)
            this.alertprovider.presentAlert(
              "Alert",
              "Select vehicle",
              "Please select a vehicle before going on duty!"
            );
          }
        }
      )
    })
  }

  async availableClick() {
    this._api.setDriveStatus(this.serviceRequestsService.serviceReq.data.driverStatus ? 1 : 0)
  }



  selectVeh() {
    this.route.navigateByUrl("select-vehicle");
  }
  count: number = 0;

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
    this._api.acceptJob(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, acceptResponse, this.serviceRequestsService.serviceReq.data.serviceRequests.callRef).then(response => {
      this.checkingRequest = false;
      if (acceptResponse == "notAllocated") {
        this.alertprovider.presentAlert(
          "Oops",
          "Job REF #" + this.serviceRequestsService.serviceReq.data.serviceRequests.callRef,
          "Unfortunately we could not allocate the job to you!"
        );
        if (this.route.isActive('request-alert', false)) {
          this.route.navigate(['app/tabs/tab1']);
        }
      }
      if (acceptResponse == "reviewing") {
        this.route.navigate(["request-alert"], {
          queryParams: {
            serviceRequest: JSON.stringify(this.serviceRequestsService.serviceReq),
            serviceProvider: JSON.stringify(this.cloneAsObject(this.driverDetails))
          }
        });
      }
    }, err => {
      this.checkingRequest = false;
      console.log(err)
    })
  }




  async drawFDMarker() {
    this.serviceRequestsService.timeGotFD = Date.now()
    this.alertprovider.presentAlert(
      "JOB REF:#" + this.serviceRequestsService.serviceReq.data.serviceRequests.callRef,
      "Final destination",
      "You may now drop of the vehicle at the final destination shown on the map."
    );
    this.fdMarker = this.map.addMarkerSync({
      position: {
        lat: this.serviceRequestsService.serviceReq.data.finalDestination.latitude,
        lng: this.serviceRequestsService.serviceReq.data.finalDestination.longitude
      },
      title: "Final Destination"
    })
    this.fdMarker.showInfoWindow();
  }

  async drawDriverMarker() {
    this.spMarker = this.map.addMarkerSync({
      title: "Current Location",
      position: {
        lat: this.appLocation.LastKnownLatitude,
        lng: this.appLocation.LastKnownLongitude,
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

  async drawSceneMarker() {
    this.sceneMarker = this.map.addMarkerSync({
      position: {
        lat: this.serviceRequestsService.serviceReq.data.clientLocation.latitude,
        lng: this.serviceRequestsService.serviceReq.data.clientLocation.longitude
      },
      title: "Scene Location",
      icon: {
        url: this.helpers.clientIcon,
        size: {
          width: 40,
          height: 40
        }
      }
    })
    this.sceneMarker.showInfoWindow();
  }

  addPolyLines(spLat: number, spLong: number, clientLat: number, clientLng: number, type: string) {
    let nRoutes;
    let directionsService = new google.maps.DirectionsService;
    let navPoints = [];
    let drivePlanCoordinates = null;
    directionsService.route({
      origin: { lat: Number(spLat), lng: Number(spLong) },
      destination: { lat: Number(clientLat), lng: Number(clientLng) }, //lat: -25.997911, lng: 28.133915   
      travelMode: "DRIVING"
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
      this.points = navPoints;
      if (type == "scene") {
        this.scenePolyline = this.map.addPolylineSync({
          points: navPoints,
          color: "#000000",
          width: 5,
        })
      } else {
        this.fdPolyline = this.map.addPolylineSync({
          points: navPoints,
          color: "#000000",
          width: 5,
        })
      }

    }, err=>{
      console.log(err)
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

  async alert(message){

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
            this._api.acceptJob(this.serviceRequestsService.serviceReq.data.serviceRequests.callId, "cancel", this.serviceRequestsService.serviceReq.data.serviceRequests.callRef).then(() => {
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
    if (this.serviceRequestsService.serviceReq.data.serviceRequests.status == 3) {
      this.alertprovider.presentAlert(
        "REF #" + this.serviceRequestsService.serviceReq.data.serviceRequests.callRef,
        "Please wait",
        "You will be notified if you are allocated this job"
      )
    } else {
      this.route.navigate(["job-info"]);
    }
  }

  async navigate() {
    let destination = []
    this.navigationStarted = true;
    if ([13, 16].includes(this.serviceRequestsService.serviceReq.data.serviceRequests.status)) {
      destination.push(this.serviceRequestsService.serviceReq.data.finalDestination.latitude)
      destination.push(this.serviceRequestsService.serviceReq.data.finalDestination.longitude)
    } else {
      destination.push(this.serviceRequestsService.serviceReq.data.clientLocation.latitude);
      destination.push(this.serviceRequestsService.serviceReq.data.clientLocation.longitude);
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


}
