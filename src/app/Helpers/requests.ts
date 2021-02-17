import { CheckList } from "./claim-manager";

export interface addSubMemberRegisterRequest {
  call: Call;
  submember: addSubMemberRegisterRequestData[];
}

export interface updateSubMemberRequest {
  call: Call;
  submember: updateSubMemberData[];
}

export interface Call {
  appUserId: number;
}

export interface addSubMemberRegisterRequestData {
  subMemberTitleId: number;
  subMemberFirstName: string;
  subMemberLastName: string;
  subMemberMobileNumber: string;
  subMemberIdNumber: string;
  subMemberRelationshipId: number;
  subMemberFlagManageDependants: boolean;
  // subMemberFlagManageMyPolicyInformation: boolean;
  subMemberFlagSeeLogClaim: boolean;
  subMemberFlagSeePolicyWording: boolean;
  // subMemberFlagSeeLimits: boolean;
  subMemberFlagSeeAssistanceServices: boolean;
  subMemberFlagSeeContactUs: boolean;
  // subMemberFlagSeeFreeApplications: boolean;
  // subMemberFlagSeeSubscribeApplications: boolean;
  subMemberFlagSeeProtectMe:boolean;
  subMemberSecurityCompany: string;
  subMemberSecurityContactNumber: string;
  subMemberMedicalAidName: string;
  subMemberMedicalAidNumber: string;
  subMemberStreetName: string;
  subMemberTownId: number;
  subMemberProvinceId: number;
  // subMemberClientRefId: number;
}

export interface updateSubMemberData {
  subMemberId: number;
  subMemberTitleId: number;
  subMemberFirstName: string;
  subMemberLastName: string;
  subMemberMobileNumber: string;
  subMemberIdNumber: string;
  subMemberRelationshipId: number;
  subMemberFlagManageDependants: boolean;
  // subMemberFlagManageMyPolicyInformation: boolean;
  subMemberFlagSeeLogClaim: boolean;
  subMemberFlagSeePolicyWording: boolean;
  // subMemberFlagSeeLimits: boolean;
  subMemberFlagSeeAssistanceServices: boolean;
  subMemberFlagSeeContactUs: boolean;
  subMemberFlagSeeProtectMe:boolean;
  // subMemberFlagSeeFreeApplications: boolean;
  // subMemberFlagSeeSubscribeApplications: boolean;
  subMemberSecurityCompany: string;
  subMemberSecurityContactNumber: string;
  subMemberMedicalAidName: string;
  subMemberMedicalAidNumber: string;
  subMemberStreetName: string;
  subMemberTownId: number;
  subMemberProvinceId: number;
  subMemberClientRefId: number;
  valid: boolean;
}

