import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { ApiGateWayService } from '../../Providers/api-gate-way.service';
import { Storage } from "@ionic/storage";
import { GeneralService } from '../../Helpers/generals';
@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.page.html",
  styleUrls: ["./update-password.page.scss"]
})
export class UpdatePasswordPage implements OnInit {
  passwordType: string = "password";
  passwordIcon: string = "eye-off";
  password1: any;
  password2: any;
  showPass: boolean; 
  showPass2: boolean; 
  _genService:GeneralService
  constructor(private storage: Storage,private route: Router, private alerts: AlertsProviderService,private _api:ApiGateWayService) {
this._genService = new GeneralService();
this.showPass = false ;
this.showPass2 = false ;
  }

  ngOnInit() {}

  
  hideShowPassword() { 
    this.showPass = !this.showPass; 
  }
  hideShowPassword2() { 
    this.showPass2 = !this.showPass2; 
  }

  async updatePass() {
    let driverID =  await this.storage.get("clcDriverID") 
    if (this.password1 != undefined && this.password2 != undefined) {
      if (this.password1 == this.password2) {
        this._api.changePassword({driverId:driverID,driverPassword:this.password1}).subscribe(resp=>{
              if(!resp.status){
                this.alerts.presentAlert(
                  this._genService.getGeneralError()['heading'],
                  this._genService.getGeneralError()['mainMessage']
                );
                return;
              }
               alert("Password Updated Successfully");
              this.
              route.navigateByUrl("login");
        })
       
      } else {
        this.alerts.presentAlert(
          "Password Missmatch",
          "Your Passwords Do Not Match"
        );
      }
    } else {
      this.alerts.presentAlert(
        "Enter Passwords",
        "Please Enter All Password Fields"
      );
    }
  }
}
