import { Component } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { AlertsProviderService } from "../../../Providers/alerts-provider.service";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router"; 
import { GeneralService } from '../../../Helpers/generals';
import { ApiGateWayService } from "src/app/Providers/api-gate-way.service";
import { LoadingController } from "@ionic/angular";
@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page { 
  userProfile: any = [];
  private _genService:GeneralService
  constructor(
    private camera: Camera,
    private alerts: AlertsProviderService,
    private storage: Storage,
    private route: Router,
    private _api: ApiGateWayService,
    public loadingCtrl: LoadingController,
  ) { 
   this._genService = new GeneralService()
  }

  async ngOnInit() { 
    // this.storage.get('clcSPDetails').then((res)=>{  
    //   this.userProfile.myphoto = res.driverImageUrl
    //   this.userProfile.name = res.driverFirstName;
    //   this.userProfile.surname = res.driverLastName;
    //   this.userProfile.address =
    //     "Unit 23, Cambridge Office Park, 5 Bauhinia St, Highveld Techno Park";
    //   this.userProfile.cell = res.driverContactNumber;
    //   this.userProfile.company = res.serviceProviderName;
    //   this.userProfile.password = "P@ssword123";
    // })
  }
  async ionViewWillEnter() { 
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present()
      this.storage.get("clcSPDetails").then(res => {
        this._api.getSPDetails(res.driverId).subscribe(spDetails => {
          console.log(spDetails)
          this.userProfile = spDetails.data[0];
          loader.dismiss()
        })
      });
    })
   

    // await  this.storage.get("clcrequestResponse").then(res => { 
    //   if (res != null || res != undefined) {
    //     this.route.navigate(["app/tabs/tab1"]);
    //  //   this.storage.remove("clcrequestResponse")
    //   }
    // }); 
    // await  this.storage.get("navToFinDist").then(res => { 
    //   if (res != null || res != undefined) {
    //     this.route.navigate(["app/tabs/tab1"]);
    //  //   this.storage.remove("clcrequestResponse")
    //   }
    // }); 

    // await this.storage.get("callComplete").then(res=>{
    //   if(res != null || res != undefined)
    //   this.route.navigate(["app/tabs/tab1"]);
    // })
  }

  updateProfile() {
    console.log(this.userProfile);
  }
  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      //  sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.userProfile.myphoto = "data:image/jpeg;base64," + imageData;
      },
      err => {
        // Handle error
        this.alerts.presentAlert("Picture Error", "Could Not Get Your Image");
      }
    );
  } //end
}
