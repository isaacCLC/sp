export interface BaseMessage {
  status: boolean;
  data: any;
  error: ErrorMessageData
}

export interface ErrorMessageData {
  errorMessage: string;
  errorCode: number;
  errorTechMessage: string;
}

export interface addUserRegistrationData {
  appUserId: number;
  message: string;
}

export interface addUserRegistrationResponse extends BaseMessage {
  status: boolean;
  data: addUserRegistrationData;
}

export interface SubmemberLoginData {
  subMemberId: string;
  subMemberClientId: string;
  subMemberTitleId: string;
  subMemberFirstName: string;
  subMemberLastName: string;
  subMemberMobileNumber: string;
  subMemberIdNumber: string;
  subMemberRelationshipId: string;
  subMemberFlagManageDependants: string;
  subMemberFlagManageMyPolicyInformation: string;
  subMemberFlagSeeLogClaim: string;
  subMemberFlagSeePolicyWording: string;
  subMemberFlagSeeLimits: string;
  subMemberFlagSeeAssistanceServices: string;
  subMemberFlagSeeContactUs: string;
  subMemberFlagSeeFreeApplications: string;
  subMemberFlagSeeSubscribeApplications: string;
  subMemberSecurityCompany: string;
  subMemberSecurityContactNumber: string;
  subMemberMedicalAidName: string;
  subMemberMedicalAidNumber: string;
  subMemberStreetName: string;
  subMemberTownId: string;
  subMemberProvinceId: string;
  subMemberClientRefId: string;
  valid: string;
}

export interface getUserLoginData {
  appUserId: number;
  logIn: boolean;
  submember: SubmemberLoginData;
}

export interface getUserLoginResponse extends BaseMessage {
  status: boolean;
  data: getUserLoginData;
}

export interface getUserForgotPasswordData {
  appUserId: number;
  foundUser: boolean;
}

export interface getUserForgotPasswordResponse extends BaseMessage {
  status: boolean;
  data: getUserForgotPasswordData;
}

export interface getUserLogoutData {
  appUserId: number;
  logOut: boolean;
}

export interface getUserLogoutResponse extends BaseMessage {
  status: boolean;
  data: getUserLogoutData;
}

export interface updateUserPasswordData {
  appUserId: number;
  message: string;
}

export interface getUpdateUserPasswordResponse extends BaseMessage {
  status: boolean;
  data: updateUserPasswordData;
}

export interface addUserRegistrationData {
  appUserId: number;
  message: string;
}

export interface getAddUserRegistrationResponse extends BaseMessage {
  status: boolean;
  data: addUserRegistrationData;
}

export interface getSchemeInfoSkin {
  scheme_master_id: number;
  scheme_mid_id: number;
  scheme_id: number;
  colour_base: string;
  colour_secondary: string;
  custom_greeting_main: string;
  custom_greeting_sub: string;
  custom_panic_cfa_message: string;
  custom_panic_countdown_message: string;
  custom_panic_paniced_message: string;
  home_page_logo: string;
  customImage1: string;
  customImage2: string;
  customImage3: string;
  customImage4: string;
  customImage5: string;
  web_page?: string;
}

export interface getSchemeInfoData {
  skin: getSchemeInfoSkin;
}

export interface getSchemeInfoResponse extends BaseMessage {
  status: boolean;
  data: getSchemeInfoData;
}

export interface getUserInfoData {
  appUserId: number;
  appUserPolicyNumber: string;
  appUserIdNumber: string;
  appUserEmailAddress: string;
  appUserMobileNumber: string;
  appUsername: string;
  appUserFirstName: string;
  appUserLastName: string;
  appUserSecurityCompany: string;
  appUserSecurityCompanyContactNumber: string;
  appUserMedicalAidName: string;
  appUserMedicalAidNumber: string;
  occupation: number;
  occupationText: string;
  appUserProtectMeCount:number;
  appUserProtectMeUsedCount:number;
  appUserFlagSeeProtectMe:boolean;
  isProtectAvailable:boolean;

}

export interface getUserInfoResponse extends BaseMessage {
  status: boolean;
  data: getUserInfoData;
}

export interface getUserAddressListData {
  home_id: string;
  description: string;
  unit_number: string;
  town_id: string;
  town_description?: any;
  street_name: string;
  suburb: string;
  province_id: string;
  province_name: string;
}

