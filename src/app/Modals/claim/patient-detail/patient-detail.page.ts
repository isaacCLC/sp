import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimPatient } from 'src/app/helpers/claim-manager';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-patient-detail',
  templateUrl: 'patient-detail.page.html',
  styleUrls: ['patient-detail.page.scss'],
})
export class PatientDetailPage implements OnInit {

  patient: ClaimPatient = new ClaimPatient();
  index: number = -1;
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };

  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper) {
    this.patient.injuredFirstName = this.navParams.get('injuredFirstName') || '';
    this.patient.injuredLastName = this.navParams.get('injuredLastName') || '';
    this.patient.injuredIdNumber = this.navParams.get('injuredIdNumber') || '';
    this.patient.injuredContactNumber = this.navParams.get('injuredContactNumber') || '';
    this.patient.injuredDescriptionOfInuries = this.navParams.get('injuredDescriptionOfInuries') || '';
    this.patient.injuredMedicalCosts = this.navParams.get('injuredMedicalCosts') || 0;
    this.patient.injuredMedicalServiceProvider = this.navParams.get('injuredMedicalServiceProvider') || '';
    this.index = this.navParams.get('index') || -1;

  }

  ngOnInit() {

  }

  async save(data: any = null) {
    if (!this.stepForm.valid) {
      await this.popup.showAlert('Missing fields', 'All fields must be completed in this form.');
      return;
    }

    this.close(data);
  }
  public async close(data: any = null) {
    await this.modalController.dismiss(data);
  }

  public async closeAndDelete() {
    await this.popup.showConfirm("Delete this witness?", "This will permanently delete this witness.", "Yes", async () => {
      let data = {
        index: this.index
      }
      await this.modalController.dismiss(data);
    }, "Not yet", null);

  }

  public handleAddressChange(address: Address) {
    // Do some stuff
  }
}
