import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import * as moment from 'moment';
import { DriverDetails } from "../models/appModels";
import { AppConfig } from "./app-config";
import { AppStorage } from "./app-storage";
import { PushMessage } from "./push-message";
import { getHomeProductListData, getLookupResponse, getMasterProductListResponse, SubmemberLoginData } from "./responses";


@Injectable({
  providedIn: 'root'
})
export class UserState {

  isLoggedIn: boolean = false;
  isOnline: boolean = false;
  appUserId: number;
  driver: DriverDetails;
  masterProductList: getMasterProductListResponse;
  isSubMember: boolean = false;
  subMemberData: SubmemberLoginData;
  lookupValues: Map<number, getLookupResponse> = new Map();


  constructor(private storage: Storage, private push: PushMessage) {
    // setup a timer to locate get driver every 2 mins
    window.setInterval(() => this.getDriver(), 2 * 60 * 1000);
  }

  async init() {
    console.log("getting driver")
    this.driver = await this.storage.get("driver");
  }

  public getDriver(){
    console.log(this.driver)
    return this.driver;
  }
}