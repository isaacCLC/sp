import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AppStorage } from "./app-storage";
import { MediaManagerResult } from "./media-manager";
import { AddClaimCall, AddClaimRequest, Address, Claimant, Driver, Passenger, Patient, Property, Thirdparty, Vehicle, Witness } from "./requests";
import { getUserInfoResponse } from "./responses";
import { UserState } from "./user-state";
@Injectable()
export class ClaimManager {

  private claims: Map<string, CurrentClaim> = undefined;
  private claimId: string = '';

  constructor(private storage: Storage, private appStorage: AppStorage, private state: UserState) {
  }


  async getClaims() {
    if (!this.claims) {
      let response = await this.appStorage.getClaims();
      if (response)
        this.claims = response;
      else
        this.claims = new Map<string, CurrentClaim>();
    }
    return this.claims;
  }

  async setClaims() {
    if (!this.claims)
      await this.appStorage.setClaims(null);
    else
      await this.appStorage.setClaims(this.claims);
  }

  async updateClaims(id: string, claim: CurrentClaim) {
    if (!this.claims)
      this.claims = new Map<string, CurrentClaim>();
    claim.lastUpdated = moment().toISOString();
    this.claims = this.claims.set(id, claim);
    await this.setClaims();
  }

  async deleteClaim(id: string) {
    if (!this.claims.has(id))
      return;

    this.claims.delete(id);
    if (this.claimId == id)
      await this.setClaimId(null);

    await this.setClaims();
  }

  async setClaimId(id: string) {
    this.claimId = id;
    this.appStorage.setClaimId(this.claimId);
  }

  async getClaimId() {
    if (!this.claimId || this.claimId == '') {
      let response = await this.appStorage.getClaimId();
      if (response == null)
        this.claimId = '';
      else
        this.claimId = response;
    }
    return this.claimId;
  }

  async formatClaim(claim: CurrentClaim) {
    let accTimeOfLoss = moment(claim.call.accTimeOfLoss || '');
    let accDateOfLoss = moment(claim.call.accDateOfLoss || '');
    let accLastDateOfOccupation = moment(claim.call.accLastDateOfOccupation || '');
    let accPoliceReportedDate = moment(claim.call.accPoliceReportedDate || '');
    let chAccDateOfIncident = moment(claim.call.chAccDateOfIncident || '');
    let chStartDateOfCarHire = moment(claim.call.chStartDateOfCarHire || '');
    let chDeliveryDate = moment(claim.call.chDeliveryDate || '');

    claim.call.accTimeOfLoss = accTimeOfLoss.isValid() ? accTimeOfLoss.format('hh:mm:ss') : "";
    claim.call.accDateOfLoss = accDateOfLoss.isValid() ? accDateOfLoss.format('YYYY-MM-DD') : "";
    claim.call.accLastDateOfOccupation = accLastDateOfOccupation.isValid() ? accLastDateOfOccupation.format('YYYY-MM-DD') : "";
    claim.call.accPoliceReportedDate = accPoliceReportedDate.isValid() ? accPoliceReportedDate.format('YYYY-MM-DD') : "";
    claim.call.chAccDateOfIncident = chAccDateOfIncident.isValid() ? chAccDateOfIncident.format('YYYY-MM-DD') : "";
    claim.call.chStartDateOfCarHire = chStartDateOfCarHire.isValid() ? chStartDateOfCarHire.format('YYYY-MM-DD') : "";
    claim.call.chDeliveryDate = chDeliveryDate.isValid() ? chDeliveryDate.format('YYYY-MM-DD') : "";

    claim.vehicle.forEach(x => {
      x.vehicleYear = Number.parseInt(moment(x.vehicleYear || '').format('YYYY'));
    });
    claim.property.forEach(x => {
      let propDateCancelled = moment(x.propDateCancelled || '');
      let propApplyNewSimDate = moment(x.propApplyNewSimDate || '');
      let propDateOfDamage = moment(x.propDateOfDamage || '');
      let propDateOfLoss = moment(x.propDateOfLoss || '');
      let propDateOfPurchase = moment(x.propDateOfPurchase || '');
      x.propDateOfPurchase = moment(x.propDateOfPurchase || '').format('YYYY-MM-DD');
      x.propDateCancelled = propDateCancelled.isValid() ? propDateCancelled.format('YYYY-MM-DD') : "";
      x.propApplyNewSimDate = propApplyNewSimDate.isValid() ? propApplyNewSimDate.format('YYYY-MM-DD') : "";
      x.propDateOfDamage = propDateOfDamage.isValid() ? propDateOfDamage.format('YYYY-MM-DD') : "";
      x.propDateOfLoss = propDateOfLoss.isValid() ? propDateOfLoss.format('YYYY-MM-DD') : "";
      x.propDateOfPurchase = propDateOfPurchase.isValid() ? propDateOfPurchase.format('YYYY-MM-DD') : "";
    });

    claim.drivers.forEach(x => {
      let driverLicenceDateIssued = moment(x.driverLicenceDateIssued || '');
      x.driverLicenceDateIssued = driverLicenceDateIssued.isValid() ? driverLicenceDateIssued.format('YYYY-MM-DD') : "";
    });


    return claim;
  }

