import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Helpers } from "../../../Helpers/helpers";
import { Storage } from "@ionic/storage";
import { iClaimDetails } from '../../../models/appModels';
@Component({
  selector: "app-accident-scene2",
  templateUrl: "./accident-scene2.page.html",
  styleUrls: ["./accident-scene2.page.scss"]
})
export class AccidentScene2Page implements OnInit { 
  carDetails = {
    carType: "",
    carMake: "",
    carModel: "",
    carRegNum: "",
    carImgPath: "",
    carColour: "",
    vinNum: "",
    engineNum: ""
  };
  claimDetails:iClaimDetails;
  constructor(
    private route: Router,
    private camera: Camera,
    private helpers: Helpers,
    private storage: Storage
  ) {}

  async ngOnInit() {
   
  }

 async ionViewWillEnter(){
    
  await this.storage.get("clcBarcodeData").then(val => { 
    if (val != null && val.text) {
      let receivedData: string = JSON.stringify(val.text);
      let data = new Array();
      data = receivedData.split("%");
      this.carDetails.carRegNum = data[6];
      this.carDetails.carType = data[8];
      this.carDetails.carMake = data[9];
      this.carDetails.carModel = data[10];
      this.carDetails.carColour = data[11];
      this.carDetails.vinNum = data[12];
      this.carDetails.engineNum = data[13];
      // this.claimDetails.clientVehicle.registrationNumber = data[6];
      // this.claimDetails.clientVehicle.vehicleType = data[8];
      // this.claimDetails.clientVehicle.makeDescription = data[9];
      // this.claimDetails.clientVehicle.model = data[10];
      // this.claimDetails.clientVehicle.vehicleColour =data[11];
      // this.claimDetails.clientVehicle.vehicleVinNumber =  data[12];
      //  this.claimDetails.clientVehicle.vehicleEngineNumber = data[13];
      //  console.log(this.claimDetails)
      this.storage.remove("clcBarcodeData");
    }
  }); 
  await this.storage.get("claimDetails").then(val=>{  
    if(val != null)
    {
      this.claimDetails = val;  
    }
    
  })
  }
  nextPage() {
    console.log(this.carDetails.carMake.length);
    // this.route.navigateByUrl("accident-scene3");
   
      this.route.navigate(['scene-information']);
    
  }

  takePhoto() {
    this.helpers.getImage(false, this.carDetails.carImgPath);
  }
  goBack() {
    this.route.navigateByUrl("accident-scene1");
  }
}
