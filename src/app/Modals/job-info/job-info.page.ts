import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker } from "@ionic-native/google-maps";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertsProviderService } from '../../Providers/alerts-provider.service';
import { iServiceRequest, DriverDetails } from "src/app/models/appModels";
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
  constructor(
    private helpers: Helpers,
    private route: Router,
    private activatedRoute: ActivatedRoute, 
    private callNumber: CallNumber,
    private alertprovider: AlertsProviderService,
    private _api: ApiGateWayService,
  ) {}

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.spDetails = JSON.parse(params.spDetails);
      this.jobDetails = JSON.parse(params.jobInfo);
      this._api.getGeoCoding(this.jobDetails.data.clientLocation.latitude, this.jobDetails.data.clientLocation.longitude)
      .subscribe(res => {
        console.log(res.body.data.results[0].formatted_address)
        this.jobDetails.data.clientLocation['address'] = res.body.data.results[0].formatted_address;
      }, err => { console.log(err) });
      this._api.getDistance({latA: this.spDetails.location.coords.latitude,
        lonA: this.spDetails.location.coords.longitude,
        latB: this.jobDetails.data.clientLocation.latitude,
        lonB: this.jobDetails.data.clientLocation.longitude})
      .then(res => {
        if (res) {
          console.log(res)
          this.jobDetails.data.clientLocation['distance'] = res.data.distance
          this.jobDetails.data.clientLocation['time'] = res.data.time
        }
      }, err => {
        alert(JSON.stringify(err))
      });
      if(this.jobDetails.data.finalDestination.latitude){
        this._api.getDistance({latA: this.spDetails.location.coords.latitude,
          lonA: this.spDetails.location.coords.longitude,
          latB: this.jobDetails.data.finalDestination.latitude,
          lonB: this.jobDetails.data.finalDestination.longitude})
        .then(res => {
          if (res) {
            this.jobDetails.data.finalDestination['distance'] = res.data.distance
            this.jobDetails.data.finalDestination['time'] = res.data.time
          }
        }, err => {
          alert(JSON.stringify(err))
        }); 
      }
      // this.map = GoogleMaps.create("map_canvas2", {
      //   camera: {
      //     target: {
      //       lat: this.jobDetails.data.clientLocation.latitude,
      //       lng: this.jobDetails.data.clientLocation.longitude
      //     },
      //     zoom: 10
      //   }
      // });
      // let markerIcon = {
      //   url: this.helpers.clientIcon,
      //   size: {
      //     width: 30,
      //     height: 30
      //   }
      // };

      // this.marker = this.map.addMarkerSync({
      //   title: "Scene location",
      //   position: {
      //     lat: this.jobDetails.data.clientLocation.latitude,
      //     lng: this.jobDetails.data.clientLocation.longitude
      //   },
      //   icon: markerIcon
      // });
      // this.marker.showInfoWindow();
      // this.animateMapCamera();
    })
    
  }
  goToHome() {
    this.route.navigate(["/app/tabs/tab1"],{queryParams:{jobInfoFlag:true}});
  }

  // drawMarkers(title: string, lat: number, lng: number, icon) {
    
  // }

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
    this.route.navigate(["/chat"],{queryParams:{jobInfoFlag:true}});
  }

  // animateMapCamera() {
  //   this.helpers.getCurrentLocation().then(location => {
  //     this.map.animateCamera({
  //       target: [
  //         { lat: location.coords.latitude, lng: location.coords.longitude },
  //         { lat: this.jobDetails.data.clientLocation.latitude, lng: this.jobDetails.data.clientLocation.longitude }
  //       ],
  //       duration: 1000,
  //       zoom: 10
  //     });
  //     this.drawMarkers("you", location.coords.latitude, location.coords.longitude, this.helpers.SPIcon);
  //     let navPoints = [
  //       { lat: location.coords.latitude, lng: location.coords.longitude },
  //       { lat: this.jobDetails.data.clientLocation.latitude, lng: this.jobDetails.data.clientLocation.longitude }
  //     ];
  //     this.map.addPolyline({
  //       points: navPoints,
  //       color: "#0A20E7",
  //       width: 3,
  //       geodesic: true
  //     });
  //   });
  // }

  // loadMap(lat: number, lng: number, zoomLevel: number) {
    
  // }
}
