import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ClaimWitness } from 'src/app/helpers/claim-manager';
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-witness-detail',
  templateUrl: 'witness-detail.page.html',
  styleUrls: ['witness-detail.page.scss'],
})
export class WitnessDetailPage implements OnInit {

  witness: ClaimWitness = new ClaimWitness();
  addressOptions = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  };
  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper) {
    this.witness.witnessAddress = this.navParams.get('witnessAddress') || '';
    this.witness.witnessContactNumber = this.navParams.get('witnessContactNumber') || '';
    this.witness.witnessFirstName = this.navParams.get('witnessFirstName') || '';
    this.witness.witnessLastName = this.navParams.get('witnessLastName') || '';
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
    this.witness.witnessAddress = address.formatted_address;
  }
}
