import { Component, OnInit } from "@angular/core";
import { Platform, LoadingController, ModalController } from "@ionic/angular";
import {JobDescModalPage } from '../../../Modals/job-desc-modal/job-desc-modal.page';
import { ApiGateWayService } from '../../../Providers/api-gate-way.service';
import { AlertsProviderService } from '../../../Providers/alerts-provider.service';
import { GeneralService } from '../../..//Helpers/generals';
import { Storage } from "@ionic/storage";
import { iJobHistory } from '../../../models/appModels';
@Component({
  selector: "app-tab4",
  templateUrl: "./tab4.page.html",
  styleUrls: ["./tab4.page.scss"]
})
export class Tab4Page implements OnInit {
  previousJobs: iJobHistory[];
  dateOption: any = "Last 3 Months"; 
  _generals:GeneralService = new GeneralService();
    driverDetails={
    driverId:null
  } 
  constructor(public loadingCtrl: LoadingController,private alertProvider : AlertsProviderService, private storage: Storage,private modalCtrl: ModalController, private _api:ApiGateWayService) {
     
  }

  async ngOnInit() {   
    this.previousJobs =   []; 
  }
  
  async ionViewWillEnter() { 
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present()
      this._api.getJobHistory().then(history=>{
        console.log(history)
        this.previousJobs = history.data.jobHistory;
        loader.dismiss()
       })
    })
  }

  optionsFn() {
    switch (this.dateOption) {
      case "2018":
        break;
      case "2017":
        break;
      case "Last 3 Months":
        break;
      case "Last 6 Months":
        break;
      default:
        break;
    }
  }

  getColor(status){
    console.log(status)
    if(status == 6 || status == 7 ||status == 8 ||status == 9){
      return "danger"
    }else{
      if(status == 12){
        return "success"
      }else{
        return "warning"
      }
    }
  }


  
  async showJobDetails() { 
    let modal = await this.modalCtrl.create({
      component: JobDescModalPage,
      componentProps: { jobDetails: {} }
    }); 
    return await modal.present();
  }
}
