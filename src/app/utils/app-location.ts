import { EventEmitter, Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, PositionError, Geoposition } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { UserState } from '../helpers/user-state';
import { iServiceRequest, TripDetails } from '../models/appModels';
import { ApiGateWayService } from '../providers/api-gate-way.service';
import { AppStorage } from '../utils/app-storage';
import { Platform } from '@ionic/angular';
import { BackgroundGeolocation, BackgroundGeolocationAuthorizationStatus, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse, ServiceStatus } from '@ionic-native/background-geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

// REQUIRES
//  ionic cordova plugin add cordova-plugin-geolocation --save
//  npm i @ionic-native/geolocation


@Injectable({
    providedIn: 'root',
})
export class AppLocation {

    //private timer;
    //private sub: Subscription;
    public geolocationSub: Subscription;
    private _locationUpdated: EventEmitter<any> = new EventEmitter();
    lastLocationUpdate: number = Date.now();
    tripDetails: TripDetails;
    fdTripDetails: TripDetails;
    serviceReq: iServiceRequest;
    locationServiceStatus: ServiceStatus;
    canRequestLocation: boolean = true;

    intervalId: number;
    options: GeolocationOptions = {
        timeout: 5000, // 5s
        enableHighAccuracy: true,
        maximumAge: 5000 // 5s
    };
    background: boolean;

