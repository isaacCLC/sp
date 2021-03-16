import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, ModalController, LoadingController, IonItemSliding } from "@ionic/angular";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { GeneralService } from "../../Helpers/generals";
import { Storage } from "@ionic/storage";
import { load } from "google-maps";
import { Router } from "@angular/router";
import { not } from "@angular/compiler/src/output/output_ast";
import { DriverDetails } from "src/app/models/appModels";
import { FaqItem } from "src/app/components/accordion/app-accordion.component";
@Component({
  selector: "app-modal",
  templateUrl: "./modal.page.html",
  styleUrls: ["./modal.page.scss"]
})
export class ModalPage implements OnInit {
  data: any;
  questions: any;
  notifications: NotificationData[] = [];
  loader: any;
  driverDetails: DriverDetails;
  age: any[] = [];
  _genServices = new GeneralService();
  items: FaqItem[] = [];
  termsAndConditions: any;
  contactInfo: any;
  constructor(
    private storage: Storage,
    private params: NavParams,
    private modalCtrl: ModalController,
    private alertProvider: AlertsProviderService,
    private loadingCtrl: LoadingController,
    private _api: ApiGateWayService,
    private route: Router,
  ) {

  }
  async ngOnInit() {
    this.data = this.params.get("dataProperties")
    this.loadingCtrl.create({
      message: "Loading..."
    }).then(loader => {
      loader.present();
      this._api.getDriver().then(res => {
        this.driverDetails = res.data[0];
        
        if (this.data.heading == "Frequently Asked Question") {
          this._api.getFAQs().subscribe((response) => {
            response.body.data.forEach(element => {
              let item: FaqItem = {
                body: element.faqAnswer,
                expanded: false,
                heading: element.faqQuestion
              }
              this.items.push(item);
            });
            loader.dismiss();
          })
        }

        if (this.data.heading == "Notifications") {
          this.getNotifications().then(() => {
            loader.dismiss();
          })
        }

        if (this.data.heading == "Terms and Conditions") {
          this._api.getTerms({ driverId: this.driverDetails.driverId }).then((response) => {
            console.log(response)
            this.termsAndConditions = response.data.termsAndConditions
            loader.dismiss();
          })
        }

        if (this.data.heading == "Contact Information") {
          this._api.getContactInfo().subscribe((response) => {
            console.log(response)
            this.contactInfo = response.body.data.content
            loader.dismiss();
          })
        }

      });
    })


  }

  async getNotifications() {
    let notifications = await this._api.viewNotifications()
    this.notifications = notifications.body.data
    for (let i = 0; i < this.notifications.length; i++) {
      this.age.push(this._genServices.timeBetweenTwoDates(new Date(this.notifications[i]["dateSent"])))
      this.notifications[i]['age'] = this._genServices.timeBetweenTwoDates(new Date(this.notifications[i]["dateSent"]))
    }
  }

  doRefresh(e) {
    this.getNotifications().then(() => {
      e.target.complete();
    })
  }

  async clearAllNotifications() {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present();
      this.clearAll().then(() => {
        loader.dismiss();
      })
    })


  }

  async clearAll() {
    while (this.notifications.length > 0) {
      this.notifications.forEach(notification => {
        this._api.clearNotification(notification.notificationId).subscribe()
      });
      let response = await this._api.viewNotifications()
      if (response.status) {
        this.notifications = response.body.data;
      }
    }
    return
  }

  async clearNotification(e, notification: NotificationData) {
    this.loadingCtrl.create({
      message: "Please wait..."
    }).then(loader => {
      loader.present();
      this._api.clearNotification(notification.notificationId).subscribe(() => {
        this.getNotifications().then(() => {
          loader.dismiss();
        })
      })
    })
  }

  doAction(e, notification: NotificationData) {
    if (!notification.hasRead) {
      this.loadingCtrl.create({
        message: "Please wait..."
      }).then(loader => {
        loader.present()
        this._api.readNotification(notification.notificationId).subscribe(() => {
          if (notification.callRef && notification.action == 'serviceRequest') {
            loader.dismiss();
            this.modalCtrl.dismiss()
            this.route.navigate(["app/tabs/tab1"]);
          } else {
            this.getNotifications().then(() => {
              loader.dismiss();
            })
          }
        })
      })
    }
  }

  closemodal() {
    this.modalCtrl.dismiss();
  }
}

export interface NotificationData {
  notificationId: number;
  action: string;
  callRef: string;
  message: string;
  title: string;
  messageTitle: string;
  hasRead: boolean;
  dateSent: string;
}
