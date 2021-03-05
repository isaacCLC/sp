import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ModalPageModule } from "./Modals/modal/modal.module";
import { RequestModalPageModule } from "./Modals/request-modal/request-modal.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { Helpers } from "./Helpers/helpers";
import { HttpClientModule } from "@angular/common/http";
import { Media } from "@ionic-native/media/ngx";
import { JobDescModalPageModule } from "./Modals/job-desc-modal/job-desc-modal.module";
import { Network } from "@ionic-native/network/ngx";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";
import { Market } from "@ionic-native/market/ngx";
import { AppAvailability } from "@ionic-native/app-availability/ngx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { File } from "@ionic-native/file/ngx";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AgmCoreModule } from '@agm/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { ClaimManager } from "./Helpers/claim-manager";
import { Device } from "@ionic-native/device/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MediaManager } from "./utils/media-manager";
import { FilePath } from "@ionic-native/file-path/ngx";
import { FileUtil } from "./utils/file-util";
import { MediaCapture } from "@ionic-native/media-capture/ngx";
import { PusherProvider } from "./Providers/pusher/pusher";

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalPageModule,
    RequestModalPageModule,
    JobDescModalPageModule,
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBo-0cSqDB1H3mAsfJEdnyhTu0vrBGXsy0'
    }),
    GooglePlaceModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Helpers,
    Geolocation,
    Camera,
    Network,
    BackgroundMode,
    LaunchNavigator,
    Insomnia,
    Media,
    Market,
    AppAvailability,
    CallNumber,
    BarcodeScanner,
    LocalNotifications,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    PhotoViewer,
    SmsRetriever,
    LocationAccuracy ,
    ClaimManager,
    Device,
    InAppBrowser,
    MediaManager,
    FilePath,
    FileUtil,
    MediaCapture,
    PusherProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
