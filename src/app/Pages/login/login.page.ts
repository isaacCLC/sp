import { Component, OnInit } from "@angular/core";
import { NavController, Platform, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import * as launcher from "../../Providers/start-app";
import { Helpers } from "../../Helpers/helpers";
import { AppAvailability } from "@ionic-native/app-availability/ngx";
import { Storage } from "@ionic/storage";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
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
    private oneSignal: OneSignal
  ) {
    this.showPass = false;
  }

  async ngOnInit() {
    this.imgSrc = "../../assets/ic_launcher.png";
    this.oneSignal.getIds().then(ids => {
      console.log("Push player id")
      this.pushPlayerId = ids.userId;
      console.log(this.pushPlayerId )
    });
   
    
  }

  ionViewWillEnter() {
    this.storage.remove("isVehicleSet");
    this.storage.remove("_setCarFinalStage");
    this.storage.get("username").then(username=>{
      console.log("Username is"+ username)
      this.storage.clear()
      this.username = username
    })
  }

  hideShowPassword() { 
    this.showPass = !this.showPass; 
  }

  async login(data: any) {
    this.loader = await this.loadingCtrl.create({
      message: "Logging In..."
    });
    await this.loader.present();
    // let credentialObj = {
    //   userName: "8012195041089",
    //   passWord: "test",
    //   pushPlayerId:this.pushPlayerId
    // };

    let credentialObj = {
      userName: data.form.value.username,
      passWord: data.form.value.password,
      pushPlayerId: this.pushPlayerId
    };
    let isLoginValid = false;
    if (this.helpers.isNetworkAvailable == true) { 
      await this._api.validateLogIn(credentialObj).subscribe(
        resp => {
          console.log(resp.data)
          this.helpers.setLogInStatus(resp.data.logIn);
          if (resp.status == true && resp.data.logIn == true) { 
            console.log("Setting username to:"+ data.form.value.username)
            this.storage.set("username", data.form.value.username)
            isLoginValid = true;
            let driverID = resp.data.driverId; 
            // if (1 == 1) {
            if (resp.data.loginCount == 1) {
              this.storage.set("clcDriverID", driverID).then(() => {
                this.route.navigateByUrl("otp-page");
              });
            } else {
              this.storage.set("clcDriverID", driverID).then(() => {
                this.route.navigateByUrl("/app/tabs/tab1");
              });
            }
          } else {
            console.log("Login Error");
            isLoginValid = false;
          }

          this.loader.dismiss();
        },
        err => {
          this.loader.dismiss();
          isLoginValid = false;
          this.alerts.presentAlert(
            "Login Error",
            "Incorrect username or password"
          );
          return false;
        }
      );
    } else {
      this.loader.dismiss();
      alert("Please check your internet connection");
    }
    //  this.loader.dismiss();
  }

  forgotPass() {
    this.route.navigateByUrl("forgot-password");
  }

  // keyPress(keyCode) {
  //   if (!this.loginForm.valid)
  //     return;

  //   if (keyCode == 13) { // user pressed enter
  //     this.signIn();
  //   }
  // }

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
