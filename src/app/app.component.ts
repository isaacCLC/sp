import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Device } from "@ionic-native/device/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { ChatService } from "./Helpers/chat.service";
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  providers: [Device]
})
export class AppComponent {
  signal_app_is: string = "1ed96fbb-309a-45f7-b57f-7765857369c0";
  firebase_id: string = "49046858639";
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private storage: Storage,
    private route: Router,
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready().then(() => { })
    this.statusBar.styleLightContent();
    this.statusBar.backgroundColorByHexString("#0e3083")
    // this.statusBar.styleDefault()
    this.pushSetUp();
    // await this.storage.get("clcDriverID").then(res => {
    //   console.log(res)
    //   if (res != undefined || res != null) {
    //     this.route.navigateByUrl("/tab1");
    //   }
    // })
    await this.splashScreen.hide();

    // this.deeplinks
    //   .route({
    //     "/": {} // this specifies the root of the app
    //   })
    //   .subscribe(
    //     match => {
    //       let param = match.$link.queryString; //this is the passed parameter from another application/website
    //     },
    //     err => {
    //       throw err
    //     }
    //   );
   
  }

  pushSetUp() {
    this.oneSignal.startInit(this.signal_app_is, this.firebase_id);
    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.InAppAlert
    );
    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(res => {
      // alert(res)
      // do something when a notification is opened
    });
    this.oneSignal.endInit();
  }
}
