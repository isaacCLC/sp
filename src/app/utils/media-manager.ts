import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File as FilePlugin } from '@ionic-native/file/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { CommonUtils } from './common-utils';
import { FileUtil } from './file-util';
import { PopupHelper } from './popup-helper';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { DeviceInfo } from '../helpers/device-info';


@Injectable()
export class MediaManager {
    private mediaElementId: string = "mediaManagerFileElement";
    private fileChangedListener = null;
    private readonly imageTypes: string = "image/jpg,image/jpeg,image/png";

    fileInput: HTMLInputElement;

    public accept: string = "";

    constructor(private popupHelper: PopupHelper, public platform: Platform, public camera: Camera, public deviceInfo: DeviceInfo, public actionSheetCtrl: ActionSheetController,
        public filePlugin: FilePlugin, private domSanitizer: DomSanitizer, private filePath: FilePath, private fileUtil: FileUtil, @Inject(DOCUMENT) private document: Document, private mediaCapture: MediaCapture) {
    }

    public pickImage(allowCamera: boolean = true, allowGallery: boolean = true, sizeLimitMB: number = -1, directory: string = "0"): Promise<MediaManagerResult> {
        if (!this.deviceInfo.isCordova) {
            return this.filePicker(MediaType.Image, sizeLimitMB, directory);
        }
        else
            return new Promise(resolve => {
                if (allowCamera && !allowGallery) {
                    this.takePicture(true, directory).then(image => this.checkImageSize(image, sizeLimitMB).then(res => resolve(res)));
                    return;
                }

                if (!allowCamera && allowGallery) {
                    this.takePicture(false, directory).then(image => this.checkImageSize(image, sizeLimitMB).then(res => resolve(res)));
                    return;
                }

                const btnCamera = {
                    text: 'Camera',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: () => {
                        this.takePicture(true, directory).then(image => this.checkImageSize(image, sizeLimitMB).then(res => resolve(res)));
                    }
                };

                const btnGallery = {
                    text: 'Gallery',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: () => {
                        this.takePicture(false, directory).then(image => this.checkImageSize(image, sizeLimitMB).then(res => resolve(res)));
                    }
                }

                const buttons = [];
                if (allowGallery)
                    buttons.push(btnGallery);

                if (allowCamera)
                    buttons.push(btnCamera);

                const actionSheet = this.actionSheetCtrl.create({
                    header: 'Add Image',
                    buttons: buttons,
                }).then(actionSheet => actionSheet.present());
            });
    }

    public pickVideo(allowCamera: boolean = true, allowGallery: boolean = true, sizeLimitMB: number = -1, directory: string = "0"): Promise<MediaManagerResult> {
        if (!this.deviceInfo.isCordova) {
            return this.filePicker(MediaType.Video, sizeLimitMB, directory);
        }
        else
            return new Promise(resolve => {
                if (allowCamera && !allowGallery) {
                    this.takeVideo(true, directory).then(video => this.checkImageSize(video, sizeLimitMB).then(res => resolve(res)));
                    return;
                }

                if (!allowCamera && allowGallery) {
                    this.takeVideo(false, directory).then(video => this.checkImageSize(video, sizeLimitMB).then(res => resolve(res)));
                    return;
                }

                const btnCamera = {
                    text: 'Camera',
                    icon: !this.platform.is('ios') ? 'videocam' : null,
                    handler: () => {
                        this.takeVideo(true, directory).then(video => this.checkImageSize(video, sizeLimitMB).then(res => resolve(res)));
                    }
                };

                const btnGallery = {
                    text: 'Gallery',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: () => {
                        this.takeVideo(false, directory).then(video => this.checkImageSize(video, sizeLimitMB).then(res => resolve(res)));
                    }
                }

                const buttons = [];
                if (allowGallery)
                    buttons.push(btnGallery);

                if (allowCamera)
                    buttons.push(btnCamera);

                const actionSheet = this.actionSheetCtrl.create({
                    header: 'Add Video',
                    buttons: buttons,
                }).then(actionSheet => actionSheet.present());
            });
    }

    public async deleteMedia(media: MediaManagerResult): Promise<boolean> {
        if (media.file)
            return false;
        return this.fileUtil.deleteFile(media.fileUri);
    }

    public async getMediaFileInfo(image: MediaManagerResult): Promise<FileInfo> {
        if (image.file) {
            return { data: image.file, name: image.name };
        }
        else {
            const data = await this.fileUtil.getImageBlob(image.fileUri, image.contentType);
            return { data: data, name: image.name };
        }
    }

