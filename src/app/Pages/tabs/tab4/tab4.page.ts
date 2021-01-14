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
  constructor(private alertProvider : AlertsProviderService, private storage: Storage,private modalCtrl: ModalController, private _api:ApiGateWayService) {
     
  }

  async ngOnInit() {   
    this.previousJobs =   []; 
  }
  
  async ionViewWillEnter() { 
    this.storage.get("clcDriverID").then(id=>{ 
      this.driverDetails.driverId = id; 
      this.getJobs(this.driverDetails);
    }) 
  }

  async getJobs(driverDetails){  
   let response = await  this._api.getJobHistory(driverDetails) ;
   if(response && response.status == true) {  
     if(response.data.jobHistory.length == 0){
      this.previousJobs = []; 
     }
     else{
       this.previousJobs = response.data.jobHistory;
     }
   }else{
     console.log(response)
    this.alertProvider.presentAlert(this._generals.getGeneralError()["heading"],this._generals.getGeneralError()["mainMessage"]  );
        return;
   } 
  }

  optionsFn() {
    switch (this.dateOption) {
      case "2018":
        this.previousJobs = [
          { id: 1, desc: "Vehicle Tow  ", service: "", date: "2018-Dec-01" }
        ];
        this.previousJobs = [  ];
        break;
      case "2017":
        this.previousJobs = [
          { id: 1, desc: "Vehicle Tow  ", service: "", date: "2017-Feb-28" },
          { id: 1, desc: "Vehicle Tow  ", service: "", date: "2017-Jan-12" },
          { id: 1, desc: "Vehicle Tow  ", service: "", date: "2017-Nov-23" }
        ];
        this.previousJobs = [  ];
        break;
      case "Last 3 Months":
        this.previousJobs = [
          { id: 1, desc: "Vehicle Tow", service: "", date: "2019-July-01" },
          { id: 1, desc: "Plumbing Work", service: "", date: "2019-June-11" },
          {
            id: 1,
            desc: "Locksmith Services",
            service: "",
            date: "2019-June-21"
          },
          { id: 1, desc: "Vehicle Tow", service: "", date: "2019-May-31" }
        ];
        this.previousJobs = [  ];

        break;
      case "Last 6 Months":
        this.previousJobs = [];
        break;

      default:
        break;
    }

    console.log(this.dateOption);
  }


  
  async showJobDetails() { 
    let modal = await this.modalCtrl.create({
      component: JobDescModalPage,
      componentProps: { jobDetails: {} }
    }); 
    return await modal.present();
  }
}
