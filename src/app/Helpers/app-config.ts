
export class AppConfig {

    public static ApiKey: string = '15fc9b573b4eadda81d386689dfaff3a';
    public static DeepLinkAuthToken: string = '';
    public static get AppVersion(): string { return '3.1.0' };
    public static manateeWorksKey:string ; //LICENSE KEY used to decode driver 's lic Barcode
        
    // CLC
    public static get OneSignalAppId(): string { return "9cc34c59-1dd6-4afa-85db-4370f3c8f480" };
    public static get OneSignalGoogleProjectNumber(): string { return "141939107953" };

    // PSG
    // public static get OneSignalAppId(): string { return "3ab9c275-1920-41a8-b715-6ec5943bb8b4" };
    // public static get OneSignalGoogleProjectNumber(): string { return "675906584274" };

}