    public async cleanDirectory(directory: string): Promise<boolean> {
        try {
            let res = await this.filePlugin.removeRecursively(this.filePlugin.dataDirectory, directory);
            return res.success;
        }
        catch (e) {
            return false;
        }
    }

    private checkImageSize(image: MediaManagerResult, sizeLimit: number): Promise<MediaManagerResult> {
        return new Promise(resolve => {
            if (sizeLimit > 0) {
                this.getMediaFileInfo(image).then(testBlob => {
                    console.log("Size limit")
                    console.log(sizeLimit)
                    if (testBlob.data.size > this.calcSizeLimitInBytes(sizeLimit)) {
                        this.popupHelper.showAlert(
                            "File Too Large",
                            "Please select a smaller image, under " + sizeLimit + "MB."
                        );
                        resolve(undefined);
                    }
                    else
                        resolve(image);
                });
            }
            else {
                resolve(image);
            }
        });
    }

    private filePicker(mediaType: MediaType, sizeLimitMB: number, directory: string): Promise<MediaManagerResult> {
        return new Promise(resolve => {
            if (this.fileInput) {
                this.fileInput = undefined;
            }

            this.fileInput = document.createElement('input');
            this.fileInput.type = "file";
            this.fileInput.id = this.mediaElementId;
            this.fileInput.style.display = "none";
            mediaType == 2?this.fileInput.accept = "video/mp4":"";

            switch (mediaType) {
                case MediaType.Image:
                    this.fileInput.accept = this.imageTypes;
                    break;
            }

            if (this.fileInput) {
                if (this.fileChangedListener) {
                    this.fileInput.removeEventListener("change", this.fileChangedListener);
                    this.fileChangedListener = null;
                }
                this.fileInput.addEventListener("change", this.fileChangedListener = function (event) {
                    this.fileInputChange(event, sizeLimitMB, mediaType, directory).then(image => {
                        resolve(image);
                    });
                }.bind(this));
                this.fileInput.click();
            }
        });
    }

    private takeVideo(camera: boolean, directory: string = "0"): Promise<MediaManagerResult> {
        let options: CaptureImageOptions = {
            limit: 1
        }

        return new Promise(resolve => {
            if (!camera) {
                this.filePicker(MediaType.Video, -1, directory).then(video=>{
                    resolve(video)
                })
            } else {
                this.mediaCapture.captureVideo(options).then((videoData: MediaFile[]) => {
                    videoData.forEach(file => {
                        this.fileUtil.getImageBlob(file.fullPath, file.type).then(blob => {
                            let video = new MediaManagerResult();
                            video.setFileUri(file.fullPath, file.type, file.name, blob)
                            resolve(video);
                        })
                    })
                }).catch(err => {
                    console.log(err)
                    this.popupHelper.showToast(err)
                })
            }
        })
    }

    private takePicture(camera: boolean, directory: string = "0"): Promise<MediaManagerResult> {
        let options: CameraOptions = {
            sourceType: camera ? 1 : 2,
            quality: 90,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            targetHeight: 1024,
            targetWidth: 768,
            cameraDirection: 0,
            encodingType: this.camera.EncodingType.JPEG,
            destinationType: this.camera.DestinationType.FILE_URI
        }

        return new Promise(resolve => {
            this.camera.getPicture(options).then((imageData) => {
                if (this.deviceInfo.isAndroid && !camera) {
                    console.log("Not camera")
                    console.log(imageData)
                    this.filePath.resolveNativePath(imageData)
                        .then(filePath => {
                            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                            let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
                            console.log(correctPath)
                            this.copyFileToLocalDir(correctPath, currentName, directory, this.createJpegFileName()).then(async res => {
                                if (!res) {
                                    resolve(undefined);
                                    return;
                                }
                                let image = new MediaManagerResult();
                                image.setFileUri(res, "image/jpeg", currentName, await this.fileUtil.getImageBlob(res, 'image/jpeg'))
                                resolve(image);
                            });
                        });
                } else {

                    let currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
                    let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
                    this.copyFileToLocalDir(correctPath, currentName, directory, this.createJpegFileName()).then(async res => {

                        if (!res) {
                            resolve(undefined);
                            return;
                        }
                        let image = new MediaManagerResult();
                        image.setFileUri(res, "image/jpeg", currentName, await this.fileUtil.getImageBlob(res, 'image/jpeg'))
                        resolve(image);
                        this.deviceInfo.isAndroid ? "" : this.camera.cleanup();

                    });

                }
            }).catch(err => {
                console.log(err)
                this.popupHelper.showToast(err)
            })
        })
    }

