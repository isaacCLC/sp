import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { AppStorage } from 'src/app/Helpers/app-storage';
import { ClaimCall, ClaimManager, ClaimTypeId, CurrentClaim } from 'src/app/Helpers/claim-manager';
import { PopupHelper } from 'src/app/Helpers/popup-helper';
import { SignatureCapturePage } from 'src/app/Modals/signature-capture/signature-capture.page';
import { BaseMessage } from 'src/app/models/appModels';
import { ApiGateWayService } from 'src/app/Providers/api-gate-way.service';
import { FormParameter } from 'src/app/Providers/base';
import { ClaimOperation, DocType } from 'src/app/Providers/claim-operation';


@Component({
  selector: 'app-motoraccident-overview',
  templateUrl: 'motoraccident-overview.page.html',
  styleUrls: ['motoraccident-overview.page.scss'],
})
export class MotorAccidentOverviewPage implements OnInit {
  progress: AccidentClaimProgress = new AccidentClaimProgress();
  claimId: string = '';
  stillToComplete: number = 10;
  insuredSignature: boolean;
  driverSignature: boolean;
  driverIsInsured: boolean;
  claim: CurrentClaim = new CurrentClaim();

  constructor(private navCtrl: NavController, private modalController: ModalController, private appStorage: AppStorage,
    private _api: ApiGateWayService,
    private route: ActivatedRoute, private popup: PopupHelper, private claimOperation: ClaimOperation, private claimManager: ClaimManager) {


  }




  async ngOnInit() {
    this.claimId = await this.claimManager.getClaimId();

    await this.getClaim();
    this.checkProgress();
    this.countStillToComplete();
  }

  async ionViewWillEnter() {
    await this.getClaim();
    this.checkProgress();
    this.countStillToComplete();
  }

  async getClaim() {
    let claims = await this.claimManager.getClaims();
    this.claim = claims.get(this.claimId);
  }

  checkProgress() {
    if (this.claim.images && this.claim.images.insuredSignature && this.claim.images.insuredSignature.length > 0)
      this.insuredSignature = true;
    if (this.claim.images && this.claim.images.driverSignature && this.claim.images.driverSignature.length > 0)
      this.driverSignature = true;

    this.progress.section1 = this.claim.completed.indexOf(0) > -1;
    this.progress.section2 = this.claim.completed.indexOf(1) > -1;
    this.progress.section3 = this.claim.completed.indexOf(2) > -1;
    this.progress.section4 = this.claim.completed.indexOf(3) > -1;
    this.progress.section5 = this.claim.completed.indexOf(4) > -1;
    this.progress.section6 = this.claim.completed.indexOf(5) > -1;
  }

  countStillToComplete() {
    this.stillToComplete = 0;
    this.stillToComplete += Number(!this.progress.section1);
    this.stillToComplete += Number(!this.progress.section2);
    this.stillToComplete += Number(!this.progress.section3);
    this.stillToComplete += Number(!this.progress.section4);
    this.stillToComplete += Number(!this.progress.section5);
  }

  driverIsInsuredChange(ev) {
    this.driverSignature = this.driverIsInsured;
  }

  async captureInsuredSignature() {
    const modal = await this.modalController.create({
      component: SignatureCapturePage,
      componentProps: {
        signatureData: this.claim.images.insuredSignature
      }
    });
    await modal.present();
    let response = await modal.onDidDismiss();
    if (response.data) {
      this.claim.images.insuredSignature = response.data;
      this.insuredSignature = true;
    }
  }

  async captureDriverSignature() {
    const modal = await this.modalController.create({
      component: SignatureCapturePage,
      componentProps: {
        signatureData: this.claim.images.driverSignature
      }
    });
    await modal.present();
    let response = await modal.onDidDismiss();
    if (response.data) {
      this.claim.images.driverSignature = response.data;
      this.driverSignature = true;
    }
  }

  startClaim() {
    // find which is the next section to start from
    this.navCtrl.navigateForward('/motoraccident/step1');
  }


  async submitClaim() {
    // Submit claim
    await this.popup.showLoading('Submitting...');
    this._api.checkServiceRequests().then(data => {
      let response;
      if (data.data.finalDestination.latitude) {
        response = "startTow"
      } else {
        response = "noFD"
      }
      console.log(this.claim)

      this._api.acceptJob(data.data.serviceRequests.callId, response, data.data.serviceRequests.callRef, this.claim).then(response => {
        this.popup.dismissLoading();
        this.popup.showConfirm("Upload Media?", "", "ON WiFi connection", () => {
          this.claim.uploadOnWifi = true;
          this.navCtrl.navigateRoot('/app/tabs/tab1', { animated: true });
        }, "Upload Now", () => {
            this.claimOperation.submitImages(data.data.serviceRequests.callId, this.claim).then(response => {
              this.claimManager.deleteClaim(this.claimId);
            })
            this.navCtrl.navigateRoot('/app/tabs/tab1', { animated: true });
        }, "Media files can be uploaded when you are connected to a WiFI network.");

      })
    })
    // this._api.addClaim(this.claim).then(response=>{
    //   console.log(response)
    //    // if (!response.status) {
    //   //   this.popup.dismissLoading();
    //   //   this.popup.showError(response.error.errorMessage);
    //   //   return;
    //   // }
    //   // this.claim.call.callRef = response.data[0].callRef;
    //   // let callId = response.data[0].callId;
    //   // this.claimManager.updateClaims(this.claimId, this.claim);

    // })


  }




  async deleteClaim() {
    this.navCtrl.navigateRoot('/app/tabs/tab1', { animated: true });

    // await this.popup.showConfirm("Return to ?", "This will permanently delete this claim", 'Yes', async () => {
    //   await this.claimManager.deleteClaim(this.claimId);
    //   await this.popup.showToast('Your claim has been deleted');
    // }, 'Not yet', null);
  }


  continue() {
    if (!this.claim.completed || this.claim.completed.length <= 0) {
      this.navCtrl.navigateForward('/motoraccident/step1');
    }
    else {
      for (let index = 0; index < (this.claim.isThirdParty ? 10 : 8); index++) {
        if (this.claim.completed[index] == undefined) {
          this.navCtrl.navigateForward('/motoraccident/step' + (index + 1));
          break;
        }
        else if (this.claim.completed[index] != index) {
          if (!this.claim.isThirdParty && index == 7) {
            this.navCtrl.navigateForward('/motoraccident/step10');
            break;
          }
          else {
            this.navCtrl.navigateForward(`/motoraccident/step${index + 1}`);
            break;
          }
        }
      }
    }
  }

}



export class AccidentClaimProgress {
  section1: boolean;
  section2: boolean;
  section3: boolean;
  section4: boolean;
  section5: boolean;
  section6: boolean;
}