export interface getUserAddressListResponse extends BaseMessage {
  status: boolean;
  data: getUserAddressListData[];
}

export interface SubmemberListData {
  subMemberId: string;
  subMemberFirstName: string;
  subMemberLastName: string;
}

export interface getUserSubMembersData {
  submember: SubmemberListData[];
}

export interface getUserSubMembersResponse extends BaseMessage {
  status: boolean;
  data: getUserSubMembersData;
}

export interface SubmemberData {
  subMemberId: number;
  subMemberClientId: number;
  subMemberTitleId: number;
  ProtectMeAvailable:number;
  protectMeCountUsed:number;
  subMemberTitleIdText: string;
  subMemberFirstName: string;
  subMemberLastName: string;
  subMemberMobileNumber: string;
  subMemberIdNumber: string;
  subMemberRelationshipId: number;
  subMemberRelationshipIdText: string;
  subMemberFlagManageDependants: boolean;
  subMemberFlagManageMyPolicyInformation: boolean;
  subMemberFlagSeeLogClaim: boolean;
  subMemberFlagSeePolicyWording: boolean;
  subMemberFlagSeeLimits: boolean;
  subMemberFlagSeeAssistanceServices: boolean;
  subMemberFlagSeeContactUs: boolean;
  subMemberFlagSeeProtectMe:boolean;
  subMemberFlagSeeFreeApplications: boolean;
  subMemberFlagSeeSubscribeApplications: boolean;
  subMemberSecurityCompany: string;
  subMemberSecurityContactNumber: string;
  subMemberMedicalAidName: string;
  subMemberMedicalAidNumber: string;
  subMemberStreetName: string;
  subMemberTownId: number;
  subMemberTownIdText: string;
  subMemberProvinceId: number;
  subMemberProvinceIdText: string;
  valid: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface getSubMemberInfoData {
  submember: SubmemberData;
}

export interface getSubMemberInfoResponse extends BaseMessage {
  status: boolean;
  data: getSubMemberInfoData;
}

export interface getPanicLoggedData {
  message: string;
  callReference: string;
}

export interface getPanicLoggedResponse extends BaseMessage {
  status: boolean;
  data: getPanicLoggedData;
}

export interface getProtectMeBalanceResponse extends BaseMessage {
  status: boolean;
  data: getProtectMeBalanceData;
}

export interface getProtectMeBalanceData {
  licenseBalance: number;
}

export interface getMasterProductListResponseSubProduct {
  subSubProductId: number;
  subSubProductName: string;
  subSubProductOrderNumber: string;
  subSubProductSvgImgPath: string;
  subSubProductHeaderImagePath: string;
  linkTo: string;
}

export interface getMasterProductListData {
  subProductId: number;
  subProductName: string;
  order_number: string;
  img_path: string;
  header_img_path: string;
  showNeedTow: boolean;
  subProducts: getMasterProductListResponseSubProduct[];
}

export interface getMasterProductListResponse extends BaseMessage {
  status: boolean;
  data: getMasterProductListData[];
}

export interface getHomeProductListData {
  HomeProductName: string;
  SvgImgPath: string;
  HeaderImagePath: string;
}

export interface getHomeProductListResponse extends BaseMessage {
  status: boolean;
  data: getHomeProductListData[];
}

export interface getLookupData {
  lookup_item_id: string;
  title: string;
}

export interface getLookupResponse extends BaseMessage {
  status: boolean;
  data: getLookupData[];
}

export interface addSubMemberRegisterData {
  subMemberId: string;
  action: string;
}

export interface addSubMemberRegisterResponse extends BaseMessage {
  status: boolean;
  data: addSubMemberRegisterData[];
}

export interface getProfilePolicyWordingData {
  policyWording: string;
}

export interface getProfilePolicyWordingResponse extends BaseMessage {
  status: boolean;
  data: getProfilePolicyWordingData;
}

export interface getUserCallsListData {
  call_reference_number: string;
  product_name: string;
  sub_product_name: string;
  sub_sub_product_name: string;
  call_date_opened: string;
  call_status_description: string;
  claimType: number;
}

export interface getUserCallsListResponse extends BaseMessage {
  status: boolean;
  data: getUserCallsListData[];
}

export interface AddClaimData {
  message: string;
  messageHTML: string;
  callRef: string;
  callId: number;
  action: string;
}

export interface addClaimResponse extends BaseMessage {
  status: boolean;
  data: AddClaimData[];
}

export interface addToDocumentWarehouseResponseData {
  callId: string;
  mimeType: string;
  docUrl: string;
}

export interface addToDocumentWarehouseResponse extends BaseMessage {
  status: boolean;
  data: addToDocumentWarehouseResponseData;
}

export interface getDocumentTypesListResponseData {
  document_type_id: string;
  document_type_description: string;
}

export interface getDocumentTypesListResponse extends BaseMessage {
  status: boolean;
  data: getDocumentTypesListResponseData[];
}


// ↓↓↓↓↓↓ getAddressFromLatLong ↓↓↓↓↓↓
export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast2 {
  lat: number;
  lng: number;
}

export interface Southwest2 {
  lat: number;
  lng: number;
}

export interface Bounds {
  northeast: Northeast2;
  southwest: Southwest2;
}

export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds: Bounds;
}

