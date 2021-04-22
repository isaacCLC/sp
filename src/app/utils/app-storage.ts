import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CurrentClaim } from '../helpers/claim-manager';

import { DeviceInfo } from './device-info';

// npm i @ionic/storage
// ionic cordova plugin add cordova-sqlite-storage --save

@Injectable({
    providedIn: 'root',
})
export class AppStorage {

    constructor(public device: DeviceInfo, public storage: Storage) {
    }

    /**
     * Clear variables used on login.
     */
    async logoutClear() {
        //await this.setUsername('');
        await this.setAppUserId(0);
        await this.setPanicPressHistory(null);
        await this.setLastLoginTime(null);
    }

    /* STORAGE VALUES */

    ////////////
    public async getUsername(): Promise<string> {
        let item = await this.getValue<string>("Username");
        if (!item)
            return "";
        return item;
    };
    public setUsername(value: string) {
        return this.setValue("Username", value);
    }

///////
    public setUserProfile(value:string){
        return this.setValue("userProfile",value)
    }

    public getUserProfile(value:string){
        return this.getValue("userProfile")
    }

    ////////////
    public async getAppUserId(): Promise<number> {
        let item = await this.getValue<number>("AppUserId");
        if (!item)
            return 0;
        return item;
    };
    public setAppUserId(value: number) {
        return this.setValue("AppUserId", value);
    }

    ////////////
    public async getPanicPressHistory(): Promise<PanicPressHistory[]> {
        let item = await this.getValue<PanicPressHistory[]>("PanicPressHistory");
        if (!item)
            return [];
        return item;
    };
    public setPanicPressHistory(value: PanicPressHistory[]) {
        return this.setValue("PanicPressHistory", value);
    }





    ////////////
    public async getLastKnownLatitude(): Promise<number> {
        let item = await this.getValue<number>("LastKnownLatitude");
        if (!item)
            return 0;
        return item;
    };
    public setLastKnownLatitude(value: number) {
        return this.setValue("LastKnownLatitude", value);
    }

    ////////////
    public async getLastKnownLongitude(): Promise<number> {
        let item = await this.getValue<number>("LastKnownLongitude");
        if (!item)
            return 0;
        return item;
    };
    public setLastKnownLongitude(value: number) {
        return this.setValue("LastKnownLongitude", value);
    }

    ////////////
    public async getLastLoginTime(): Promise<string> {
        let item = await this.getValue<string>("LastLoginTime");
        if (!item)
            null;
        return item;
    };

    public setLastLoginTime(value: string) {
        return this.setValue("LastLoginTime", value);
    }



    ////////////
    public async getAccidentGuideId(): Promise<string> {
        let item = await this.getValue<string>("AccidentGuideId");
        if (!item)
            null;
        return item;
    };

    public setAccidentGuideId(value: string) {
        return this.setValue("AccidentGuideId", value);
    }

    ////////////
    public async getClaims(): Promise<Map<string, CurrentClaim>> {
        let item: Map<string, CurrentClaim> = new Map(JSON.parse((await this.getValue<string>("Claims"))));
        if (!item)
            null;
        return item;
    };

    public setClaims(value: Map<string, CurrentClaim>) {
        return this.setValue("Claims", JSON.stringify(Array.from(value.entries())));
    }

    ////////////
    public async getClaimId(): Promise<string> {
        let item = await this.getValue<string>("ClaimId");
        if (!item)
            null;
        return item;
    };

    public setClaimId(value: string) {
        return this.setValue("ClaimId", value);
    }

    ////////////
    public async getCurrentServiceRequest(): Promise<CurrentClaim> {
        let item = await this.getValue<CurrentClaim>("CurrentServiceRequest");
        if (!item)
            null;
        return item;
    };

    public setCurrentServiceRequest(value: CurrentClaim) {
        return this.setValue("CurrentServiceRequest", value);
    }

    ////////////
    public async getPushPlayerId(): Promise<string> {
        let item = await this.getValue<string>("AppPushPlayerId");
        if (!item)
            return '';
        return item;
    };
    public setPushPlayerId(value: string) {
        return this.setValue("AppPushPlayerId", value);
    }

    ////////////
    public async getVersionNumber(): Promise<string> {
        let item = await this.getValue<string>("AppVersionNumber");
        if (!item)
            return '';
        return item;
    };
    public setVersionNumber(value: string) {
        return this.setValue("AppVersionNumber", value);
    }

    /**
     * Saves a value to the storage engine.
     */
    private setValue(key: string, value: any): Promise<any> {
        return this.storage.set(key, value);
    }

    /**
     * Retrieves a specific value from the storage engine.
     */
    private async getValue<T>(key: string): Promise<T> {
        const item = await this.storage.get(key);
        return item;
    }
}

export class PanicPressHistory {
    id: string;
    date: string;
    callReference: string;
}