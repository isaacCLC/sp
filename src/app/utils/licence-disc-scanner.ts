import { Injectable } from "@angular/core";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DeviceInfo } from "./device-info";
import { PopupHelper } from "./popup-helper";

@Injectable({
  providedIn: 'root',
})
export class LicenceDiscScanner {
  constructor(private barcodeScanner: BarcodeScanner, private device: DeviceInfo, private popup: PopupHelper) { }

  public async scan(): Promise<LicenceDiscData> {
    try {
      if (!this.device.isCordova)
        return this.parse("%MVL1CC46%0141%4024T0NF%1%CONTROLNO%LICENSENO%VEHREGNO%DESCRIPTION%KIA%RIO%COLOR%VIN%ENGINENUMBER%EXPIRY%");

      let response = await this.barcodeScanner.scan({
        formats: "PDF_417",
        preferFrontCamera: false
      });
      return this.parse(response.text);
    }
    catch (err) {
      console.error(err);
      this.popup.showToast('This licence disc does not appear to be valid. Please try again.');
      return null;
    }
  }

  private parse(result: string): LicenceDiscData {
    const s = result.split('%');

    const data: LicenceDiscData = {
      licenceNo: s[6],
      vehRegNo: s[7],
      color: s[11],
      make: s[9],
      seriesName: s[10],
      vinNo: s[12]
    };

    return data;
  }
}

export class LicenceDiscData {
  licenceNo: string;
  vehRegNo: string;
  vinNo: string;
  make: string;
  seriesName: string;
  color: string;
}

//"%MVL1CC46%0141%4024T0NF%1%4024047N8P91%BX26MGGP%RGM817W%Hatch back / Luikrug%KIA%RIO%Beige / Beige%KNADN512MC6766977%G4FACS294354%2020-08-31%"