import { Component, ɵConsole, ViewChild, ElementRef } from "@angular/core";
import { Helpers } from "../../../Helpers/helpers";
import { ApiGateWayService } from "../../../Providers/api-gate-way.service";
import { GoogleMaps, GoogleMap, Marker, GoogleMapOptions, Environment, GoogleMapsEvent } from "@ionic-native/google-maps";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { ServiceProviderDetails, TripDetails, ClientDetails, myLoc, iServiceRequest, iFinalDest } from "../../../models/appModels";
import { Insomnia } from '@ionic-native/insomnia/ngx';
import {
  Platform, LoadingController, ModalController, NavController, AlertController
} from "@ionic/angular";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { interval, Subscriber, Observable } from "rxjs";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { AlertsProviderService } from "../../../Providers/alerts-provider.service";
import { GeneralService } from "../../../Helpers/generals";
import { ActionSheetController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { CurrentClaim } from "src/app/Helpers/claim-manager";

declare var google;

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild('draggable') private startTowing: ElementRef;
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
  spDetails: ServiceProviderDetails = {};
  firstTime: boolean;
  map: GoogleMap;
  loader: any;
  watchLocation: any;
  requestCheck: any;
  btnArridedDisabled = true;
  isReqAccepted: boolean;
  navigationStarted: boolean;
  spArrived: boolean;
  mapBounds: any;
  checkAloc: any;
  isJobAllocaed: boolean = false;
  finalDestination: string;
  spCoordinatesPack: any = {
    latitude: 0,
    longitude: 0,
    driverId: 0,
    mobileNumber: 0
  };
  checkRadius: any
  clientDriverTarget: number
  driveFinDistTarget: number = null;
  startTow: boolean = false;
  _genServices: GeneralService;
  iscarSelected: boolean;
  isInternetAvailable: boolean;

  tripDetails: TripDetails = {
    Distance: null,
    Eta: null,
    finalDestination: null
  };
  // clientDetails: ClientDetails = {};
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
    private locationAccuracy: LocationAccuracy
  ) {
    this._genServices = new GeneralService();
    this.stayActive = false;
    this.watchLocation = new Observable();

    platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        this.appPaused = true;
      });

      this.platform.resume.subscribe(() => {
        this.appPaused = false;
      });

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }

      });
    });
  }




  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.map = GoogleMaps.create("map_canvas");
      this.map.one(GoogleMapsEvent.MAP_READY).then(this.initMap.bind(this));
      Environment.setBackgroundColor("white")
    });
  }

  openAlert() {

  }

  initMap() {
    this.loadingCtrl.create({ "message": "Please wait" }).then(loader => {
      loader.present();
      this.spDetails.fullAddress == "Your Location";
      this.helpers.getCurrentLocation().then(locationData => {
        if (locationData.coords) {
          this.spDetails.location = locationData;
          this.driverAvaliable();
        } else {
          this.helpers.showToast("Error in getting your location. Please check your location settings.", 5000);
        }
        loader.dismiss()
      })
    })
  }

  async ionViewWillEnter() {
    this.getSPDetails();
    let checkJobInfoNav = false;
    this.isInternetAvailable = this.helpers.isNetworkAvailable;
    this.activateRoute.queryParams.subscribe(params => {
      if (params.jobInfoFlag != undefined) {
        checkJobInfoNav = params.jobInfoFlag;
      }
    });

  }



  getSPDetails() {
    this.loadingCtrl.create({ "message": "Please wait" }).then(loader => {
      loader.present()
      this.storage.get("clcDriverID").then(res => {
        this._api.getSPDetails(res).subscribe(
          res => {
            this.iscarSelected = res.data[0].driverVehicleId
            let loc = this.spDetails.location
            this.spDetails = res.data[0];
            this.spDetails.location = loc
            this.storage.get("firstTime").then(results => {
              if (!this.requestCheck) {
                this.requestCheck = interval(10000).subscribe(val => {
                  this.getRequests().then(() => {
                    loader.dismiss()
                  })
                });
              } else {
                loader.dismiss()
              }

              if (!results) {
                this.storage.set("firstTime", true)
                this.alertprovider.presentAlert(
                  "Hello " +
                  this.spDetails.driverFirstName +
                  " " +
                  this.spDetails.driverLastName +
                  ", Welcome.",
                  "Please select a vehicle before going on duty!"
                );
              }
            })
            this.storage.set("clcSPDetails", this.spDetails);
            if (this.spDetails.driverImageUrl == "")
              this.spDetails.driverImageUrl = null;
            this._genServices.setDriverDetails(this.spDetails);
          },
          err => {
            this.alertprovider.presentAlert(
              "Error",
              "Something went wrong, please login and try again!"
            );
            this.navCtrl.navigateBack(["/login"]);
          }
        );
      });
    })
  }




  async availableClick() {
    if (this.serviceReq.data.driverStatus) {
      this.loadingCtrl.create({
        message: "Please wait..."
      }).then(loader => {
        loader.present()
        this._api.setDriveStatus(this.spDetails.driverId, this._genServices.driveStatus.available).subscribe(
          res => {
            if (res.status == true) {
              this.driverAvaliable();
            }
            loader.dismiss();
          },
          err => {
            loader.dismiss();
            this.isToggled = false;
            this.alertprovider.presentAlert(
              "Error",
              "Could not get you online, please try again!"
            );
          }
        );
        this.insomnia.keepAwake()
          .then(
            () => console.log('success'),
            () => console.log('error')
          );
      })
    } else {
      this.loader = await this.loadingCtrl.create({
        message: "Going Off Duty..."
      });
      await this.loader.present();
      await this._api
        .setDriveStatus(
          this.spDetails.driverId,
          this._genServices.driveStatus.notAvailable
        )
        .subscribe(res => { });
      this.isAvailable = false;
      this.map.clear();
      // await this.map.remove();
      this.isToggled = false;
      this.isReqAccepted = false;
      this.navigationStarted = false;
      this.spArrived = false;
      this.isJobAllocaed = false;
      // if (this.requestCheck != undefined || this.requestCheck instanceof Subscriber) {
      //   this.requestCheck.unsubscribe();
      // }
      // await this.loadMap();
      this.loader.dismiss();
      await this.insomnia.allowSleepAgain()
        .then(
          () => console.log('success'),
          () => console.log('error')
        );
    }
  }


  selectVeh() {
    this.route.navigateByUrl("select-vehicle");
  }
  count: number = 0;

  async getLatestLocation() {
    this.watchLocation = this.geolocation
      .watchPosition({
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: true,
      })
      .subscribe(location => {
        if ("coords" in location) {
          this.counter++
          console.log(this.counter)
          if (this.counter > 60 && this.serviceReq.data.driverStatus == 1) {
            this.counter = 0;
            this.spDetails.location = location;
            this._api.setSpLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              driverId: this.spDetails.driverId,
              mobileNumber: this.spDetails.driverContactNumber,
              // call_id: 0
              call_id: this.serviceReq.data.serviceRequests.callId
            }).subscribe(
              setLocationResponse => {
                if (setLocationResponse.status == true) {
                  this.failedToSetLocationCounter = 0;
                  this.tripDetails.Eta = setLocationResponse.data.distance.time;
                  this.tripDetails.Distance = setLocationResponse.data.distance.distance
                }
              },
              err => {
                this.failedToSetLocationCounter++;
                if (this.failedToSetLocationCounter > 10) {
                  this.alertprovider.presentAlert(
                    "Server Error",
                    "Couldn't connect to our servers and set your location, Please Try Again"
                  );
                  this.isToggled = false;
                  this.isAvailable = false;
                }
              }
            );
          }
          if (this.route.isActive('app/tabs/tab1', false)) {
            this.spMarker.setPosition({
              lat: location.coords.latitude,
              lng: location.coords.longitude
            });
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
                this.map.animateCamera({
                  target: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                  },
                  zoom: 14,
                  duration: 1000
                });
                break;
              case 4:
                this.map.animateCamera({
                  target: [
                    { lat: this.serviceReq.data.clientLocation.latitude, lng: this.serviceReq.data.clientLocation.longitude },
                    { lat: this.spDetails.location.coords.latitude, lng: this.spDetails.location.coords.longitude }
                  ],
                  duration: 1000,
                  zoom: 10
                });
                break;
              case 13:
                this.map.animateCamera({
                  target: [
                    { lat: this.serviceReq.data.finalDestination.latitude, lng: this.serviceReq.data.finalDestination.longitude },
                    { lat: this.spDetails.location.coords.latitude, lng: this.spDetails.location.coords.longitude }
                  ],
                  duration: 1000,
                  zoom: 10
                });
                break;
            }
          }


        }
      });

  }
  async getRequests() {
    return this._api.checkServiceRequests(this.spDetails.driverId).subscribe(serviceRequestResponse => {
      console.log()
      this.statusChanged = this.serviceReq.data.serviceRequests.status != serviceRequestResponse.data.serviceRequests.status
      console.log(this.statusChanged)
      this.serviceReq = serviceRequestResponse
      if (!this.checkingRequest) {
        switch (this.serviceReq.data.serviceRequests.status) {
          default:
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
            break;
          case 1:
          case 2:
            this.route.isActive('app/tabs/tab1', false) && this.spDetails.location ? this.checkRequest("reviewing") : "";
          case 3:
            break;
          case 4:
            this.isJobAllocaed ? "" : this.allocateJob();
            break;
          case 8:
            this.checkRequest("notAllocated");
            break;
          case 10:
            this.route.isActive('app/tabs/tab1', false) ? this.arrived() : "";
            break;
          case 11:
            this.clearMap()
            this.checkRequest("endTowResponse");
            break;
          case 13:
            console.log(this.navigatingToFD)
            this.navigatingToFD ? "" : this.clearMap().then(()=>{this.navToFinalDest()});
            break;
          case 14:
            this.statusChanged ? this.clearMap() : "";
            this.serviceReq.data.finalDestination.latitude ? this.checkRequest("startTow") : "";
            break;
          case 15:
            break;
        }
      }
    })
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

  async clearMap() {
    await this.map.clear()
    this.map.animateCamera({
      target: {
        lat: this.spDetails.location.coords.latitude,
        lng: this.spDetails.location.coords.longitude,
      },
      zoom: 18,
      duration: 1000
    });
    this.drawMarker("Current Location")
  }


  async checkRequest(acceptResponse) {
    this.checkingRequest = true;
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this._api.acceptJob(this.spDetails.driverId, this.serviceReq.data.serviceRequests.callId, acceptResponse, this.serviceReq.data.serviceRequests.callRef).subscribe(response => {
        this.checkingRequest = false;
        loader.dismiss();
        if (acceptResponse == "notAllocated") {
          this.alertprovider.presentAlert(
            "Job REF" + this.serviceReq.data.serviceRequests.callRef,
            "Unfortunately we could not allocate the job to you!"
          );
        }
        if (acceptResponse == "reviewing") {
          this.route.navigate(["request-alert"], {
            queryParams: {
              serviceRequest: JSON.stringify(this.serviceReq),
              serviceProvider: JSON.stringify(this.cloneAsObject(this.spDetails))
            }
          });
        }
      }, err => {
        this.checkingRequest = false;
        console.log(err)
        loader.dismiss();
      })

    })
  }




  async navToFinalDest() {
    console.log("Navigating to FD")
    this.navigatingToFD = true;
    
    this.map.animateCamera({
      target: [
        { lat: this.serviceReq.data.finalDestination.latitude, lng: this.serviceReq.data.finalDestination.longitude },
        { lat: this.spDetails.location.coords.latitude, lng: this.spDetails.location.coords.longitude }
      ],
      duration: 1000,
      zoom: 10
    });
    
    this.map.addMarkerSync({
      position: {
        lat: this.serviceReq.data.finalDestination.latitude,
        lng: this.serviceReq.data.finalDestination.longitude
      },
      title: "Final Destination"
    }).showInfoWindow();
    this.addPolyLines(this.spDetails.location.coords.latitude, this.spDetails.location.coords.longitude, this.serviceReq.data.finalDestination.latitude, this.serviceReq.data.finalDestination.longitude);
  }

  async allocateJob() {
    if (!this.isJobAllocaed) {
      this.isJobAllocaed = true;
      if (this.appPaused) {
        this.helpers.allocationPush(
          "Congragulations!! The job has been allocated to you."
        );
      } else {
        this.alertprovider.presentAlert(
          "Job Allocation",
          "Congragulations!! The job has been allocated to you."
        );
      }
    }

    this.map.animateCamera({
      target: [
        { lat: this.serviceReq.data.clientLocation.latitude, lng: this.serviceReq.data.clientLocation.longitude },
        { lat: this.spDetails.location.coords.latitude, lng: this.spDetails.location.coords.longitude }
      ],
      duration: 1000,
      zoom: 10
    });

    let icon = {
      url: this.helpers.clientIcon,
      size: {
        width: 40,
        height: 40
      }
    };

    // let markerIcon = {
    //   url: this.helpers.clientIcon,
    //   size: {
    //     width: 30,
    //     height: 30
    //   }
    // };

    // this.marker = this.map.addMarkerSync({
    //   title: "Scene location",
    //   position: {
    //     lat: this.jobDetails.data.clientLocation.latitude,
    //     lng: this.jobDetails.data.clientLocation.longitude
    //   },
    //   icon: markerIcon
    // });
    // this.marker.showInfoWindow();



    this.map.addMarkerSync({
      position: {
        lat: this.serviceReq.data.clientLocation.latitude,
        lng: this.serviceReq.data.clientLocation.longitude
      },
      title: "Scene Location",
      icon: icon
    }).showInfoWindow()


    this.addPolyLines(this.spDetails.location.coords.latitude, this.spDetails.location.coords.longitude, this.serviceReq.data.clientLocation.latitude, this.serviceReq.data.clientLocation.longitude);

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
        console.log(response)
        this.alertprovider.presentAlert(
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
      this.map.addPolyline({
        points: navPoints,
        color: "#000000",
        width: 3,
        geodesic: true
      });

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
    if (this.checkAloc instanceof Subscriber || this.checkAloc != undefined) {
      this.checkAloc.unsubscribe();
    }
    const alert = await this.alertController.create({
      header: "Confirm Cancellation",
      message: "Are you sure you want to cancel this job?",
      buttons: [
        {
          text: "Yes",
          cssClass: "secondary",
          handler: blah => {
            this._api.acceptJob(this.spDetails.driverId, this.serviceReq.data.serviceRequests.callId, "cancel", this.serviceReq.data.serviceRequests.callRef).subscribe(response => {
              this.map.clear();
              this.drawMarker("Current Location");
            })
          }
        },
        {
          text: "No",
          handler: () => {
            alert.dismiss();
            // this.allocateJob(this.spDetails.deviceId);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  async jobInfo() {
    if (this.serviceReq.data.serviceRequests.status == 3) {
      this.alertprovider.presentAlert(
        "Please wait",
        "You will be notified if you are allocated this job"
      )
    } else {
      if (this.serviceReq.data.serviceRequests.status == 4 || this.serviceReq.data.serviceRequests.status == 13 || this.serviceReq.data.serviceRequests.status == 14) {
        console.log("navigating")
        this.serviceReq.data.finalDestination = {
          latitude: 0,
          longitude: 0,
          address: "Hello"
        }
        this.route.navigate(["job-info"], {
          queryParams: {
            jobInfo: JSON.stringify(this.cloneAsObject(this.serviceReq)),
            spDetails: JSON.stringify(this.cloneAsObject(this.spDetails))
          }
        });
      }
    }


  }

  async navigate() {
    let destination = []
    this.navigationStarted = true;
    if (this.navigatingToFD) {
      // this.startTowing.nativeElement.remove();
      destination.push(this.serviceReq.data.finalDestination.latitude)
      destination.push(this.serviceReq.data.finalDestination.longitude)
      this.helpers.navigate(destination);
      //this.startTow =false;
      this.driveFinDistTarget = 80;
      this.checkRadius = interval(3000).subscribe(() => {
        this.driveFinDistTarget = this.driveFinDistTarget - 10;
        if (this.driveFinDistTarget == 10) { this.checkRadius.unsubscribe() }
      })
      return;
    }
    this.clientDriverTarget = 80;
    destination.push(this.serviceReq.data.clientLocation.latitude);
    destination.push(this.serviceReq.data.clientLocation.longitude);
    this.helpers.navigate(destination);
    this.checkRadius = interval(1000).subscribe(() => {
      this.clientDriverTarget = this.clientDriverTarget - 10;
      if (this.clientDriverTarget == 10) { this.checkRadius.unsubscribe() }
    })
  }


  arrivedFinDist() {
    this.driveFinDistTarget = null
    this.route.navigate(["final-checklist"])
  }


  async arrived() {
    this.clientDriverTarget = null;
    this.navigationStarted = false;
    this.spArrived = true;
    this.isReqAccepted = false;
    // this.isToggled = false;
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this._api.acceptJob(this.spDetails.driverId, this.serviceReq.data.serviceRequests.callId, "arrived", this.serviceReq.data.serviceRequests.callRef).subscribe(response => {
        loader.dismiss();
        this.route.navigateByUrl("accident-scene1");
      })
    })
  }

  async driverAvaliable() {
    this.map.clear().then(() => {
      this.getLatestLocation();
      this.drawMarker("Current Location");
    })
  }

  async drawMarker(title: string) {
    let icon = {
      url: this.helpers.SPIcon,
      size: {
        width: 30,
        height: 50
      }
    };
    if (this.map) {
      this.map.addMarker({
        title: title,
        position: {
          lat: this.spDetails.location.coords.latitude,
          lng: this.spDetails.location.coords.longitude
        },
        icon: icon
      }).then(marker => {
        this.spMarker = marker;
        marker.showInfoWindow();
      })
    }
  }
}
