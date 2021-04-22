import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Device } from "@ionic-native/device/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { AppLocation } from "./utils/app-location";
import { ServiceRequestsService } from "./utils/service-requests.service";

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
    public appLocation: AppLocation,
    public serviceRequestsService: ServiceRequestsService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString("#0e3083")
      this.pushSetUp();
      this.splashScreen.hide();
  
    })
 
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
