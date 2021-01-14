import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AppConfig } from './app-config';
import { AppEvents } from './app-events';
//import { ActionProcessor, CancelBookingAction, ExtendBookingAction, ViewBookingAction, ViewMessageAction } from './action-processor';
import { AppStorage } from './app-storage';
import { DeviceInfo } from './device-info';


// ionic cordova plugin add onesignal-cordova-plugin
// npm install --save @ionic-native/onesignal

@Injectable({
    providedIn: 'root',
})
export class PushMessage {
    private id: string = '';
    private initialised: boolean = false;

    constructor(private storage: AppStorage, private device: DeviceInfo, private oneSignal: OneSignal, public events: AppEvents) {

    }

    async registerForPush(): Promise<boolean> {
        if (this.device.isCordova) {
            console.log("Registering for APP push notifications...");
            return this.registerForAppPush();
        }
        else {
            return false;
        }
    }


    private async registerForAppPush(): Promise<boolean> {
        if (this.initialised) {
            let ids = await this.oneSignal.getIds();
            this.setId(ids.userId);
        }

        if (this.device.isAndroid)
            this.oneSignal.startInit(AppConfig.OneSignalAppId, AppConfig.OneSignalGoogleProjectNumber);
        else {
            this.oneSignal.startInit(AppConfig.OneSignalAppId, '');
            this.oneSignal.registerForPushNotifications(); // required for ios permissions
        }

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationReceived().subscribe((data) => {
            let notificationId = data.payload.notificationID;
            console.log('notification received : ' + notificationId);
        });

        this.oneSignal.handleNotificationOpened().subscribe((data) => {
            const notificationId = data.notification.payload.notificationID;
            const extraData = JSON.parse(data.notification.payload.additionalData.data);
            // if (extraData && extraData.action) {
            //     if (extraData.action == "etaScreen")
            //         this.events.publish(ActionProcessor.notificationOpenedEventKey, new ViewETA(extraData.callRef));
            //     else
            //         this.events.publish(ActionProcessor.notificationOpenedEventKey, new ViewHome());
            // }
            // else
            //     this.events.publish(ActionProcessor.notificationOpenedEventKey, new ViewHome());

            console.log('notification opened : ' + notificationId);
        });

        this.oneSignal.endInit();

        let ids = await this.oneSignal.getIds();
        this.setId(ids.userId);
        console.log('Push Player Id: ' + this.id);
        return true;
    }

    private setId(pushPlayerId: string) {
        this.initialised = true;
        this.id = pushPlayerId;
        this.storage.setPushPlayerId(pushPlayerId);
    }

    public get playerId(): string {
        return this.id;
    }
}
