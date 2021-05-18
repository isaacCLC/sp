import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Storage } from "@ionic/storage";
import { GeneralService } from 'src/app/helpers/generals';
import { AlertsProviderService } from 'src/app/providers/alerts-provider.service';
import { ApiGateWayService } from 'src/app/providers/api-gate-way.service';
@Component({
  selector: 'app-final-checklist',
  templateUrl: './final-checklist.page.html',
  styleUrls: ['./final-checklist.page.scss'],
})
export class FinalChecklistPage implements OnInit {
  @ViewChild("imageCanvas") canvas: ElementRef;
  vehicleCheckList = new Array(6);
  towSlip: string;
  canvasElement: any;
  saveX: number;
  saveY: number;
  generalHelpers: GeneralService;
  constructor(private route: Router, private alertprovider: AlertsProviderService,
    private camera: Camera, private storage: Storage, private _api: ApiGateWayService) {
    this.vehicleCheckList = [
      { listItem: "Spare Wheel", isAvailable: false },
      { listItem: "Wheel Spanner", isAvailable: false },
      { listItem: "Keys", isAvailable: false },
      { listItem: "Radio", isAvailable: false },
      { listItem: "Vehicle Jack", isAvailable: false }
    ];
  }

  ngOnInit() {
  }

  async submitClaim() {
    this.storage.get("clcDriverID").then(driverID => {
      this._api.checkServiceRequests().then(data => {
        this._api.acceptJob(data.data.serviceRequests.callId, "endTow", data.data.serviceRequests.callRef).then(response => {
          this.alertprovider.presentAlert(
            "Completed",
            "Job REF" + data.data.serviceRequests.callRef,
            "Thank you for completing this job!"
          );
          this.route.navigate(["app/tabs/tab1"])
        })
      })
    })



  }

  goBack() {
    this.route.navigate(["app/tabs/tab1"])
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
  }

  getChecked(evt: any, index: number) {
    this.vehicleCheckList[index].isAvailable = evt.detail.checked;
  }
  async postVehicleCheckList() {
    await this.saveCanvasImage();
    this.route.navigate(["the-insured"]);
  }
  startDrawing(evt: any) {
    var canvasPos = this.canvasElement.getBoundingClientRect();
    this.saveX = evt.touches[0].pageX - canvasPos.x;
    this.saveY = evt.touches[0].pageY - canvasPos.y;
    this.canvasElement.addEventListener("touchstart", function (event) {
      event.preventDefault();
    });
    this.canvasElement.addEventListener("touchmove", function (event) {
      event.preventDefault();
    });
    this.canvasElement.addEventListener("touchend", function (event) {
      event.preventDefault();
    });
    this.canvasElement.addEventListener("touchcancel", function (event) {
      event.preventDefault();
    });
  }
  moved(evt: any) {
    var canvasPos = this.canvasElement.getBoundingClientRect();
    let currentX = evt.touches[0].pageX - canvasPos.x;
    let currentY = evt.touches[0].pageY - canvasPos.y;
    let drawnContext = this.canvasElement.getContext("2d");

    drawnContext.lineJoin = "round";
    drawnContext.strokeStyle = "#00000";
    drawnContext.lineWidth = 3;

    drawnContext.beginPath();
    drawnContext.moveTo(this.saveX, this.saveY);
    drawnContext.lineTo(currentX, currentY);
    drawnContext.closePath();
    drawnContext.stroke();
    this.saveX = currentX;
    this.saveY = currentY;
  }
  saveCanvasImage() {
    var canvas = this.canvasElement;
    var img = canvas.toDataURL("image/png");
    //this.storage.set("clcClientSignature", img);
    // code to set image URL missing
  }
  clearCanvasImage() {
    let drawnContext = this.canvasElement.getContext("2d");
    drawnContext.clearRect(0, 0, drawnContext.canvas.width, drawnContext.canvas.height);
  }

  towSlipPhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.towSlip = "data:image/jpeg;base64," + imageData;
      },
      err => {
        // Handle error
      }
    );
  }

}
