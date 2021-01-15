import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Injectable } from "@angular/core";
import { myLoc } from "../models/appModels";
import { ToastController, Platform } from "@ionic/angular";
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { Network } from "@ionic-native/network/ngx";
import {
  LaunchNavigator,
  LaunchNavigatorOptions
} from "@ionic-native/launch-navigator/ngx";
import { GoogleMaps, GoogleMap, Marker } from "@ionic-native/google-maps";
import { AlertsProviderService } from "../Providers/alerts-provider.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Market } from "@ionic-native/market/ngx";
import { Storage } from "@ionic/storage";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
@Injectable()
export class Helpers {
  myloc: myLoc = {};

  hostPort = "3000";
  intervalId: any;
   devHost = "https://api.lmsystem.co.za"
  //prodHost = "http://localhost:" + this.hostPort;
  prodHost = "http://cca.lmsystem.co.za:" + this.hostPort;
  file: MediaObject;
  map: GoogleMap;
  webServer: any;
  disconnectSubscription: any;
  connectSubscription: any;
  clcLogo: string;
  loggedIn: boolean;
  public isNetworkAvailable: boolean = true;
  public storage: Storage;
  public SPIcon: any;
  public clientIcon: any;
  vehIcon: string;
  constructor(
    private geolocation: Geolocation,
    private toastCtrl: ToastController,
    private media: Media,
    private platform: Platform,
    private network: Network,
    private launchNavigator: LaunchNavigator,
    private camera: Camera,
    private alerts: AlertsProviderService,
    private market: Market,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode
  ) {
    this.platform.ready();
    this.connectedToNetwork();
    this.disconnectedFromNetwork();
    if (platform.is("android")) {
      //this.webServer = "http://cca.lmsystem.co.za:" + this.hostPort;
    } else {
    //  this.webServer = this.prodHost;
    }
    this.getIcons();
    this.clcLogo = "../../assets/ic_launcher.png";
  }

  private connectedToNetwork() {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log("network connected!");
      this.isNetworkAvailable = true;
    });
  }

  setLogInStatus(logInFlag: boolean): void {
    this.loggedIn = logInFlag;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  private disconnectedFromNetwork() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log("network disconnected!");
      this.isNetworkAvailable = false;
    });
  }

  // loadMap(lat: number, lng: number, zoomLevel: number) {
  //   this.map = GoogleMaps.create("map_canvas", {
  //     camera: {
  //       target: {
  //         lat: lat,
  //         lng: lng
  //       },
  //       zoom: zoomLevel
  //     }
  //   });
  // }

  // showMarker(markerTitle: any, lat: number, lng: number, icon?: any) {
  //   let marker: Marker = this.map.addMarkerSync({
  //     title: markerTitle,
  //     position: {
  //       lat: lat,
  //       lng: lng
  //     },
  //     icon: icon
  //   });
  //   marker.showInfoWindow();
  // }
  openMarketPlace(appName) {
    this.market.open(appName);
  }
  async getCurrentLocation() {  
    let latlng = {
      lat: null,
      lng: null
    };
    let currentPostion = await this.geolocation.getCurrentPosition({
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true
    }).catch(err=>{
      console.log(err);
      // currentPostion = false
      return err
    })
    console.log(currentPostion)
    // .then(resp => {
    //   latlng.lat = resp.coords.latitude;
    //   latlng.lng = resp.coords.longitude;
    // })
    // .catch(error => {
    //   latlng.lat = 0;
    //   latlng.lng = 0;
    //   console.log("Error getting location", error);
    // });
    return currentPostion;
  }

  async showToast(message: string, timeDuration: number) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: timeDuration,
      position: "middle"
    });

    toast.present();
  }

  async playSoundAlert(filePath, intervalTime) {
    this.file = this.media.create(this.webServer + filePath);
    this.intervalId = setInterval(() => {
      console.log(555555);
      this.file.play();
    }, intervalTime);
  }
  async stopSoundAlert() {
    if (this.file != undefined) {
      this.file.stop();
      clearInterval(this.intervalId);
      if (this.platform.is("android")) this.file.release();
    }
  }

  navigate(destination) {
    let options: LaunchNavigatorOptions = {
      start: "London, ON"
    };

    this.launchNavigator
      .navigate(destination)
      .then(
        success => console.log("Launched navigator"),
        error => console.log("Error launching navigator", error)
      );
  }

  getImage(isDeviceCamera: boolean, imgPath: string): string {
    let imageSource: any;
    if (isDeviceCamera) {
      imageSource = this.camera.PictureSourceType.CAMERA;
    } else {
      imageSource = this.camera.PictureSourceType.PHOTOLIBRARY;
    }
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: imageSource,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        imgPath = "data:image/jpeg;base64," + imageData;
        return imgPath;
      },
      err => {
        // Handle error
        this.alerts.presentAlert(
          "Picture Error",
          "Could Not Get Your Image, Try Again"
        );
      }
    );
    return imgPath;
  } //en

  enableBackground() {
    this.backgroundMode.enable();
  }
  disableBackground() {
    this.backgroundMode.disable();
  }
  isInBack(): boolean {
    return this.backgroundMode.isActive();
  }

  localPush() {
    this.localNotifications.schedule([
      {
        id: 1,
        title: "Help247 Incoming Request",
        text: "Request From Armandt Slabbert",
        icon:
          "https://cdn.iconscout.com/icon/free/png-256/car-location-find-navigate-gps-location-29571.png",
        sound: this.webServer + "/sounds/alert.mp3",
        actions: [
          {
            id: "accept",
            title: "Accept Request",
            needsAuth:true
          },
          {
            id: "decline",
            title: "Decline Request",
            needsAuth:true
          }
        ]
      }
    ]);
  }

  allocationPush(text: string) {
    this.localNotifications.schedule([
      {
        id: 2,
        title: "Job Allocation",
        text: text,
        icon:
          "https://cdn.iconscout.com/icon/free/png-256/car-location-find-navigate-gps-location-29571.png"
        //   sound: this.webServer + "/sounds/alert.mp3",
      }
    ]);
  }

  getIcons() {
    this.vehIcon =
      "https://cdn3.iconfinder.com/data/icons/logistic-delivery-bold-line-1/48/34-512.png";
    this.SPIcon = "https://www.rctcbc.gov.uk/SiteElements/Images/Icons/LidoMapMarkers/CarMarker.png"
    this.clientIcon =
      "https://cdn0.iconfinder.com/data/icons/map-markers-2-1/512/xxx002-512.png";
  }

  ionViewDidLeave() {
    alert("im out");
  }
}