export interface AddClaimCall {
  callRef: string;
  appUserId: number;
  insuredAddressId: number;
  vehicleId: number;
  accAccidentalDamageFlag: boolean;
  accBlameDescription: string;
  accCondDescription: string;
  accCondLighs: string;
  accCondRoad: string;
  accCondStreetLight: string;
  accCondVisible: string;
  accCondWeather: string;
  accCondWidth: string;
  accDateOfLoss: string;
  accDetailedDescription: string;
  accDriverRefusedFlag: number;
  accDriverSober: number;
  accDriverUnderEmploymentFlag: boolean;
  accEstimateTravelingSpeed: number;
  accFlagBurstGeyser: boolean;
  accFlagCarpets: boolean;
  accFlagCeiling: boolean;
  accFlagCupboards: boolean;
  accFlagFloors: boolean;
  accFlagGeyserRepair: boolean;
  accFlagLossByThirdParty: boolean;
  accFlagOtherDamage: boolean;
  accFlagResultantDamage: boolean;
  accGeyserSize: string;
  accInchargeAddress: string;
  accInchargeContactNumber: string;
  accInchargeEmailAddress: string;
  accInchargeFirstName: string;
  accInchargeIdNumber: string;
  accInchargeLastName: string;
  accInchargeOccupation: string;
  accLackOfCare: number;
  accLastDateOfOccupation: string;
  accLossTheftFlag: boolean;
  accOtherDescription: string;
  accPlace: string;
  accPoliceNotReportedDescription: string;
  accPoliceReference: string;
  accPoliceReportedDate: string;
  accPoliceReportedDescription: string;
  accPoliceReportedFlag: boolean;
  accPoliceStation: string;
  accPremiseOccupied: string;
  accPreviousLossDescription: string;
  accPreviousLossInsurerName: string;
  accPreviousLossSimilar: string;
  accPurposeOfOccupation: string;
  accPurposeOfUse: string;
  accStolenDetailsDescription: string;
  accTimeOfLoss: string;
  accVehicleLocked: string;
  accVehicleLockedDescription: string;
  accVesselLocation: string;
  accVesselRecoveryFlag: boolean;
  accVesselSafeguard: string;
  accVesselSunkFlag: boolean;
  contactNumber: string;
  emailAddress: string;
  financeCompanyAccountNumber: string;
  financeCompanyAddress: string;
  financeCompanyDetails: string;
  firstName: string;
  idNumber: string;
  lastName: string;
  medAsResultOfLoss: number;
  occupation: number;
  occupationText: string;
  ownDamageDescription: string;
  ownDamageInspectionLocation: string;
  physicalAddress: string;
  policyNumber: string;
  propBuildingHasThatchRoof: boolean;
  propEstValue: string;
  propEstValueOfBuilding: string;
  propEstValueOfContents: string;
  propFlagIsSoleOwner: boolean;
  propOtherInsurance: string;
  propOtherInsuranceContact: string;
  propOtherInsuranceName: string;
  propOtherInsuranceNotes: string;
  propOtherNotes: string;
  propOtherOwnerContactNumber: string;
  propOtherOwnerFirstName: string;
  propOtherOwnerLastName: string;
  propPropertyBond: string;
  propPropertyBondContact: string;
  propPropertyBondHolder: string;
  propSoleOwnerDescription: string;
  repAddress: string;
  repContactNumber: string;
  repEstimate: string;
  repName: string;
  salvageAddress: string;
  salvageContactNumber: string;
  salvageDealerName: string;
  salvageDescription: string;
  salvageServicesRendered: string;
  vehicleOdometerReading: string;
  vehicleOtherFeaturesDescription: string;
  vehicleOwnerAddress: string;
  vehicleOwnerContactNumber: string;
  vehicleOwnerEmail: string;
  vehicleOwnerIdAddress: string;
  vehicleOwnerIdNumber: string;
  vehicleOwnerName: string;
  vehicleOwnerOccupation: string;
  vehicleOwnerSurname: string;
  vehicleScratchesAndDentsDescription: string;
  vehicleValue: string;
  vehicleWindowMarkingDescription: string;
  claimType: string;
  chPolicyNo: string;
  chInsuranceBroker: string;
  chPersonalIdNo: string;
  chPersonalEmail: string;
  chPersonalName: string;
  chPersonalSurname: string;
  chPersonalContactNo: string;
  chPersonalAltContactNo: string;
  chAccIncidentType: string;
  chAccDateOfIncident: string;
  chStartDateOfCarHire: string;
  chEstDaysRequired: number;
  chCarGroup: string;
  chDaysAllowed: number;
  chUpgrade: boolean;
  chUpgradeVehicleMake: number;
  chUpgradeVehicleModel: string;
  chCollectionDelivery: string;
  chDeliveryAddress: string;
  chDeliveryDate: string;
  chDeliveryTime: string;
  chAdditionalInfo: string;
  chClaimsHandlerName: string;
  chClaimsHandlerContactNo: string;
  chClaimsHandlerEmail: string;
  chClaimNumber: string;
  chPanelBeaterName: string;
  chPanelBeaterContactNo: string;
  chPanelBeaterEmail: string;
  chQuotationNo: string;
  chVehicleRegistrationNumber: string;
  chVehicleModel: string;
  chVehicleMake: number;
  subProductId: number;
  subSubProductId: number;
  makeDescription: string;
  feelUnsafeFlag: boolean;
  locationAccessTypeId: number;
  moreThan100kmFlag: boolean;
  pullingTrailerFlag: boolean;
  requireAssistanceGettingHomeFlag: boolean;
  pullingLoadDescription: string;
  numberOfPassengers: number;
  destinationIsHomeFlag: boolean;
  destinationName: string;
  destinationAddress: string;
  typeOfIncidentId: number;
  finArrived: number;
  clientArrived: number;
}

export interface Passenger {
  passengerId: number;
  pasFirstName: string;
  pasLastName: string;
  pasIdNumber: string;
  pasContactNumber: string;
  pasInjuriesDescription: string;
  pasPurpose: string;
  pasAddress: string;
  pasValid: boolean;
}

export interface Witness {
  witnessFirstName: string;
  witnessLastName: string;
  witnessContactNumber: string;
  witnessAddress: string;
  witnessIdNumber: string;
}

