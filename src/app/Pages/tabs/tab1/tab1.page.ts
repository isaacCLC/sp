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
      finalDestination: "",
      driverStatus: false,
      client: {}
    }
  };
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
  navToFinDist: iFinalDest;
  checkRadius: any
  clientDriverTarget: number
  driveFinDistTarget: number = null;
  startTow: boolean = false;
  _genServices: GeneralService;
  iscarSelected: boolean;
  isInternetAvailable: boolean;

  spLocation: Geoposition;
  tripDetails: TripDetails = {
    Distance: null,
    Eta: null,
    finalDestination: null
  };
  clientDetails: ClientDetails = {};
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
          this.spLocation = locationData;
          // this._api.getGeoCoding(this.spLocation.coords.latitude, this.spLocation.coords.longitude).subscribe(
          //   address => {
          //     if (address.body.status == true) {
          //       this.spDetails.fullAddress = address.body.data.results[0].address_components[0].short_name + " " + address.body.data.results[0].address_components[1].short_name + ", " + address.body.data.results[0].address_components[2].short_name;
          //     } else {
          //       this.spDetails.fullAddress == "Your Location";
          //     }
          //   },
          //   err => {
          //     this.spDetails.fullAddress == "No Address";
          //   });
          this.map.animateCamera({
            target: {
              lat: locationData.coords.latitude,
              lng: locationData.coords.longitude
            },
            zoom: 15,
            duration: 1000
          });
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

    this.requestResponse(); //service request handler
  }



  getSPDetails() {
    this.loadingCtrl.create({ "message": "Please wait" }).then(loader => {
      loader.present()
      this.storage.get("clcDriverID").then(res => {
        this._api.getSPDetails(res).subscribe(
          res => {
            this.iscarSelected = res.data[0].driverVehicleId
            this.spDetails = res.data[0];
            this.storage.get("firstTime").then(results => {
              if (!this.requestCheck) {
                this.requestCheck = interval(10000).subscribe(val => {
                  this.getRequests().then(() => {
                    console.log("Done checkking")
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
    if (this.isToggled) {
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
      if (this.watchLocation instanceof Subscriber) {
        this.watchLocation.unsubscribe();
      }
      if (this.requestCheck != undefined || this.requestCheck instanceof Subscriber) {
        this.requestCheck.unsubscribe();
      }
      if (this.checkAloc instanceof Subscriber) {
        this.checkAloc.unsubscribe();
      }
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
          if (this.map && this.route.isActive('app/tabs/tab1', false) && this.isAvailable && !this.isJobAllocaed && !this.startTow) {
            this.map.animateCamera({
              target: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
              },
              zoom: 18,
              duration: 1000
            });
          }
          this.spLocation = location
          if (this.serviceReq.data.driverStatus) {
            this._api.setSpLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              driverId: this.spDetails.driverId,
              mobileNumber: this.spDetails.driverContactNumber,
              call_id: this.serviceReq.data.serviceRequests.callId
            }).subscribe(
              data => {
                if (data.status == true) {
                  this.failedToSetLocationCounter = 0;
                  if (this.navigationStarted) {
                    let destinationLat = this.clientDetails.lat;
                    let destinationLng = this.clientDetails.lng;
                    if (this.startTow) {
                      destinationLat = this.navToFinDist.lat;
                      destinationLng = this.navToFinDist.lng;
                    }
                    this._api.getDistance({
                      latA: location.coords.latitude,
                      lonA: location.coords.longitude,
                      latB: destinationLat,
                      lonB: destinationLng
                    }).then(res => {
                      if (res) {
                        this.tripDetails.Eta = res.data.time;
                        this.tripDetails.Distance = res.data.distance

                      }
                    }, err => {
                      alert(JSON.stringify(err))
                    });
                    if (this.spMarker && this.map && this.route.isActive('app/tabs/tab1', false) && this.isAvailable) {
                      this.spMarker.setPosition({
                        // lat: 1,
                        // lng: 2
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                      });
                    }
                  } else {
                    if (this.spMarker && this.map && this.route.isActive('app/tabs/tab1', false) && this.isAvailable) {
                      this.spMarker.setPosition({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                      });
                    }
                  }
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
        }
      });

  }
  async getRequests() {
    return this._api.checkServiceRequests(this.spDetails.driverId).subscribe(serviceRequestResponse => {
      this.serviceReq = serviceRequestResponse
      switch (this.serviceReq.data.serviceRequests.status) {
        case 4:

      }
    })
  }


  async getRequestsOld() {
    return this._api.checkServiceRequests(this.spDetails.driverId).subscribe(serviceRequestResponse => {
      this.serviceReq = serviceRequestResponse
      if (this.iscarSelected && this.spLocation) {
        let status = (this.serviceReq.data.driverStatus == 1) ? true : false;
        if (this.isToggled != status) {
          this.isToggled = status;
          this.availableClick();
        }

        if (status) {
          switch (this.serviceReq.data.serviceRequests.status) {
            case 4:

          }
        }
        if (this.serviceReq.data.serviceRequests.status == 4) {
          this._api.getDistance({
            latA: this.spLocation.coords.latitude,
            lonA: this.spLocation.coords.longitude,
            latB: this.serviceReq.data.clientLocation.latitude,
            lonB: this.serviceReq.data.clientLocation.longitude
          })
            .then(res => {
              if (res) {
                this.serviceReq.data.client.distance = res.data.distance;
                this.tripDetails.Eta = res.data.time
                this.tripDetails.Distance = res.data.distance
                this.awaitingFD = false;
                if (!this.isJobAllocaed) {
                  this.allocateJob(this.serviceReq.data.clientLocation.latitude, this.serviceReq.data.clientLocation.longitude);
                }
                this.spArrived = false;
                this.isReqAccepted = true;
                this.map.animateCamera({
                  target: [
                    { lat: this.serviceReq.data.clientLocation.latitude, lng: this.serviceReq.data.clientLocation.longitude },
                    { lat: this.spLocation.coords.latitude, lng: this.spLocation.coords.longitude }
                  ],
                  duration: 1000,
                  zoom: 10
                });
              }
              try {
                //this.addPolyLines(res.lat, res.lng);
              } catch (error) { }
              this.clientDetails.lat = this.serviceReq.data.clientLocation.latitude;
              this.clientDetails.lng = this.serviceReq.data.clientLocation.longitude;
              this.clientDetails.callID = this.serviceReq.data.serviceRequests.callId
              this.clientDetails.callRef = this.serviceReq.data.serviceRequests.callRef
              this.clientDetails.sub_sub_product_name = this.serviceReq.data.serviceRequests.sub_sub_product_name
              this.clientDetails.finallocation = this.serviceReq.data.finalDestination


              this.finalDestination = this.serviceReq.data.finalDestination
              this.setClientDetails(this.serviceReq.data.client);
            }, err => {
              console.log(err)
              alert(JSON.stringify(err))
            });
        } else {
          if ((this.serviceReq.data.serviceRequests.status == 1 || this.serviceReq.data.serviceRequests.status == 2) && !this.route.isActive('request-alert', false)) {
            this.clientDetails.callID = this.serviceReq.data.serviceRequests.callId
            this.checkRequest(this.serviceReq, "reviewing");
          }
        }
        if (this.serviceReq.data.serviceRequests.status == 10) {
          console.log(this.serviceReq.data.finalDestination)
          if (this.serviceReq.data.finalDestination) {
            this._api.getReverseGeocoding(this.serviceReq.data.finalDestination).subscribe(reponse => {
              console.log(reponse.body.data.latitude)
              this._api.getDistance({
                latA: this.spLocation.coords.latitude,
                lonA: this.spLocation.coords.longitude,
                latB: reponse.body.data.latitude,
                lonB: reponse.body.data.longitude
              }).then(res => {
                if (res) {
                  console.log(res)
                  this.awaitingFD = false;
                  this.serviceReq.data.client.distance = res.data.distance;
                  this.tripDetails.Eta = res.data.time
                  this.tripDetails.Distance = res.data.distance
                  console.log(this.startTow)
                  this.navToFinDist = {
                    corpName: "Tow",
                    lat: reponse.body.data.latitude,
                    lng: reponse.body.data.longitude
                  }

                  if (!this.startTow) {
                    this.navToFinalDest({
                      lat: reponse.body.data.latitude,
                      lng: reponse.body.data.longitude,
                      corpName: "Panel Beaters",
                      // navToFinDist: true
                    });
                  }


                  this.spArrived = false;
                  this.isReqAccepted = true;
                  this.map.animateCamera({
                    target: [
                      { lat: reponse.body.data.latitude, lng: reponse.body.data.longitude },
                      { lat: this.spLocation.coords.latitude, lng: this.spLocation.coords.longitude }
                    ],
                    duration: 1000,
                    zoom: 10
                  });
                }

                this.clientDetails.lat = this.serviceReq.data.clientLocation.latitude;
                this.clientDetails.lng = this.serviceReq.data.clientLocation.longitude;
                this.clientDetails.callID = this.serviceReq.data.serviceRequests.callId
                this.clientDetails.callRef = this.serviceReq.data.serviceRequests.callRef
                this.clientDetails.sub_sub_product_name = this.serviceReq.data.serviceRequests.sub_sub_product_name
                this.clientDetails.finallocation = this.serviceReq.data.finalDestination


                this.finalDestination = this.serviceReq.data.finalDestination
                this.setClientDetails(this.serviceReq.data.client);

              }, err => {
                console.log(err)
                alert(JSON.stringify(err))
              });
            })
          } else {
            this.clientDetails.lat = this.serviceReq.data.clientLocation.latitude;
            this.clientDetails.lng = this.serviceReq.data.clientLocation.longitude;
            this.clientDetails.callID = this.serviceReq.data.serviceRequests.callId
            this.clientDetails.callRef = this.serviceReq.data.serviceRequests.callRef;
            this.clientDetails.sub_sub_product_name = this.serviceReq.data.serviceRequests.sub_sub_product_name;
            this.clientDetails.finallocation = this.serviceReq.data.finalDestination;

            this.map.clear();
            this.isReqAccepted = true;
            this.awaitingFD = true;
            // this.startTow = true;

            this.tripDetails.Eta = "Awaiting FD"
            this.tripDetails.Distance = ""
          }

        }
        if (this.serviceReq.data.serviceRequests.status == 3) {
          this.isReqAccepted = true
          this._api.getDistance({
            latA: this.spLocation.coords.latitude,
            lonA: this.spLocation.coords.longitude,
            latB: this.serviceReq.data.clientLocation.latitude,
            lonB: this.serviceReq.data.clientLocation.longitude
          })
            .then(res => {
              if (res) {
                this.serviceReq.data.client.distance = res.data.distance;
                this.tripDetails.Eta = res.data.time
                this.tripDetails.Distance = res.data.distance
              }
              try {
                //this.addPolyLines(res.lat, res.lng);
              } catch (error) { }
              this.clientDetails.lat = this.serviceReq.data.clientLocation.latitude;
              this.clientDetails.lng = this.serviceReq.data.clientLocation.longitude;
              this.clientDetails.callID = this.serviceReq.data.serviceRequests.callId
              this.clientDetails.callRef = this.serviceReq.data.serviceRequests.callRef;
              this.clientDetails.sub_sub_product_name = this.serviceReq.data.serviceRequests.sub_sub_product_name;
              this.clientDetails.finallocation = this.serviceReq.data.finalDestination;


              this.finalDestination = this.serviceReq.data.finalDestination
              this.setClientDetails(this.serviceReq.data.client);
            }, err => {
              console.log(err)
              alert(JSON.stringify(err))
            });
        }
        if (this.serviceReq.data.serviceRequests.status == 8) {
          this.checkRequest(this.serviceReq, "notAllocated");
          this.map.clear();
          this.isAvailable = true;
          this.isReqAccepted = false;
          this.isJobAllocaed = false;
          this.tripDetails.Eta = null;
          this.navigationStarted = false;
          this.startTow = false;
          // this.alertprovider.presentAlert(
          //       "Job Allocation",
          //       "Unfortunately we could not allocate the job to you!"
          // );  

        }
        if (this.serviceReq.data.serviceRequests.status == 11) {
          this.checkRequest(this.serviceReq, "endTowResponse");
          this.navigationStarted = false
          this.isReqAccepted = false
          this.startTow = false
          this.tripDetails = null
          this.storage.remove("callComplete")

          let spTitle = this.spDetails.fullAddress;
          this.map.clear();
        }
      }

    })
  }

  setClientDetails(param: any) {
    this.clientDetails.name = param.name;
    this.clientDetails.surname = param.surname;
    this.clientDetails.number = param.number;
    // this.clientDetails.lat = param.lat;
    // this.clientDetails.lng = param.lng;
    // this.clientDetails.requestDate = param.requestDate;
    // this.clientDetails.address = param.clientAddress;
    this.clientDetails.distance = param.distance;
    this._api.getGeoCoding(this.clientDetails.lat, this.clientDetails.lng).subscribe(address => {
      // console.log(address)
      if (address.body.status == true) {
        this.clientDetails.address = address.body.data.results[0].address_components[0].short_name + " " + address.body.data.results[0].address_components[1].short_name + ", " + address.body.data.results[0].address_components[2].short_name;
      }
    });
  }

  async checkRequest(clientDetails: any, acceptResponse) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this._api.acceptJob(this.spDetails.driverId, clientDetails.data.serviceRequests.callId, acceptResponse).subscribe(response => {
        loader.dismiss();
        if (acceptResponse == "notAllocated") {
          this.alertprovider.presentAlert(
            "Job REF" + clientDetails.data.serviceRequests.callRef,
            "Unfortunately we could not allocate the job to you!"
          );
        }
        if (acceptResponse == "callComplete") {
          this.alertprovider.presentAlert(
            "Job REF" + clientDetails.data.serviceRequests.callRef,
            "Thank you for completing this job!"
          );
        }

        if (acceptResponse == "reviewing") {
          this.route.navigate(["request-alert"], {
            queryParams: {
              clientDetails: JSON.stringify(clientDetails),
              spDetials: JSON.stringify(this.spDetails),
              spLocation: JSON.stringify({ lat: this.spLocation.coords.latitude, lng: this.spLocation.coords.longitude })
            }
          });
        }
      }, err => {
        console.log(err)
        loader.dismiss();
      })

    })
  }

  requestResponse() {
    if (this.isToggled) {
      this.storage.get("clcrequestResponse").then(res => {
        if (res != undefined || res != null) {
          if (res.reqAccepted == true) {
            this.storage.remove("clcrequestResponse")
            this.alertprovider.presentAlert(
              "Job Accepted",
              "Thank you for accepting this job. You will be notified if this job is allocated to you shortly"
            );
          } else {
            this.isReqAccepted = false;
          }
          this.stayActive = true;
        }
      });
    }
    else {
      this.storage.remove("clcrequestResponse")
    }
  }


  async navToFinalDest(finalDest: iFinalDest) {
    try {
      await this.map.clear();
      this.startTow = true;
      this.navigationStarted = true;
      let marker: Marker = await this.map.addMarkerSync({
        position: {
          lat: finalDest.lat,
          lng: finalDest.lng
        },
        title: "Final Destination"
      });
      marker.showInfoWindow();
      await this.addPolyLines(this.spLocation.coords.latitude, this.spLocation.coords.longitude, finalDest.lat, finalDest.lng);
      await this.storage.remove('navToFinDist');
    } catch (error) { }
  }

  async allocateJob(lat, lng) {
    let icon = {
      url: this.helpers.clientIcon,
      size: {
        width: 40,
        height: 40
      }
    };

    if (!this.isJobAllocaed) {
      if (this.appPaused) {
        this.helpers.allocationPush(
          "Congragulations!! The job has been allocated to you"
        );
      } else {
        this.alertprovider.presentAlert(
          "Job Allocation",
          "We are now good to go! The job has been allocated to you!"
        );
      }
    }

    this.isJobAllocaed = true;

    try {
      this.map.addMarkerSync({
        position: {
          lat: lat,
          lng: lng
        },
        title: "Your Destination",
        icon: icon
      }).showInfoWindow()
      this.addPolyLines(this.spLocation.coords.latitude, this.spLocation.coords.longitude, lat, lng);
    } catch (error) {
      throw error;
    }
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
            this._api.acceptJob(this.spDetails.driverId, this.clientDetails.callID, "cancel").subscribe(response => {
              this.map.clear();
              this.isAvailable = true;
              this.isReqAccepted = false;
              this.isJobAllocaed = false;
              this.tripDetails.Eta = null;
              this.navigationStarted = false;
              this.startTow = false;
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
    if (this.isReqAccepted && !this.navigationStarted && !this.isJobAllocaed && !this.awaitingFD) {
      this.alertprovider.presentAlert(
        "Please wait",
        "You will be notified if you are allocated this job"
      )
    } else {
      if (!this.awaitingFD) {
        this._api.getDistance({
          latA: this.spLocation.coords.latitude,
          lonA: this.spLocation.coords.longitude,
          latB: this.clientDetails.lat,
          lonB: this.clientDetails.lng
        }).then(res => {
          if (res) {
            this.tripDetails.Eta = res.data.time;
            this.tripDetails.Distance = res.data.distance
            this.tripDetails.finalDestination = this.finalDestination

            this.route.navigate(["job-info"], {
              queryParams: {
                clientDetalis: JSON.stringify(this.clientDetails),
                jobInfo: JSON.stringify(this.tripDetails)
              }
            });
          }
        }, err => {
          alert(JSON.stringify(err))
        });
      } else {
        this.tripDetails.Eta = "Awaiting FD";
        this.tripDetails.Distance = "Awaiting FD"
        this.tripDetails.finalDestination = "Awaiting Towing Destination"

        this.route.navigate(["job-info"], {
          queryParams: {
            clientDetalis: JSON.stringify(this.clientDetails),
            jobInfo: JSON.stringify(this.tripDetails)
          }
        });
      }

    }


  }

  async navigate() {
    let destination = []
    this.navigationStarted = true;
    // await this.getLatestLocation();
    if (this.startTow) {
      // this.startTowing.nativeElement.remove();
      destination.push(this.navToFinDist.lat)
      destination.push(this.navToFinDist.lng)
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
    destination.push(this.clientDetails.lat);
    destination.push(this.clientDetails.lng);
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
    if (this.watchLocation instanceof Subscriber)
      await this.watchLocation.unsubscribe();
    // this.isToggled = false;
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this._api.acceptJob(this.spDetails.driverId, this.clientDetails.callID, "arrived").subscribe(response => {
        loader.dismiss();
        this.route.navigateByUrl("accident-scene1");
      })
    })
  }

  async driverAvaliable() {
    let spTitle = this.spDetails.fullAddress;
    this.map.clear().then(() => {
      this.drawMarker("Current Location");
      this.isAvailable = true;
      this.btnArridedDisabled = false;
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
    let topLevel = this;
    if (this.map) {
      this.map.addMarker({
        title: title,
        position: {
          lat: this.spLocation.coords.latitude,
          lng: this.spLocation.coords.longitude
        },
        icon: icon
      }).then(marker => {
        this.getLatestLocation();
        this.spMarker = marker;
        marker.showInfoWindow();
      })
    }
  }

  // alert(alert: string) {
  //   this.loadingCtrl.create({
  //     message: "Please wait..."
  //   }).then(loader => {
  //     loader.present();
  //     let claim = new CurrentClaim();
  //     // claim.call.appUserId = this.spDetails.driverId;
  //     claim.call.callRef = this.clientDetails.callRef;
  //     switch (alert) {
  //       case 'awaitingAllocation':
  //         break;
  //       case 'awaitingFD':
  //         break;
  //       case 'arrivedScene':
  //         claim.call.clientArrived = 1;
  //         break;
  //       case 'arrivedFinDist':
  //         claim.call.finArrived = 1;
  //         break;
  //     }

  //     this._api.addClaim(claim).then(resposne => {
  //       loader.dismiss()
  //     })

  //   })
  // }
}
