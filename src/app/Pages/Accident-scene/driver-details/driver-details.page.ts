import { Component, OnInit } from "@angular/core";
import { DriverDetails } from "../../../models/appModels";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Helpers } from '../../../Helpers/helpers';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiGateWayService } from "src/app/Providers/api-gate-way.service";
@Component({
  selector: "app-driver-details",
  templateUrl: "./driver-details.page.html",
  styleUrls: ["./driver-details.page.scss"]
})
export class DriverDetailsPage implements OnInit {
  driverDetails: DriverDetails = {
    name: null,
    surname: null,
    address: null,
    cellNum: null,
    email: null,
    occupation: null,
    driverLicenceImg: null,
    driverLicenceNum: null,
    driverLicenceCode: null,
    driverLicenceDateIssue: null,
    driverLicenceLearners: null,
    samaAsInsured: "No"
  };
  finalDestination: any
  constructor(private route: Router, private _api: ApiGateWayService, public navCtrl: NavController, private camera: Camera, private helpers: Helpers, private platform: Platform, private storage: Storage) { }

  ngOnInit() {
    /*  this.storage.get('finalDest').then((res) => {
        this.finalDestination = res; // res = [lat,lng]
  
      })*/
    this.finalDestination = [-25.864547, 28.167186]
  }

  async startTow() {
    this.storage.get("clcDriverID").then(driverID => {
      let payLoad = {
        driverId: driverID
      }
      this._api.checkServiceRequests(payLoad).subscribe(data => {
        this._api.acceptJob(driverID, data.data.serviceRequests.callId, "startTow").subscribe(response => {
          console.log(response)
          this.route.navigate(["app/tabs/tab1"]);
        })
      })
    })



    // await this.helpers.navigate(this.finalDestination);
  }

  goBack() {
    this.route.navigate(["the-insured"]);
  }

  samaAsInsured(evt: any) {
    if (evt.detail.checked == true) {
      this.driverDetails.samaAsInsured = "Yes";
    } else {
      this.driverDetails.samaAsInsured = "No";
    }
  }
  driverLicPhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.driverDetails.driverLicenceImg = "data:image/jpeg;base64," + imageData;
      },
      err => {
        // Handle error
      }
    );
  }
}