export interface Property {
  propId: number;
  propAddress: string;
  propAddressOfLoss: string;
  propAmountClaimed: string;
  propAmountPaid: string;
  propAmountPaidRepair: string;
  propAmountPaidReplace: string;
  propApplyNewSim: string;
  propApplyNewSimDate: string;
  propClaimLoggedAmount: string;
  propClaimLoggedFlag: boolean;
  propClaimSettlementOfferFlag: boolean;
  propContactNumber: string;
  propContactWith: string;
  propCrewTotal: number;
  propDamageDescription: string;
  propDamagedStolenLost: string;
  propDateCancelled: string;
  propDateOfDamage: string;
  propDateOfLoss: string;
  propDateOfPurchase: string;
  propDescription: string;
  propDescriptionOfDamage: string;
  propDescriptionOfLoss: string;
  propDesignedSpeed: string;
  propEstValueOfReplacement: string;
  propFirstName: string;
  propFlagHasHP: boolean;
  propFlagIsSoleOwner: boolean;
  propFlagWasRepaired: boolean;
  propFlagWasReplaced: boolean;
  propHorsePower: string;
  propHPAccountNumber: string;
  propHPBalance: string;
  propHPCompany: string;
  propHPPeriodMonths: number;
  propICTNumber: string;
  propIdNumber: string;
  propLastName: string;
  propLengthFeet: number;
  propLineCancelled: boolean;
  propMake: string;
  propMarketValue: string;
  propModel: string;
  propOwnerAddress: string;
  propOwnerContactNumber: string;
  propOwnerFirstName: string;
  propOwnerIdNumber: string;
  propOwnerLastName: string;
  propPaintworkDescription: string;
  propRegistrationNumber: string;
  propRepairCompany: string;
  propReplaceCompany: string;
  propReplacementValue: string;
  propSerialNumber: string;
  propSimInCell: boolean;
  propSoleOwnerDescription: string;
  propSumInsured: string;
  propType: string;
  propTyreRemainingThread: string;
  propWherePurchased: string;
  propYear: number;
  propValid: boolean;
}

export interface Thirdparty {
  tpId: number;
  tpFirstName: string;
  tpLastName: string;
  tpIdNumber: string;
  tpContactNumber: string;
  tpAddress: string;
  tpVehicleMake: number;
  tpMakeDescription: string;
  tpVehicleModel: string;
  tpVehicleRegistrationNumber: string;
  tpVehicleDescriptionOfDamage: string;
  tpVehicleOwnerFirstName: string;
  tpVehicleOwnerLastName: string;
  tpVehicleOwnerIdNumber: string;
  tpVehicleOwnerContactDetails: string;
  tpVehicleOwnerAddress: string;
  tpValid: boolean;
  tpPropertyDescription: string;
  tpDamageDescription: string;
  tpIsInsured: boolean;

}

export interface Vehicle {
  vehId: number;
  vehicleDescription: string;
  vehicleTypeId: number;
  registrationNumber: string;
  makeId: number;
  make: string;
  model: string;
  vehicleYear: number;
  vehicleColour: string;
  vehicleTransmission: string;
  vehicleUnderWarrantee: boolean;
  vehicleVinNumber: string;
  vehicleChassisNumber: string;
  vehicleClientRefId: string;
  vehicleValid: boolean;
  dontUpdate: boolean;
}

export interface Address {
  addressId: number;
  description: string;
  unitNumber: string;
  streetName: string;
  suburb: string;
  townId: number;
  provinceId: number;
  valid: boolean;
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
  driverValid: boolean;
}

export interface Claimant {
  claimantId: number;
  claimantAddress: string;
  claimantContactNumber: string;
  claimantFirstName: string;
  claimantIdNumber: string;
  claimantLastName: string;
  claimantOccupation: string;
  claimantValid: boolean;
}

export interface Patient {
  injuredId: number;
  injuredAddress: string;
  injuredClaimAmount: string;
  injuredClaimLoggedFlag: boolean;
  injuredClaimSettlementOfferFlag: boolean;
  injuredContactNumber: string;
  injuredDescriptionOfInuries: string;
  injuredFirstName: string;
  injuredIdNumber: string;
  injuredLastName: string;
  injuredValid: boolean;
  injuredMedicalCosts: number;
  injuredMedicalServiceProvider: string;

}

export interface AddClaimRequest {
  call: AddClaimCall;
  passenger: Passenger[];
  witness: Witness[];
  property: Property[];
  thirdparty: Thirdparty[];
  vehicle: Vehicle[];
  address: Address[];
  claimant: Claimant[];
  patient: Patient[];
  drivers: Driver[];
  callID: string;
  checklist: CheckList;
}

export interface SetLocationRequest {
  appUserId: number;
  latitude: number;
  longitude: number;
  callRef: string;
  mobileNumber: string;
}