  addUserInfo(claim: CurrentClaim, userInfo: getUserInfoResponse) {
    claim.call.contactNumber = userInfo.data.appUserMobileNumber;
    claim.call.emailAddress = userInfo.data.appUserEmailAddress;
    claim.call.idNumber = userInfo.data.appUserIdNumber;
    claim.call.firstName = userInfo.data.appUserFirstName;
    claim.call.policyNumber = userInfo.data.appUserPolicyNumber;
    claim.call.lastName = userInfo.data.appUserLastName;
    claim.call.occupation = userInfo.data.occupation;
    return claim;
  }

}

export enum ClaimTypeId {
  MotorAccidentTP = 118,
  MotorAccidentSingle = 119,
  MotorTheft = 121,
  PublicLiability = 128,
  Gadget = 127,
  AllRisk = 126,
  Glass = 120,
  TyreAndRim = 122,
  SmallCraftLeisure = 123,
  PropertyLoss = 124,
  Geyser = 125,

}

export class CurrentClaim implements AddClaimRequest {

  constructor() {
    this.call = new ClaimCall();
    this.passenger = [];
    this.witness = [];
    this.property = [];
    this.thirdparty = [];
    this.vehicle = [];
    this.address = [];
    this.isThirdParty = false;
    this.completed = [];
    this.claimant = [];
    this.patient = [];
    this.drivers = [];
    this.images = new ClaimImages();
  }
  claimName: string = '';
  lastUpdated: string = '';
  call: ClaimCall;
  passenger: ClaimPassenger[] = [];
  witness: ClaimWitness[] = [];
  property: ClaimProperty[] = [];
  thirdparty: ClaimThirdparty[] = [];
  vehicle: ClaimVehicle[];
  address: ClaimAddress[] = [];
  isThirdParty: boolean;
  completed: number[] = [];
  claimant: ClaimClaimant[];
  patient: ClaimPatient[];
  drivers: ClaimDriver[];
  images: ClaimImages;
}

export class ClaimCall implements AddClaimCall {
  finArrived: number;
  clientArrived: number;
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
  makeDescription: string;
  subProductId: number;
  subSubProductId: number;
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
  repLocation: string;
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



}

export class ClaimPassenger implements Passenger {
  pasAddress: string;
  passengerId: number; pasFirstName: string;
  pasLastName: string;
  pasIdNumber: string;
  pasContactNumber: string;
  pasInjuriesDescription: string;
  pasPurpose: string;
  pasValid: boolean;

}

export class ClaimWitness implements Witness {
  witnessIdNumber: string;
  witnessFirstName: string;
  witnessLastName: string;
  witnessContactNumber: string;
  witnessAddress: string;
}

export class ClaimProperty implements Property {
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
  // Image fields
  tyreImage: MediaManagerResult;
  tyreThreadImage: MediaManagerResult;
  rimImage: MediaManagerResult;
}

export class ClaimThirdparty implements Thirdparty {
  tpMakeDescription: string;
  tpPropertyDescription: string;
  tpDamageDescription: string;
  tpIsInsured: boolean;
  tpVehicleMake: number;
  tpVehicleModel: string;
  tpVehicleRegistrationNumber: string;
  tpVehicleDescriptionOfDamage: string;
  tpVehicleOwnerFirstName: string;
  tpVehicleOwnerLastName: string;
  tpVehicleOwnerIdNumber: string;
  tpVehicleOwnerContactDetails: string;
  tpVehicleOwnerAddress: string;
  tpValid: boolean;
  tpId: number;
  tpFirstName: string;
  tpLastName: string;
  tpIdNumber: string;
  tpContactNumber: string;
  tpAddress: string;

  // Created for app
  sameAsDriver: boolean;
  vehicleImages: MediaManagerResult[] = [];
  licenseImage: MediaManagerResult;
}

export class ClaimVehicle implements Vehicle {
  vehId: number;
  vehicleDescription: string;
  vehicleTypeId: number;
  registrationNumber: string;
  makeId: number;
  model: string;
  vehicleYear: number;
  vehicleColour: string;
  vehicleTransmission: string;
  vehicleUnderWarrantee: boolean;
  vehicleVinNumber: string;
  vehicleChassisNumber: string;
  vehicleClientRefId: string;
  vehicleValid: boolean;
}

export class ClaimAddress implements Address {
  addressId: number; description: string;
  unitNumber: string;
  streetName: string;
  suburb: string;
  townId: number;
  provinceId: number;
  valid: boolean;
}

export class ClaimDriver implements Driver {
  driverId: number; driverIdNumber: string;
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

export class ClaimClaimant implements Claimant {
  claimantId: number;
  claimantAddress: string;
  claimantContactNumber: string;
  claimantFirstName: string;
  claimantIdNumber: string;
  claimantLastName: string;
  claimantOccupation: string;
  claimantValid: boolean;
}

export class ClaimPatient implements Patient {
  injuredMedicalCosts: number;
  injuredMedicalServiceProvider: string;
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
}

export class ClaimImages {

  constructor() {
    this.damagePhotos = [];
  }

  driversLicenseImage: MediaManagerResult = new MediaManagerResult();
  licenseDiscImage: MediaManagerResult = new MediaManagerResult();
  quoteImage: MediaManagerResult = new MediaManagerResult();
  windscreenImage: MediaManagerResult = new MediaManagerResult();
  damagePhotos: MediaManagerResult[] = [];
  accidentSketch: string = '';

  insuredSignature: string = '';
  driverSignature: string = '';
}