import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController, LoadingController } from "@ionic/angular";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker } from "@ionic-native/google-maps";
import { AlertsProviderService } from "../../Providers/alerts-provider.service";
@Component({
  selector: "app-request-modal",
  templateUrl: "./request-modal.page.html",
  styleUrls: ["./request-modal.page.scss"]
})
export class RequestModalPage implements OnInit {
  reqAccepted: boolean;
  clientDetails: any = {};
  clientFullAddress: any;
  distance: any = 0;
  map: GoogleMap;
  imgSrc: any;
  gotToTns: boolean;
  termsState: string;
  loader: any;
  spDetials: any;
  constructor(
    private _api: ApiGateWayService,
    private modalCtrl: ModalController,
    private params: NavParams,
    private helpers: Helpers,
    private alertProvider: AlertsProviderService,
    public loadingCtrl: LoadingController
  ) {
    this.reqAccepted = false;
    this.gotToTns = false;
  }

  async ngOnInit() {
     this.helpers.stopSoundAlert();
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
    this.imgSrc = "../../assets/map.JPG";
    this.clientDetails = await this.params.get("clientDetails");
    this.clientDetails = this.clientDetails[0];
    this.spDetials = await this.params.get("spDetials");
    console.log(this.spDetials.lng);
    await this.loadMap(
      3,
      3,
      10
    ); 
    await this.getClientAddress(); 
    
  }
  loadMap(lat: number, lng: number, zoomLevel: number) { 
    this.map = GoogleMaps.create("map_canvas4", {
      camera: {
        target: {
          lat: lat,
          lng: lng
        },
        zoom: zoomLevel
      }
    });
  }

  async getClientAddress() {
    return this._api
      .getGeoCoding(this.clientDetails.clientLat, this.clientDetails.clientLng)
      .subscribe(data => {
        this.clientFullAddress = data.body["origin"];
        
        let marker: Marker = this.map.addMarkerSync({
          title: this.clientFullAddress,
          position: {
            lat: this.clientDetails.clientLat,
            lng: this.clientDetails.clientLng
          }
          //  icon: image
        });
        marker.showInfoWindow(); 
      });
  }

 
 
  acceptRequest() {
    this.gotToTns = true;
  }

  cancelRequest() {
    this.reqAccepted = false;
    this.modalCtrl.dismiss(this.reqAccepted);
  }

  closemodal() {
    this.reqAccepted = false;
    this.modalCtrl.dismiss(this.reqAccepted);
  }

  getTermsState(evt: any) {
    this.termsState = evt.detail.value;
  }

  continue() {
    if (this.termsState == "IAgree") {
      this.reqAccepted = true;

      this.modalCtrl.dismiss({
        flag: this.reqAccepted,
        clientAddress: this.clientFullAddress,
        lat: this.clientDetails.clientLat,
        lng: this.clientDetails.clientLng,
        distance: this.distance,
        clientName: this.clientDetails.firstName,
        clientSurname: this.clientDetails.LastName,
        requestDate: this.clientDetails.dateCaptured
      });
    } else {
      this.alertProvider.presentAlert(
        "Job Declined",
        "You Have Declined A Job Request, We Will Place You As Available Again"
      );
      this.cancelRequest();
    }
  }

  ionViewWillLeave() {
    // const nodeList = document.querySelectorAll("._gmaps_cdv_");
    // for (let k = 0; k < nodeList.length; ++k) {
    //   nodeList.item(k).classList.remove("_gmaps_cdv_");
    // }
  }
}