export interface PlusCode2 {
  compound_code: string;
  global_code: string;
}

export interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: PlusCode2;
  types: string[];
}

export interface getAddressFromLatLongData {
  plus_code: PlusCode;
  results: Result[];
  status: string;
}

export interface getAddressFromLatLongResponse extends BaseMessage {
  status: boolean;
  data: getAddressFromLatLongData;
}

export interface GetUserVehicleListResponseData {
  vehId: number;
  clientId: number;
  vehicleDescription: string;
  vehicleType: number;
  vehicleTypeDescription: string;
  registrationNumber: string;
  makeId: number;
  makeDescription: string;
  model: string;
  vehicleYear: string;
  vehicleColour: string;
  vehicleTransmission: string;
  vehicleUnderWarrantee: number;
  vehicleUnderWarranteeDescription: string;
  vehicleVinNumber?: any;
  vehicleChassisNumber?: any;
  car_hire_group?: any;
  vehicleSpId: number;
  vehicleImageUrl?: any;
  valid: number;
  dontUpdate: boolean;
}

export interface GetUserVehicleListResponse extends BaseMessage {
  status: boolean;
  data: GetUserVehicleListResponseData[];
}

export interface FaqData {
  faqId: number;
  faqQuestion: string;
  faqAnswer: string;
}

export interface GetFaqResponse extends BaseMessage {
  status: boolean;
  data: FaqData[];
}

export interface TosData {
  content: string;
}

export interface GetTosResponse extends BaseMessage {
  status: boolean;
  data: TosData;
}

export interface ContactData {
  content: string;
}

export interface SettingsData {
  id: number;
  setting_description: string,
  in_app_wording: string
}


export interface GetContactResponse extends BaseMessage {
  status: boolean;
  data: ContactData;
}

export interface GetSettingsResponse extends BaseMessage {
  status: boolean;
  data: SettingsData[];
}


export interface addServiceRatingData {
  message: string;
}

export interface addServiceRatingResponse extends BaseMessage {
  status: boolean;
  data: addServiceRatingData;
}

export interface SetLocationData {
  logId: number;
}

export interface SetLocationResponse extends BaseMessage {
  status: boolean;
  data: SetLocationData;
}


export interface DateCreated {
  date: string;
  timezone_type: number;
  timezone: string;
}

export interface DateUpdated {
  date: string;
  timezone_type: number;
  timezone: string;
}

export interface Driver {
  driverId: number;
  driverIdNumber: string;
  driverFirstName: string;
  driverLastName: string;
  driverAddressId: number;
  driverAddressDescription: string;
  driverAddressUnitNumber: string;
  driverAddressStreetName: string;
  driverAddressSuburb: string;
  driverAddressTownId: number;
  driverAddressProvinceId: number;
  driverContactNumber: string;
  driverEmailAddress: string;
  driverOccupation: string;
  driverLicenceCode: string;
  driverLicenceDateIssued: string;
  driverLicenceType: string;
  driverLicenceNumber: string;
  driverVehiclePurpose: string;
  driverFlagUnderEmployment: boolean;
  driverPreviousMotorOffences: boolean;
  driverFlagLicenceEndorsed: boolean;
  driverFlagPhysicalDisabilities: boolean;
  driverFlagSober: boolean;
  driverValid: number;
  driverSpId: number;
  driverImageUrl: string;
  call_id: number;
  dateCreated: DateCreated;
  dateUpdated: DateUpdated;
  loginCount: number;
  driverSupplier:string;
}

