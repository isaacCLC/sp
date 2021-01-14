import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiGateWayService } from "../../Providers/api-gate-way.service";
import { Helpers } from "../../Helpers/helpers";
import { GoogleMaps, GoogleMap, Marker } from "@ionic-native/google-maps";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertsProviderService } from '../../Providers/alerts-provider.service';
@Component({
  selector: "app-job-info",
  templateUrl: "./job-info.page.html",
  styleUrls: ["./job-info.page.scss"]
})
export class JobInfoPage implements OnInit {
  map: GoogleMap;
  custDetails: any;
  jobDetails: any;
  marker: Marker;
  constructor(
    private helpers: Helpers,
    private route: Router,
    private activatedRoute: ActivatedRoute, 
    private callNumber: CallNumber,
    private alertprovider: AlertsProviderService,
  ) {}

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("Printing job details");
      console.log(params)
      this.custDetails = JSON.parse(params.clientDetalis);
      this.jobDetails = JSON.parse(params.jobInfo);
      console.log(this.custDetails)
      console.log(this.jobDetails)
      this.map = GoogleMaps.create("map_canvas2", {
        camera: {
          target: {
            lat: this.custDetails.lat,
            lng: this.custDetails.lng
          },
          zoom: 10
        }
      });
      let markerIcon = {
        url: this.helpers.clientIcon,
        size: {
          width: 30,
          height: 30
        }
      };
      this.marker = this.map.addMarkerSync({
        title: this.custDetails.lat,
        position: {
          lat: this.custDetails.lat,
          lng: this.custDetails.lng
        },
        icon: markerIcon
      });
      this.marker.showInfoWindow();
      this.animateMapCamera();
    })
    
  }
  goToHome() {
    this.route.navigate(["/app/tabs/tab1"],{queryParams:{jobInfoFlag:true}});
  }

  drawMarkers(title: string, lat: number, lng: number, icon) {
    
  }
  callClient() {
    this.callNumber.callNumber(this.custDetails.number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  callCLC() {
    this.callNumber.callNumber("0861222252", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  messageClient() {
    this.alertprovider.presentPrompt()
  }

  animateMapCamera() {
    this.helpers.getCurrentLocation().then(location => {
      this.map.animateCamera({
        target: [
          { lat: location.coords.latitude, lng: location.coords.longitude },
          { lat: this.custDetails.lat, lng: this.custDetails.lng }
        ],
        duration: 1000,
        zoom: 10
      });
      this.drawMarkers("you", location.coords.latitude, location.coords.longitude, this.helpers.SPIcon);
      let navPoints = [
        { lat: location.coords.latitude, lng: location.coords.longitude },
        { lat: this.custDetails.lat, lng: this.custDetails.lng }
      ];
      this.map.addPolyline({
        points: navPoints,
        color: "#0A20E7",
        width: 3,
        geodesic: true
      });
    });
  }

  loadMap(lat: number, lng: number, zoomLevel: number) {
    
  }
}
