import { Injectable } from "@angular/core";
import * as moment from 'moment';
import { AppConfig } from "./app-config";
import { AppStorage } from "./app-storage";
import { PushMessage } from "./push-message";
import { getHomeProductListData, getLookupResponse, getMasterProductListResponse, SubmemberLoginData } from "./responses";


@Injectable({
  providedIn: 'root'
})
export class UserState {

  isLoggedIn: boolean = false;
  appUserId: number;
  masterProductList: getMasterProductListResponse;
  isSubMember: boolean = false;
  subMemberData: SubmemberLoginData;
  lookupValues: Map<number, getLookupResponse> = new Map();

  constructor(private appStorage: AppStorage, private push: PushMessage) {
  }

  async init() {
    this.appUserId = await this.appStorage.getAppUserId();
    if (this.appUserId > 0) {
      this.isLoggedIn = true;
      this.subMemberData = await this.appStorage.getSubMemberData();
      this.isSubMember = this.subMemberData != null;
    }
  }

  async login(username: string, appUserId: number, subMemberData: SubmemberLoginData) {
    console.log(username)
    console.log(appUserId)
    console.log(subMemberData)
    this.isLoggedIn = true;
    this.appUserId = appUserId;
    await this.appStorage.setUsername(username);
    await this.appStorage.setAppUserId(appUserId);
    await this.appStorage.setLastLoginTime(moment().toISOString());
    console.log("Setting sub member")
    if (subMemberData) {
      console.log("setting sub member data")
      await this.appStorage.setSubMemberData(subMemberData);
      this.isSubMember = true;
    }
  }

  async logout() {
    this.isLoggedIn = false;
    this.lookupValues = new Map();
    await this.appStorage.logoutClear();
    AppConfig.DeepLinkAuthToken = '';
  }

  calcRoute(product: getHomeProductListData): string {
    switch (product.HomeProductName) {
      case "Claims":
        return "/claim/menu";
      case "Accident Guide":
        return "/accident-guide/menu";
      case "Assistance Services":
        return "/assistanceservices";
    }
  }
}