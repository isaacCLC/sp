import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { AppConfig } from 'src/app/Helpers/app-config';
import { ClaimThirdparty } from 'src/app/Helpers/claim-manager';
import { ClaimOperation } from 'src/app/Providers/claim-operation';
import { AppStorage } from "src/app/utils/app-storage";
import { LicenceDiscScanner } from "src/app/utils/licence-disc-scanner";
import { MediaManager } from "src/app/utils/media-manager";
import { PopupHelper } from "src/app/utils/popup-helper";
declare var mwbScanner:any;
@Component({
  selector: 'app-third-party-detail',
  templateUrl: 'third-party-detail.page.html',
  styleUrls: ['third-party-detail.page.scss'],
})
export class ThirdPartyDetailPage implements OnInit {

  thirdParty: ClaimThirdparty = new ClaimThirdparty();

  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };

  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;


  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, private mediaManager: MediaManager, private appStorage: AppStorage
    , private barcode: LicenceDiscScanner, public zone: NgZone,private _api: ClaimOperation) {
    this.thirdParty.tpFirstName = this.navParams.get('tpFirstName') || '';
    this.thirdParty.tpLastName = this.navParams.get('tpLastName') || '';
    this.thirdParty.tpIdNumber = this.navParams.get('tpIdNumber') || '';
    this.thirdParty.tpAddress = this.navParams.get('tpAddress') || '';
    this.thirdParty.tpContactNumber = this.navParams.get('tpContactNumber') || '';
    this.thirdParty.tpVehicleOwnerFirstName = this.navParams.get('tpVehicleOwnerFirstName') || '';
    this.thirdParty.tpVehicleOwnerLastName = this.navParams.get('tpVehicleOwnerLastName') || '';
    this.thirdParty.tpVehicleOwnerIdNumber = this.navParams.get('tpVehicleOwnerIdNumber') || '';
    this.thirdParty.tpVehicleOwnerAddress = this.navParams.get('tpVehicleOwnerAddress') || '';
    this.thirdParty.tpVehicleOwnerContactDetails = this.navParams.get('tpVehicleOwnerContactDetails') || '';
    this.thirdParty.tpVehicleMake = this.navParams.get('tpVehicleMake') || 0;
    this.thirdParty.tpMakeDescription = this.navParams.get('tpMakeDescription') || '';
    this.thirdParty.tpVehicleModel = this.navParams.get('tpVehicleModel') || '';
    this.thirdParty.tpVehicleRegistrationNumber = this.navParams.get('tpVehicleRegistrationNumber') || '';
    this.thirdParty.tpVehicleDescriptionOfDamage = this.navParams.get('tpVehicleDescriptionOfDamage') || '';
    this.thirdParty.licenseImage = JSON.parse(this.navParams.get('licenseImage') || '{}');
    this.thirdParty.vehicleImages = JSON.parse(this.navParams.get('vehicleImages') || '[]');
    this.thirdParty.sameAsDriver = this.navParams.get('sameAsDriver') || false;
    this.index = this.navParams.get('index') || -1;
  }

  ngOnInit() {

  }

  makeSameAsDriver() {
    if (this.thirdParty.sameAsDriver) {
      this.thirdParty.tpVehicleOwnerFirstName = this.thirdParty.tpFirstName;
      this.thirdParty.tpVehicleOwnerLastName = this.thirdParty.tpLastName;
      this.thirdParty.tpVehicleOwnerIdNumber = this.thirdParty.tpIdNumber;
      this.thirdParty.tpVehicleOwnerAddress = this.thirdParty.tpAddress;
      this.thirdParty.tpVehicleOwnerContactDetails = this.thirdParty.tpContactNumber;
    }
    else {
      this.thirdParty.tpVehicleOwnerFirstName = '';
      this.thirdParty.tpVehicleOwnerLastName = '';
      this.thirdParty.tpVehicleOwnerIdNumber = '';
      this.thirdParty.tpVehicleOwnerAddress = '';
      this.thirdParty.tpVehicleOwnerContactDetails = '';
    }
  }

  async save(data: any = null) {
    if (!this.stepForm.valid) {
      await this.popup.showAlert('Missing fields', 'All fields must be completed in this form.');
      return;
    }

    this.close(data);
  }

  public async close(data: any = null) {
    if (this.thirdParty.sameAsDriver) {
      this.makeSameAsDriver();
    }
    await this.modalController.dismiss(data);
  }

  public async closeAndDelete() {
    await this.popup.showConfirm("Delete this third party?", "This will permanently delete this third party.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    this.thirdParty.tpAddress = address.formatted_address;
  }

  public handleOwnerAddressChange(address: Address) {
    this.thirdParty.tpVehicleOwnerAddress = address.formatted_address;
  }

  addLicenseImage() {
    this.mediaManager.pickImage(true, true, 2.5).then(async image => {
      if (image == null)
        return;
      this.thirdParty.licenseImage = image;
    });
  }

  addVehicleImage() {
    this.mediaManager.pickImage(true, true, 2.5).then(async image => {
      if (image == null)
        return;
      this.thirdParty.vehicleImages.push(image);
    });
  }
  deleteLicenseImage() {
    this.mediaManager.deleteMedia(this.thirdParty.licenseImage);
    this.thirdParty.licenseImage = null;
  }

  deleteVehicleImage(e, index: number) {
    e.stopPropagation();
    if (index > -1) {
      this.mediaManager.deleteMedia(this.thirdParty.vehicleImages[index]);
      this.thirdParty.vehicleImages.splice(index, 1);
    }
  } 

  async scanLicenseBarcode(){
    await this.popup.showLoading("loading...");
    let tpDriverDetials = this.thirdParty;
    
    let base64string = null; 
    await mwbScanner.setKey(AppConfig.manateeWorksKey).then(function(response){})
    await mwbScanner.setCallback(function(result){}); 
    await mwbScanner.startScanning().then(function(response){  
        let binary = ''; 
        let bytes = new Uint8Array(response.bytes);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        base64string =  window.btoa(binary);    //encodes binary array to base64 string
      })   
      await this.popup.dismissLoading(); 
      // let res = await  this._api.getSALicenseInfo(base64string) ; 
      // if(res.Status != "Success"){ 
      //    this.popup.showAlert("Error","Could not get driver 's licence information")
      // }else{
       
      //   tpDriverDetials.tpIdNumber = res.Result.PersonIdentificationNumber ;
      //   res = res.Result.IDVerification.Result.Verification;
      //   tpDriverDetials.tpFirstName = res.Firstnames;
      //   tpDriverDetials.tpLastName = res.Lastname;
      //   this.thirdParty = await tpDriverDetials;  
      // } 
  }

  async scanLicenseDisc() {
    let response = await this.barcode.scan();
    console.log(response);
    this.zone.run(() => {
      this.thirdParty.tpMakeDescription = response.make;
      this.thirdParty.tpVehicleModel = response.seriesName;
      this.thirdParty.tpVehicleRegistrationNumber = response.licenceNo;
    });
  }
}
