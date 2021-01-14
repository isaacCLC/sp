import { Component, OnInit, ViewChildren } from "@angular/core";
import { Platform, LoadingController, ModalController, IonItemSliding, IonButton } from "@ionic/angular";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { GeneralService } from "../../Helpers/generals";
import { AlertsProviderService } from '../../Providers/alerts-provider.service';
import { load } from 'google-maps';
import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';

@Component({
  selector: "app-select-tel-number",
  templateUrl: "./select-tel-number.page.html",
  styleUrls: ["./select-tel-number.page.scss"]
})
export class SelectTelNumberPage {
  contactDetails: any;
  cellNum: string;
  enaableBth: boolean;
  cellValid: boolean;
  loader: any;
  selectedNumber: any;
  isNumSelected: boolean;
  generals: GeneralService;
  spDetails: any;
  isNumDefault: boolean = false;
  @ViewChildren(IonItemSliding) slidingItems: any;
  alreadyVerified = []
  radioValue: any;

  constructor(
    private route: Router,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private _api: ApiGateWayService,
    private activatedRoute: ActivatedRoute,
    private alertProvider: AlertsProviderService,
  ) {
    this.contactDetails = new Array();
    this.generals = new GeneralService();
    //  this.contactDetails = []
    this.alreadyVerified
    console.log(this.alreadyVerified.includes(this.selectedNumber))
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params)
      this.alreadyVerified.push(params['verified'])
    });
  }


  async ionViewDidEnter() {
    console.log("View inited")
    let firstTime = true;
    this.slidingItems.changes.subscribe((change) => {
      if (firstTime) {
        firstTime = false;
        console.log("Change happened")
        // console.log(this.slidingItems)
        let counter = 0;
        this.slidingItems.forEach(element => {
          setTimeout(() => { element.open() }, 100)
          counter = counter + 500
          setTimeout(() => { element.close() }, counter)
        });
      }
    });
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      this.storage.get("clcDriverID").then(res => {
        let driverID = res;
        this._api.getSPDetails(driverID).subscribe(
          res => {
            this.spDetails = res.data[0]
            console.log(this.contactDetails)
            if (this.spDetails.driverContactNumber) {
              this.contactDetails = [this.spDetails.driverContactNumber]
            }
            this.spDetails.driverAlternativeNumbers.forEach(element => {
              if (element.mobileNumber != this.spDetails.driverContactNumber) {
                this.contactDetails.push(element.mobileNumber)
              }
            })
            this.enaableBth = false;
            this.cellValid = true;
            this.isNumSelected = false;
            loader.dismiss()

          }, err => {
            console.log(err);
            this.alertProvider.presentAlert("Getting numbers error", "Something Went Wrong, Please Try Again")
          })
      });
    })

  }

  // ngAfterViewInit(){

  // }



  onKeyCellpress(evt: any) {
    if (this.cellNum != undefined) {
      if (this.cellNum.length >= 9) {
        this.enaableBth = true;
      } else {
        this.enaableBth = false;
      }
    }
  }

  // mcqAnswer(e) {
  //   console.log(this.radioValue)
  //   console.log("Selecting new number")
  //   console.log(e)
  //   this.selectedNumber = e;
  //   this.isNumSelected = true;
  //   console.log(this.alreadyVerified)
  //   console.log(this.alreadyVerified.includes(e))

  // }

  async selectCellNumber(verifired: boolean) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      if (verifired) {
        this._api.addDiverNumber({
          mobileNumber: this.selectedNumber,
          driverId: this.spDetails.driverId,
          useNumber: true
        }).then((response) => {
          loader.dismiss()
          if (response.status) {
            this.route.navigate(["app/tabs/tab3"]);
          }
        })
      } else {
        this.verifyNumber(this.selectedNumber, true, loader)
      }
    })
  }

  verifyNumber(number, confirmOnly: boolean, loader: any) {
    number = number.replace(/^(.{3})(.{3})(.*)$/, "$1 $2 $3").split(" ").join("");
    console.log(number)
    this._api.getOTP(this.spDetails.driverId, number).subscribe(
      otpData => {
        loader.dismiss()
        if (otpData.body.status == true) {
          this.route.navigate(["add-number-otp"], {
            queryParams: {
              confirm: confirmOnly,
              cellNum: number,
              default: this.isNumDefault
            }
          });
          this.cellNum = "";
        } else {
          alert("Something Went Wrong, Please Try Again");
        }
      }, err => {
        console.log(err)
        loader.dismiss()
        this.alertProvider.presentAlert("OTP Error", "Something Went Wrong, Please Try Again")
      })
  }


  async addCellNum() {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present()
      let exisits = false;
      this.contactDetails.forEach(element => {
        if (element == this.cellNum) {
          exisits = true;
        }
      });
      if (!exisits) {
        if (this.generals.validateCell(this.cellNum)) {
          this.cellValid = true;
          this.cellNum = this.cellNum
          this.verifyNumber(this.cellNum, false, loader)
        } else {
          loader.dismiss();
          this.cellValid = false;
        }
      } else {
        loader.dismiss();
        this.alertProvider.presentAlert("Duplicate Error", "This number already exists. Please select it on the list")
      }

    })

  }

  makeDefaulCheck(evt: any) {
    //code to make cell number default
    this.isNumDefault = true;
  }


  removeNumber(i: number) {
    let details = {
      mobileNumber: this.contactDetails[i],
      driverId: this.spDetails.driverId,
      setInvalid: true
    }

    this._api.addDiverNumber(details).then(res => {
      if (res.status && res.data.updatedContact) {
        if (i = this.selectedNumber) {
          this.selectedNumber = ""
        }
        this._api.getSPDetails(details.driverId).subscribe( //reload API and fetch updated contact details
          res => {
            this.spDetails = res.data[0]
            this.contactDetails = [];
            this.contactDetails = [this.spDetails.driverContactNumber];
            this.spDetails.driverAlternativeNumbers.forEach(element =>
              this.contactDetails.push(element.mobileNumber));

            //   console.log(this.contactDetails)
          })
        this.alertProvider.presentAlert("Info", "Cell number has been removed")
      }
    });

  }


}
