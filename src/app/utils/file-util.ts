import { Injectable } from '@angular/core';
import { File as FilePlugin } from '@ionic-native/file/ngx';
import { CommonUtils } from '../utils/common-utils';


@Injectable()
export class FileUtil {

  constructor(public filePlugin: FilePlugin) {
  }

  public base64toBlob(base64Data, contentType) {
    base64Data = base64Data.split(',')[1];
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  public async deleteFile(path: string): Promise<boolean> {
    try {
      if (CommonUtils.isNullOrWhiteSpace(path) || path.indexOf('/') == -1)
        return false;
      let fileName = path.substr(path.lastIndexOf('/') + 1);
      let filePath = path.substr(0, path.lastIndexOf('/') + 1)
      let res = await this.filePlugin.removeFile(filePath, fileName);
      return !!res;
    }
    catch (e) {
      return false;
    }
  }

  public async getDataUrl(path: string): Promise<string> {
    try {
      if (CommonUtils.isNullOrWhiteSpace(path) || path.indexOf('/') == -1)
        return "";
      let fileName = path.substr(path.lastIndexOf('/') + 1);
      let filePath = path.substr(0, path.lastIndexOf('/') + 1)
      let res = await this.filePlugin.readAsDataURL(filePath, fileName);
      return res;
    }
    catch (e) {
      return "";
    }
  }

  // public async saveDataUrl(dataUrl: string, contentType: string): Promise<string> {
  //     try {
  //         if (CommonUtils.isNullOrWhiteSpace(dataUrl))
  //             return "";

  //         let newFileName = this.createFileName();
  //         let dataBlob = this.base64toBlob(dataUrl, "image/jpeg");
  //         let res = await this.filePlugin.writeFile(this.filePlugin.dataDirectory, newFileName, dataBlob);
  //         if (res)
  //             return this.filePlugin.dataDirectory + newFileName;
  //     }
  //     catch (e) {
  //         return "";
  //     }
  // }

  public async checkDir(path: string, dir: string): Promise<boolean> {
    try {
      let dirExists = await this.filePlugin.checkDir(path, dir);
      return dirExists;
    }
    catch (e) {
      return false;
    }
  }

  public async getImageBlob(path: string, contentType: string): Promise<Blob> {
    try {
      if (CommonUtils.isNullOrWhiteSpace(path) || path.indexOf('/') == -1)
        return undefined;
      let fileName = path.substr(path.lastIndexOf('/') + 1);
      let filePath = path.substr(0, path.lastIndexOf('/') + 1)
      let res = await this.filePlugin.readAsArrayBuffer(filePath, fileName);
      if (!res)
        return undefined;
      return new Blob([new Uint8Array(res)], { type: contentType });
    }
    catch (e) {
      return undefined;
    }
  }
}
