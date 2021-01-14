import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { InsuredDetails, JobCall } from 'src/app/models/appModels';

@Component({
  selector: 'app-the-insured',
  templateUrl: './the-insured.page.html',
  styleUrls: ['./the-insured.page.scss'],
})
export class TheInsuredPage implements OnInit {
insuredDetails:InsuredDetails = {
  policyNum : null,
  idNum :null,
  name :null,
  surname:null,
  address:null,
  cellNum:null,
  email:null,
  occupation:null 
} 
jobCall:JobCall={}
  constructor(private route:Router, private storage:Storage) { 
     this.insuredDetails.idNum = 999;
     this.insuredDetails.policyNum ="rf4"; 
     this.insuredDetails.name= "Tom";
     this.insuredDetails.surname = "Musk";
     this.insuredDetails.email = "tom@musk.com"
    
  }

  ngOnInit() { 

  }

  ngAfterViewInit() {
  
  }

  postInsuredDetails(){
    console.log(this.insuredDetails)
    this.route.navigate(["driver-details"]);
  }
  goBack(){
this.route.navigate(["vehicle-checklist"]);
  }
}