    private fileInputChange(e, sizeLimit, type: MediaType, directory: string): Promise<MediaManagerResult> {
        return new Promise(resolve => {
            //Taken From::  https://www.html5rocks.com/en/tutorials/file/dndfiles/

            if (!File || !FileReader) {
                this.popupHelper.showAlert(
                    "Media Picker is Unavailable",
                    "Unfortunately we are unable to load the media picker."
                );
            }

            if (e.target == undefined || e.target.files == undefined || e.target.files.length <= 0) {
                resolve(null);
                return;
            }
            let file = e.target.files[0];
            if (file == null) {
                resolve(null);
                return;
            }

            if (type == MediaType.Image && file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png") {
                this.popupHelper.showAlert(
                    "Incorrect File Type",
                    "Please select an image (png or jpeg)."
                );
                resolve(null);
                return;
            }

            if (type == MediaType.Audio && file.type != "" && file.type != "audio/mpeg" && file.type != "audio/mp3") {

                this.popupHelper.showAlert(
                    "Incorrect File Type",
                    "Please select an audio file (mp3)."
                );
                resolve(null);
                return;
            }

            if (type == MediaType.Video && file.type != "" && file.type != "video/mpeg" && file.type != "video/mp4") {
                this.popupHelper.showAlert(
                    "Incorrect File Type",
                    "Please select a video file (mp4)."
                );
                resolve(null);
                return;
            }

            if (sizeLimit > 0) {
                var fileSize = file.size;
                if (fileSize > this.calcSizeLimitInBytes(sizeLimit)) {
                    this.popupHelper.showAlert(
                        "File Too Large",
                        "Please select a smaller file, under " + sizeLimit + "MB."
                    );
                    resolve(null);
                    return;
                }
            }

            //JN: If cordova we need to read the file and copy it to the app's data directory
            if (this.deviceInfo.isCordova) {
                const reader: FileReader = new FileReader();
                reader.onload = function (evt: any) {
                    let fileName = file.name;
                    let contentType = file.type;
                    if (type == MediaType.Audio) {
                        if (CommonUtils.isNullOrWhiteSpace(fileName))
                            fileName = this.createMp3FileName();
                        if (CommonUtils.isNullOrWhiteSpace(contentType))
                            contentType = "audio/mpeg";
                    }
                    if (type == MediaType.Video) {
                        if (CommonUtils.isNullOrWhiteSpace(fileName))
                            fileName = this.createMp4FileName();
                        if (CommonUtils.isNullOrWhiteSpace(contentType))
                            contentType = "video/mp4";
                    }
                    if (type == MediaType.Pdf) {
                        if (CommonUtils.isNullOrWhiteSpace(fileName))
                            fileName = this.createPdfFileName();
                        if (CommonUtils.isNullOrWhiteSpace(contentType))
                            contentType = this.pdfTypes;
                    }
                    if (type == MediaType.Word) {
                        if (CommonUtils.isNullOrWhiteSpace(fileName))
                            fileName = this.createWordFileName(contentType);
                        if (CommonUtils.isNullOrWhiteSpace(contentType))
                            contentType = this.wordTypes1;
                    }
                    if (type == MediaType.Excel) {
                        if (CommonUtils.isNullOrWhiteSpace(fileName))
                            fileName = this.createExcelFileName(contentType);
                        if (CommonUtils.isNullOrWhiteSpace(contentType))
                            contentType = this.excelTypes1;
                    }
                    //if(type == MediaType.Video)
                    this.saveArrayBuffer(evt.currentTarget.result, fileName, directory).then(async res => {
                        if (CommonUtils.isNullOrWhiteSpace(res)) {
                            resolve(null);
                            return;
                        }
                        let result = new MediaManagerResult();
                        result.setFileUri(res, contentType, fileName, await this.fileUtil.getImageBlob(res, 'image/jpeg'))
                        resolve(result);
                    });
                }.bind(this);
                reader.onerror = function (evt) {
                    this.popupHelper.showAlert(
                        "Error Selecting Media",
                        "An error occurred. Please try again."
                    );
                    resolve(null);
                }.bind(this);
                reader.readAsArrayBuffer(file);
            }
            //JN: On browser, just set the File we just got. The result object will create a resource URL
            //Note, the result MUST be disposed later to avoid memory leaks
            else {
                let result = new MediaManagerResult();
                result.setFile(file);
                resolve(result);
            }
        })
    }

