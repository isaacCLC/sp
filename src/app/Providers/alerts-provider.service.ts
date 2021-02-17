import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})
export class AlertsProviderService {
  constructor(public alertController: AlertController) {}

  async presentAlert(subHeader: string, msg: string, header: string) {
    const alert = await this.alertController.create({
      header: subHeader,
      subHeader: msg ,
      message: header,
      buttons: ["OK"],
      backdropDismiss: false
    });

    await alert.present();
  }
  async presentAlertConfirm(
    header: string,
    message: string,
    btn1txt: string,
    btn2txt: string,
    continueFunc:any,
    dismissFunc:any
  ) {
    let myOption;
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: btn1txt,
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
            myOption = btn1txt;
            return blah;
          }
        },
        {
          text: btn2txt,
          handler: () => {
            myOption = btn1txt;
            console.log("Confirm Okay");
            return myOption;
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  async presentPrompt() {
    let alert = await this.alertController.create({
      header: 'Send Message',
      inputs: [
        {
          name: 'message',
          placeholder: 'type message here', 
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            //call api to send message
            console.log(data)
          }
        }
      ],
      backdropDismiss: false
    });
    alert.present();
  }
}
