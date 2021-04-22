import { Component, OnInit } from "@angular/core";
import { Helpers } from "../../helpers/helpers";
import { Router } from "@angular/router";
import { GeneralService } from "../../helpers/generals";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"]
})
export class ForgotPasswordPage implements OnInit {
  imgLogo: string;
  isCellValid: boolean;
  private generals: GeneralService;
  constructor(private helpers: Helpers, private route: Router) {
    this.generals = new GeneralService();
    this.imgLogo = this.helpers.clcLogo;
    this.isCellValid = true;
  }
  async ionViewWillEnter() {}
  ngOnInit() {}
  goToHome() {
    this.route.navigate(["login"]);
  }

  resetPassword(details: any) {
    if (this.generals.validateCell(details.value.cellNumber)) {
      this.isCellValid = true;
    } else {
      this.isCellValid = false;
    } 
  }
}
