import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';

// ionic cordova plugin add cordova-plugin-device --save
// npm i @ionic-native/device

@Injectable({
    providedIn: 'root',
})
export class DeviceInfo {

    constructor(public platformService: Platform, public device: Device) {
        console.log("Platforms: " + platformService.platforms());
    }

    public get isAndroid(): boolean {
        return this.platformService.is('android');
    }

    public get isIos(): boolean {
        return this.platformService.is('ios');
    }

    public get isCordova(): boolean {
        return this.platformService.is('cordova');
    }
}