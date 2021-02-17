
import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DeviceInfo } from './device-info';

@Injectable({
    providedIn: 'root',
})
export class PopupHelper {
    constructor(private iab: InAppBrowser, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private device: DeviceInfo) {

    }

    loader: any;
    loading: boolean;

    async showLoading(message: string) {
        console.log("Showing loader")
        if(!this.loading){
            this.loading = true;
            console.log("Loader is"+this.loading)
            this.loader = await this.loadingCtrl.create({
                message: message,
                translucent: false
            });
            await this.loader.present();
        }
       

        return this.loader
    }

    async dismissLoading() {
        console.log("Dismissing loader")
        if (this.loader) {
            this.loading = false;
            return await this.loader.dismiss();
        }
        else {
            this.loading = false;
            console.log("popup-helper: dismissLoading called with no loader!");
            return await this.loader.dismiss();
        }
    }

    showAlert(title: string, subTitle: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            const alert = await this.alertCtrl.create({
                header: title,
                subHeader: subTitle,
                buttons: ['OK'],
                translucent: false
            });

            alert.onDidDismiss().then(() => {
                resolve(true);
            });
            await alert.present();
        });
    }

    showError(subTitle: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            const alert = await this.alertCtrl.create({
                header: "There was a problem",
                subHeader: subTitle,
                buttons: ['OK'],
                translucent: false
            });

            alert.onDidDismiss().then(() => {
                resolve(true);
            });
            await alert.present();
        });
    }

    showHelpError(subTitle: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            const alert = await this.alertCtrl.create({
                header: "There was a problem",
                subHeader: subTitle,
                buttons: [
                    {
                      text: 'HELP',
                   
                      handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                        this.iab.create("http://www.africau.edu/images/default/sample.pdf", '_system');
                      }
                    }, {
                      text: 'OK',
                      role: 'cancel',
                      handler: () => {
                        console.log('Confirm Okay');
                      }
                    }
                  ],
                translucent: false
            });

            alert.onDidDismiss().then(() => {
                resolve(true);
            });
            await alert.present();
        });
    }


    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 4500,
            translucent: false,
        });
        await toast.present();
    }

    async showAlertWithCallback(title: string, subTitle: string, callback: () => void) {
        const alert = await this.alertCtrl.create({
            header: title,
            subHeader: subTitle,
            buttons: [
                {
                    text: "OK",
                    handler: () => {
                        callback();
                    }
                }]
        });
        await alert.present();
    }

    async showConfirm(title: string, subTitle: string, buttonConfirm: string, callbackConfirm: () => void, buttonCancel: string, callbackCancel: () => void) {
        let alert = await this.alertCtrl.create({
            header: title,
            subHeader: subTitle,
            buttons: [
                {
                    text: buttonConfirm,
                    handler: () => {
                        if (callbackConfirm)
                            callbackConfirm();
                    }
                },
                {
                    text: buttonCancel,
                    role: 'cancel',
                    handler: () => {
                        if (callbackCancel)
                            callbackCancel();
                    }
                }
            ]

        });
        await alert.present();
    }
}