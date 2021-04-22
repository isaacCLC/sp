import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertsProviderService } from "../../providers/alerts-provider.service";
import { ApiGateWayService } from '../../providers/api-gate-way.service';
import { Storage } from "@ionic/storage";
import { GeneralService } from '../../helpers/generals';
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
        this._api.changePassword({driverId:driverID,driverPassword:this.password1}).then(resp=>{
              alert("Password Updated Successfully");
              this.route.navigateByUrl("/app/tabs/tab1");
        })
       
      } else {
        this.alerts.presentAlert(
          "Oops...",
          "Password Missmatch",
          "Your Passwords Do Not Match"
        );
      }
    } else {
      this.alerts.presentAlert(
        "Oops...",
        "Enter Passwords",
        "Please Enter All Password Fields"
      );
    }
  }
}