export interface Vehicle {
  vehId: number;
  clientId: number;
  vehicleType: number;
  vehicleDescription: string;
  vehicleTypeDescription: string;
  registrationNumber: string;
  makeId: number;
  makeDescription: string;
  model: string;
  vehicleYear: string;
  vehicleColour: string;
  vehicleTransmission: string;
  vehicleUnderWarrantee: number;
  vehicleUnderWarranteeDescription: string;
  vehicleVinNumber: string;
  vehicleChassisNumber: string;
  car_hire_group?: any;
  vehicleSpId: number;
  vehicleImageUrl: string;
  valid: number;
}

export interface FinalDestination {
  fdId: string;
  fdName: string;
  fdContactNumber: string;
  fdAddress: string;
}

export interface GetDriverLocationData {
  logId: number;
  logDate: string;
  latitude: number;
  longitude: number;
  bearing: number;
  bearingText: string;
  travelDistance: string;
  travelDistanceValue: number;
  travelETA: string;
  travelETAValue: number;
  clientDestArrive: number;
  clientDestArriveMessage: string;
  bearingFin: number;
  bearingTextFin: string;
  travelDistanceFin: string;
  travelDistanceValueFin: number;
  travelETAFin: string;
  travelETAValueFin: number;
  travelFinLatitude: number;
  travelFinLongitude: number;
  clientDestArriveFin: number;
  clientDestArriveFinMessage: string;
  callCentreContact: string;
  spProcessCompleted: boolean;
  userFinalFeedbackReceived: boolean;
  driver: Driver;
  vehicle: Vehicle;
  finalDestination: FinalDestination;
}

export interface GetDriverLocationResponse extends BaseMessage {
  status: boolean;
  data: GetDriverLocationData;
}

export interface GetLocationData {
  logId: number;
  logDate: string;
  latitude: number;
  longitude: number;
}

export interface GetServiceRequestData {
  driverID: number,
  serviceRequestId: number,
  pushRequest: string
}

export interface GetServiceRequestResponse extends BaseMessage {
  status: boolean;
  data: GetServiceRequestData[];
}

export interface GetLocationResponse extends BaseMessage {
  status: boolean;
  data: GetLocationData;
}

export interface NotificationData {
  notificationId: number;
  action: string;
  callRef: string;
  message: string;
  title: string;
  messageTitle: string;
  hasRead: boolean;
  dateSent: string;
}

export interface getNotificationsResponse extends BaseMessage {
  status: boolean;
  data: NotificationData[];
}

export interface clearNotificationResponse extends BaseMessage {
  status: boolean;
  data: NotificationData[];
}

export interface getLoginRequestData {
  requestId: number;
  authToken: string;
  appUserId: number;
  logIn: boolean;
  username: string;
}

export interface getLoginRequestResponse extends BaseMessage {
  status: boolean;
  data: getLoginRequestData;
}

export interface getHomeAlertButtonsExtraParams {
  dialerNumber: string;
}

export interface getHomeAlertButtonsData {
  HomeProductName: string;
  sysName: string;
  SvgImgPath: string;
  HeaderImagePath: string;
  extraParams: getHomeAlertButtonsExtraParams;
}

export interface getHomeAlertButtonsResponse extends BaseMessage {
  status: boolean;
  data: getHomeAlertButtonsData[];
}

export interface getClaimTypesListData {
  claimTypeIdOld:number;
  claimTypeId: number;
  claimImagePath:string;
  claimTypeName: string;
}

export interface getClaimTypesListResponse extends BaseMessage {
  status: boolean;
  data: getClaimTypesListData[];
}

export interface getDecodedSALicense{
  status:string;
  result?:decodedResults;
  error?:any;
}
interface decodedResults{
  Id:string;
  DateOfBirth:string;
}
export interface getSALicenseAPIKey{
  status:string;
  result?:any;
  error?:any;
}
