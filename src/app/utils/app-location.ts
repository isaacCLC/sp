import { EventEmitter, Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, PositionError } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { AppStorage } from '../utils/app-storage';

// REQUIRES
//  ionic cordova plugin add cordova-plugin-geolocation --save
//  npm i @ionic-native/geolocation


@Injectable({
    providedIn: 'root',
})
export class AppLocation {

    //private timer;
    //private sub: Subscription;
    private geolocationSub: Subscription = undefined;
    private _locationUpdated: EventEmitter<any> = new EventEmitter();
    intervalId: number;
    options: GeolocationOptions = {
        timeout: 5000, // 5s
        enableHighAccuracy: true,
        maximumAge: 5000 // 5s
    };

    constructor(public storage: AppStorage, public geolocation: Geolocation) {

    }

    public get locationUpdated(): EventEmitter<any> {
        return this._locationUpdated;
    }

    init() {
        console.log("initializing location...");

        // call this to ensure permissions are setup
        this.geolocation.getCurrentPosition();
        this.locate(true);

        // setup a timer to locate the user every 2 mins
        this.intervalId = window.setInterval(() => this.locate(), 2 * 60 * 1000);
    }

    startWatching() {
        console.log("Watching geoposition!");

        let options: GeolocationOptions = {
            enableHighAccuracy: true,
        };

        // fire up the GPS to update last known position as soon as possible
        this.geolocationSub = this.geolocation.watchPosition(options)
            .subscribe(position => {
                console.log("Watched location")
                if (!position)
                    return;
                    
                if ('coords' in position) {
                    this.LastKnownLatitude = position.coords.latitude;
                    this.LastKnownLongitude = position.coords.longitude;
                    this._locationUpdated.emit(position.coords);
                }

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
                    .then((position: Position) => {
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

    private buildLocationResponse(success: boolean, heading: string, description: string, location: Position): LocationResponse {
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