    private createBaseFileName() {
        let d = new Date(),
            n = d.getTime();
        return n;
    }

    private createJpegFileName() {
        return this.createBaseFileName() + ".jpg";
    }

    private calcSizeLimitInBytes(sizeLimit: number) {
        return sizeLimit * 1024 * 1024;
    }

    private async ensureDirectory(directory: string) {
        let dirExists = await this.fileUtil.checkDir(this.filePlugin.dataDirectory, directory);
        if (!dirExists)
            await this.filePlugin.createDir(this.filePlugin.dataDirectory, directory, false);
    }

    private async copyFileToLocalDir(namePath, currentName, newDirectory, newFileName): Promise<string> {
        try {
            await this.ensureDirectory(newDirectory);
            let dir = this.filePlugin.dataDirectory + newDirectory;
            let copyRes = await this.filePlugin.copyFile(namePath, currentName, dir, newFileName);
            if (copyRes) {
                return dir + "/" + newFileName;
            }
        }
        catch (e) {
            return undefined;
        }
    }

    private async saveArrayBuffer(buffer: ArrayBuffer, fileName: string, directory: string): Promise<string> {
        try {
            let newFileName = fileName;
            let fullDirectory = this.filePlugin.dataDirectory;
            if (!CommonUtils.isNullOrWhiteSpace(directory)) {
                await this.ensureDirectory(directory);
                fullDirectory = fullDirectory + directory + "/";
            }
            let res = await this.filePlugin.writeFile(fullDirectory, newFileName, buffer, { replace: true });
            if (res)
                if (this.deviceInfo.isAndroid) {
                    return this.filePath.resolveNativePath(fullDirectory + newFileName);
                }
                else {
                    return fullDirectory + newFileName;
                }

        }
        catch (e) {
            return "";
        }
    }
}

export class MediaManagerResult {
    public exists: boolean = false;
    public contentType: string = "";
    public base64: string = "";
    public fileUri: string = "";
    public file: File;
    public name: string = "";

    public setFile(file: File) {
        this.exists = true;
        this.file = file;
        this.fileUri = URL.createObjectURL(this.file);
        this.contentType = file.type;
        this.name = file.name;
        let reader = new FileReader();
        reader.onloadend = (e) => {
            this.base64 = reader.result.toString();
        }
        reader.readAsDataURL(file);
    }

    public setFileUri(fileURI: string, contentType: string, name: string, fileBlob: Blob) {
        this.exists = true;
        this.fileUri = fileURI;
        this.contentType = contentType;
        this.name = name;
        let reader = new FileReader();
        reader.onloadend = (e) => {
            this.base64 = reader.result.toString();
        }
        reader.readAsDataURL(fileBlob);
    }

    public dispose() {
        if (this.file && this.fileUri)
            URL.revokeObjectURL(this.fileUri);
    }

    public get nativeSafeFileUri() {
        if (this.file)
            return this.fileUri;
        else
            return (<any>window).Ionic.WebView.convertFileSrc(this.fileUri);
    }
}

enum MediaType {
    Image,
    Audio,
    Video,
    Pdf,
    Excel,
    Word
}

@Pipe({ name: 'mediaManagerSafeSrc' })
export class MediaManagerSafeSrcPipe {
    constructor(private sanitizer: DomSanitizer) { }

    transform(media: MediaManagerResult) {
        if (!media)
            return "";
        return this.sanitizer.bypassSecurityTrustResourceUrl(media.nativeSafeFileUri);
    }
}

@Pipe({ name: 'mediaManagerSafeStyle' })
export class MediaManagerSafeStylePipe {
    constructor(private sanitizer: DomSanitizer) { }

    transform(media: MediaManagerResult) {
        if (!media)
            return "";
        if (!media.base64 || media.base64 == '')
            return this.sanitizer.bypassSecurityTrustStyle("url(" + media.nativeSafeFileUri + ")");

        return this.sanitizer.bypassSecurityTrustStyle("url(" + media.base64 + ")");
    }
}

export class FileInfo {
    name: string;
    data: Blob;
}
