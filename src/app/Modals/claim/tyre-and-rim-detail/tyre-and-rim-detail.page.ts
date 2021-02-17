import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ModalController, NavParams } from "@ionic/angular";
import { ClaimProperty } from 'src/app/Helpers/claim-manager';
import { MediaManager } from "src/app/utils/media-manager";
import { PopupHelper } from "src/app/utils/popup-helper";

@Component({
  selector: 'app-tyre-and-rim-detail',
  templateUrl: 'tyre-and-rim-detail.page.html',
  styleUrls: ['tyre-and-rim-detail.page.scss'],
})
export class TyreAndRimDetailPage implements OnInit {

  property: ClaimProperty = new ClaimProperty();
  index: number = -1;
  @ViewChild('stepForm', { static: true }) stepForm: FormGroup;
  type: string = '';

  constructor(protected modalController: ModalController, private navParams: NavParams, private popup: PopupHelper, private mediaManager: MediaManager) {
    this.property.propType = this.navParams.get('propType') || '';
    this.property.propDamageDescription = this.navParams.get('propDamageDescription') || '';
    this.property.propTyreRemainingThread = this.navParams.get('propTyreRemainingThread') || '';
    this.type = this.navParams.get('type') || 'tyre';
    this.property.tyreImage = JSON.parse(this.navParams.get('tyreImage') || '{}');
    this.property.tyreThreadImage = JSON.parse(this.navParams.get('tyreThreadImage') || '{}');
    this.property.rimImage = JSON.parse(this.navParams.get('rimImage') || '{}');
    this.index = this.navParams.get('index') || -1;
  }

  ngOnInit() {

  }


  addRimImage() {
    this.mediaManager.pickImage(true, true, 2.5).then(async image => {
      if (image == null)
        return;
      this.property.rimImage = image;
    });
  }

  addTyreImage() {
    this.mediaManager.pickImage(true, true, 2.5).then(async image => {
      if (image == null)
        return;
      this.property.tyreImage = image;
    });
  }

  addTyreThreadImage() {
    this.mediaManager.pickImage(true, true, 2.5).then(async image => {
      if (image == null)
        return;
      this.property.tyreThreadImage = image;
    });
  }
  deleteRimImage() {
    this.mediaManager.deleteMedia(this.property.rimImage);
    this.property.rimImage = null;
  }

  deleteTyreImage() {
    this.mediaManager.deleteMedia(this.property.tyreImage);
    this.property.tyreImage = null;
  }

  deleteTyreThreadImage() {
    this.mediaManager.deleteMedia(this.property.tyreThreadImage);
    this.property.tyreThreadImage = null;
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

}
