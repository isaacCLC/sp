import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker } from "@ionic-native/google-maps";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertsProviderService } from '../../Providers/alerts-provider.service';
import { iServiceRequest, DriverDetails } from "src/app/models/appModels";
import { AppLocation } from "src/app/utils/app-location";
import { ServiceRequestsService } from "src/app/utils/service-requests.service";
@Component({
  selector: "app-job-info",
  templateUrl: "./job-info.page.html",
  styleUrls: ["./job-info.page.scss"]
})
export class JobInfoPage implements OnInit {
  map: GoogleMap;
  jobDetails: iServiceRequest;
  spDetails: DriverDetails;
  marker: Marker;
  JSON: any;
  constructor(
    private helpers: Helpers,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private callNumber: CallNumber,
    private alertprovider: AlertsProviderService,
    private _api: ApiGateWayService,
    public appLocation: AppLocation,
    public serviceRequestsService: ServiceRequestsService
  ) {this.JSON = JSON; }

  async ngOnInit() {

  }

  async ionViewWillEnter() {

    // this._api.getGeoCoding(this.serviceRequestsService.serviceReq.data.clientLocation.latitude, this.serviceRequestsService.serviceReq.data.clientLocation.longitude).subscribe(res => {
    //   this.serviceRequestsService.serviceReq.data.clientLocation['address'] = res.body.data.results[0].formatted_address;
    // });
    // this._api.getDistance({
    //   latA: this.appLocation.LastKnownLatitude,
    //   lonA: this.appLocation.LastKnownLongitude,
    //   latB: this.serviceRequestsService.serviceReq.data.clientLocation.latitude,
    //   lonB: this.serviceRequestsService.serviceReq.data.clientLocation.longitude
    // }).then(res => {
    //   if (res) {
    //     console.log(res)
    //     this.serviceRequestsService.serviceReq.data.clientLocation['distance'] = res.data.distance;
    //     this.serviceRequestsService.serviceReq.data.clientLocation['time'] = res.data.time;
    //   }
    // });
    // if (this.jobDetails.data.finalDestination.latitude) {
    //   this._api.getDistance({
    //     latA: this.appLocation.LastKnownLatitude,
    //     lonA: this.appLocation.LastKnownLongitude,
    //     latB: this.serviceRequestsService.serviceReq.data.finalDestination.latitude,
    //     lonB: this.serviceRequestsService.serviceReq.data.finalDestination.longitude
    //   }).then(res => {
    //       if (res) {
    //         this.serviceRequestsService.serviceReq.data.finalDestination['distance'] = res.data.distance;
    //         this.serviceRequestsService.serviceReq.data.finalDestination['time'] = res.data.time;
    //       }
    //     });
    // }
  }


  goToHome() {
    this.route.navigate(["/app/tabs/tab1"], { queryParams: { jobInfoFlag: true } });
  }

  callClient() {  
    this.callNumber.callNumber(this.jobDetails.data.client.number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  callCLC() {
    this.callNumber.callNumber("0861222252", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  messageClient() { 
    console.log(this.serviceRequestsService.serviceReq)
    this.route.navigate(["chat"]);
  }
}