    constructor(public storage: AppStorage,private androidPermissions: AndroidPermissions, private locationAccuracy: LocationAccuracy, private platform: Platform, private backgroundGeolocation: BackgroundGeolocation, private _api: ApiGateWayService, private geolocation: Geolocation) {
        this.platform.ready().then(() => {
            console.log("Hello")
            const config: BackgroundGeolocationConfig = {
                desiredAccuracy: 1,
                stationaryRadius: 1,
                distanceFilter: 1,
                interval: 1, // equals to 2 seconds. 
                debug: false,
                stopOnTerminate: false,
                startForeground: false,
            };
            this.backgroundGeolocation.configure(config)


            this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe((location: BackgroundGeolocationResponse) => {
                console.log("Got a foreground")
                this.background = false;
                this.backgroundGeolocation.stop()
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe((location: BackgroundGeolocationResponse) => {
                console.log("Got a background")
                this.background = true;
                this.updateStatus()
                if (this.serviceReq && this.serviceReq.data.driverStatus == 1 && this.locationServiceStatus.authorization == 1) {
                    this.backgroundGeolocation.start()
                }
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
                console.log("Got a location")
                console.log(location);
                if (this.serviceReq && this.serviceReq.data.driverStatus == 1) {
                    this._api.setSpLocation({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        driverId: this.serviceReq.data.driverId,
                        call_id: this.serviceReq.data.serviceRequests.callId
                    }).then(setLocationResponse => {
                        if (setLocationResponse.data.distance.distance) {
                            this.tripDetails = {
                                Distance: setLocationResponse.data.distance.distance,
                                Eta: setLocationResponse.data.distance.time,
                                timeMinutesValue: setLocationResponse.data.distance.timeMinutesValue
                            }
                        } else {
                            this.tripDetails = null;
                        }
                    })
                }
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe((location: BackgroundGeolocationResponse) => {
                console.log("Got a stationary")
                console.log(location);
                if (this.serviceReq && this.serviceReq.data.driverStatus == 1) {
                    this._api.setSpLocation({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        driverId: this.serviceReq.data.driverId,
                        call_id: this.serviceReq.data.serviceRequests.callId
                    }).then(setLocationResponse => {
                        if (setLocationResponse.data.distance.distance) {
                            this.tripDetails = {
                                Distance: setLocationResponse.data.distance.distance,
                                Eta: setLocationResponse.data.distance.time,
                                timeMinutesValue: setLocationResponse.data.distance.timeMinutesValue
                            }
                        } else {
                            this.tripDetails = null;
                        }
                    })
                }
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.start).subscribe((location) => {
                console.log("Got a start")
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe((location) => {
                console.log("Got a stop")
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.error).subscribe((location) => {
                console.log("Got a error")
                console.log(location);
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.authorization).subscribe((location) => {
                console.log("Got a authorization")
                console.log(location);
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });


            this.backgroundGeolocation.on(BackgroundGeolocationEvents.abort_requested).subscribe((location) => {
                console.log("Got a abort_requested")
                console.log(location);
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });

            this.backgroundGeolocation.on(BackgroundGeolocationEvents.http_authorization).subscribe((location) => {
                console.log("Got a http_authorization")
                console.log(location)
                this.updateStatus()
                this.updateStatus()
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });
            // this.init()
            this.updateStatus()
            // setInterval(()=>{this.getBackgroundLocation()}, 5000)
        })

    }

    requestLocationServices(event: any) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                console.log(canRequest)
                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => {
                            this.updateStatus()
                            console.log('Request successful')
                        },
                        error => console.log('Error requesting location permissions', error)
                    );
                } else {
                    this.backgroundGeolocation.showLocationSettings()
                }
    
            });
      
       
    }
 
    requestLocationPermission(event: any) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();

        this.backgroundGeolocation.getCurrentLocation().then(loc=>{
            console.log(loc)
        }).catch(err=>{
            console.log("permision error")
            console.log(err)
            this.canRequestLocation?this.canRequestLocation = false:this.backgroundGeolocation.showAppSettings()
        })

    }

    updateStatus() {
        console.log("Schecking status")
        this.backgroundGeolocation.checkStatus().then(status => {
            console.log("Status " + JSON.stringify(status))
            this.locationServiceStatus = status
            if(status.authorization == BackgroundGeolocationAuthorizationStatus.AUTHORIZED  && this.serviceReq && this.serviceReq.data.driverStatus == 1){
                this.geolocationSub?"":this.startWatching()
            }else{
                this.geolocationSub?this.stopWatching():"";
            }
        })
    }

    getBackgroundLocation() {
        console.log("starting")
        this.background ? this.backgroundGeolocation.getCurrentLocation().then(loc => {
            console.log(loc)
        }) : "";
    }

    public get locationUpdated(): EventEmitter<any> {
        return this._locationUpdated;
    }

    init() {
        console.log("initializing location...");

        // call this to ensure permissions are setup
        // this.geolocation.getCurrentPosition();
        this.locate(true);

        // setup a timer to locate the user every 2 mins
        // this.intervalId = window.setInterval(() => this.locate(), 2 * 60 * 1000);
    }

    startWatching() {
        console.log("Watching geoposition!");

        let options: GeolocationOptions = {
            enableHighAccuracy: true,
        };
    
        // fire up the GPS to update last known position as soon as possible
        this.geolocationSub = this.geolocation.watchPosition(options)
            .subscribe(
                position => {
                if (!position)
                    return;

                if ('coords' in position) {
                    if (this.serviceReq) {
                        if (this.serviceReq.data.driverStatus == 1 && ((Date.now() - this.lastLocationUpdate) > 1000)) {
                            this.lastLocationUpdate = Date.now();
                            this._api.setSpLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                driverId: this.serviceReq.data.driverId,
                                call_id: this.serviceReq.data.serviceRequests.callId
                            }).then(setLocationResponse => {
                                if (setLocationResponse.data.distance.distance) {
                                    this.tripDetails = {
                                        Distance: setLocationResponse.data.distance.distance,
                                        Eta: setLocationResponse.data.distance.time,
                                        timeMinutesValue: setLocationResponse.data.distance.timeMinutesValue
                                    }
                                } else {
                                    this.tripDetails = null;
                                }
                            })
                        }
                    }
                    this.LastKnownLatitude = position.coords.latitude;
                    this.LastKnownLongitude = position.coords.longitude;
                    this._locationUpdated.emit(position.coords);
                }

            },
            err=>{
                console.log("Watch error");
                console.log(err)
            });
    }

    stopWatching() {
        if (this.geolocationSub) {
            this.geolocationSub.unsubscribe();
            this.geolocationSub = undefined;
        }
    }

    locate(accurate: boolean = false): Promise<LocationResponse> {
        console.log("Finding device location...");

        this.options.enableHighAccuracy = accurate;

        return new Promise<LocationResponse>(resolve => {
            // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions

            if (navigator.geolocation) {
                this.geolocation.getCurrentPosition(this.options)
                    .then((position: Geoposition) => {
                        resolve(this.buildLocationResponse(true, "Successful", "Location found!", position));
                    })
                    .catch((error: PositionError) => {
                        switch (error.code) {
                            case 1: //PERMISSION_DENIED
                                console.error("Location permission was denied!");
                                resolve(this.buildLocationResponse(false, "Denied", "User denied the request for Geolocation.", null));
                                break;
                            case 2: //POSITION_UNAVAILABLE
                                console.error("Location information is unavailable");
                                resolve(this.buildLocationResponse(false, "Unavailable", "Location information is unavailable", null));
                                break;
                            case 3: //TIMEOUT
                                console.error("Location request timed out!");
                                resolve(this.buildLocationResponse(false, "Timeout", "The request to get user location timed out.", null));
                                break;
                            default:
                                console.error("Unknown location error occured!");
                                resolve(this.buildLocationResponse(false, "Unknown", "An unknown error occurred.", null));
                                break;
                        }
                    });
            }
            else {
                resolve(this.buildLocationResponse(false, "Unavailable", "Location services are not available on this device.", null))
            }
        });
    }


    private lastKnownLatitude: number;
    public get LastKnownLatitude(): number {
        if (!this.lastKnownLatitude)
            return 0;
        return this.lastKnownLatitude;
    }
    public set LastKnownLatitude(value: number) {
        this.lastKnownLatitude = value;
        this.storage.setLastKnownLatitude(value);
    }

    private lastKnownLongitude: number;
    public get LastKnownLongitude(): number {
        if (!this.lastKnownLongitude)
            return 0;
        return this.lastKnownLongitude;
    }

    public set LastKnownLongitude(value: number) {
        this.lastKnownLongitude = value;
        this.storage.setLastKnownLongitude(value);
    }

    private buildLocationResponse(success: boolean, heading: string, description: string, location: Geoposition): LocationResponse {
        let response: LocationResponse = {
            wasSuccessful: success,
            heading: heading,
            description: description,
            location: null
        };

        if (location !== null) {
            response.location = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                heading: location.coords.heading,
                accuracy: location.coords.accuracy
            };

            // save location
            this.LastKnownLatitude = location.coords.latitude;
            this.LastKnownLongitude = location.coords.longitude;

            console.log('location found: ' + location.coords.latitude + ', ' + location.coords.longitude);
        }

        return response;
    }
}


export interface LocationResponse {
    wasSuccessful: boolean;
    heading: string;
    description: string;
    location: LocationLock;
}

export interface LocationLock {
    latitude: number;
    longitude: number;
    heading: number;
    accuracy: number;
}