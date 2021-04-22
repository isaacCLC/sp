import { Component, OnInit } from "@angular/core";
import { NavController, Platform, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import * as launcher from "../../providers/start-app";
import { Helpers } from "../../helpers/helpers";
import { AppAvailability } from "@ionic-native/app-availability/ngx";
import { Storage } from "@ionic/storage";
import { ApiGateWayService } from "../../providers/api-gate-way.service";
import { AlertsProviderService } from "../../providers/alerts-provider.service";
import { OneSignal } from "@ionic-native/onesignal/ngx";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  imgSrc: any;
  loader: any;
  pushPlayerId: any;
  showPass: boolean;
  username: string;
  password: string;

  constructor(
    private route: Router,
    public navCtrl: NavController,
    private helpers: Helpers,
    private appAvailability: AppAvailability,
    private platform: Platform,
    private storage: Storage,
    private _api: ApiGateWayService,
    private loadingCtrl: LoadingController,
    private alerts: AlertsProviderService,
    private oneSignal: OneSignal,
  ) {
    this.showPass = false;
  }

  async ngOnInit() {
    this.imgSrc = "../../assets/ic_launcher.png";
    this.oneSignal.getIds().then(ids => {
      this.pushPlayerId = ids.userId;
    });
  }

  

  ionViewWillEnter() {
    this.storage.get("username").then(username => {
      this.username = username
    })
  }

  hideShowPassword() {
    this.showPass = !this.showPass;
  }

  async login() {
    this.loadingCtrl.create({
      message: "Logging In..."
    }).then(loader => {
      loader.present()
      let credentialObj = {
        userName: this.username,
        passWord: this.password,
        pushPlayerId: this.pushPlayerId
      };
      this._api.validateLogIn(credentialObj).subscribe(
        resp => {
          if (resp.status == true && resp.data.logIn == true) {
            this.storage.clear();
            this.storage.set("username", this.username)
            this.storage.set("driverID", resp.data.driverId)
            resp.data.loginCount == 1 ? this.route.navigateByUrl("update-password") : this.route.navigateByUrl("/app/tabs/tab1");
            loader.dismiss();
          }
        },
        err => {
          loader.dismiss();
          console.log(err.error.data.errorMessage)
          this.alerts.presentAlert(
            "Oops..",
            "Login Error",
            err.error.data.errorMessage
          );
        }
      );
    })
  }

  forgotPass() {
    this.route.navigateByUrl("forgot-password");
  }

  keyPress(keyCode) {
    console.log("Key pressed" + keyCode)
    if (!this.username || !this.password)
      return;

    if (keyCode == 13) { // user pressed enter
      this.login();
    }
  }

  launchExtApp() {
    let app: string;
    if (this.platform.is("ios")) {
      app = "help247://";
    } else if (this.platform.is("android")) {
      app = "com.help247";
    }
    this.appAvailability.check(app).then(
      (yes: boolean) => launcher.packageLaunch(app),
      (no: boolean) => {
        //  this.helpers.openMarketPlace("com.help247");
        if (this.platform.is("ios")) {
          this.helpers.openMarketPlace("id926823798"); //uses the app ID from the IOS app store
        } else {
          this.helpers.openMarketPlace("com.help247");
          // window.open(
          //   "https://play.google.com/store/apps/details?id=com.help247&hl=en_ZA",
          //   "_system"
          // );
        }
      }
    );
  }
}
