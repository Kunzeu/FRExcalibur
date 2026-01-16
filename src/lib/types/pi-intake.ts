export interface PIIntakeFormData {
    // Client Information
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string; // Last 4 digits or full? Usually full for PI.
    phone: string;
    email: string;
    address: string;
    addressUnit: string; // Apt, Suite, Unit
    city: string;
    state: string;
    zipCode: string;

    // Accident Information
    accidentDate: string;
    accidentTime: string;
    accidentLocation: string;
    accidentType: string;
    accidentDescription: string;
    policeReportFiled: string; // 'yes' | 'no'
    policeReportCopyObtained?: string; // 'yes' | 'no' - if filed=yes
    policeReportFile?: string; // attachment
    policeReportFiledAtPrecinct?: string; // 'yes' | 'no' - if filed=no
    policePrecinct?: string;
    reportNumber?: string;

    // Vehicle/Insurance Information (if auto)
    clientVehicle?: string;
    clientInsuranceCompany?: string;
    clientPolicyNumber?: string;
    clientClaimNumber?: string;

    defendantName?: string;
    defendantVehicle?: string;
    defendantInsuranceCompany?: string;
    defendantPolicyNumber?: string;
    defendantClaimNumber?: string;

    // Injury/Medical Information
    injuries: string;
    wentToHospital: string; // 'yes' | 'no'
    hospitalName?: string;
    ambulanceUsed: string; // 'yes' | 'no'
    currentTreatingDoctor?: string;

    // Employment
    employed: string; // 'yes' | 'no'
    employerName?: string;
    missedWork: string; // 'yes' | 'no'
    // Worker's Compensation Specifics
    reportedAccidentToEmployer?: string; // 'yes' | 'no'
    reportedInjuryTo?: string;
    jobTitle?: string;
    netWage?: string;
    hasPayStubs?: string; // 'yes' | 'no' - for Checks
    hasProofOfWorkMessages?: string; // 'yes' | 'no' - for Cash
    dateReportedToEmployer?: string;
    reasonNotReportedToEmployer?: string; // If reportedAccidentToEmployer is 'no'
    textMessagesWithBoss?: string; // 'yes' | 'no'
    payrollFrequency?: string; // Weekly, Bi-weekly, etc.
    paymentMethod?: string;
    employmentDuration?: string;
    workedSinceAccident?: string; // 'yes' | 'no'
    postAccidentWorkDuration?: string; // New field for the side-by-side question
    employerAddress?: string;
    hasWorkUniformOrMaterial?: string; // 'yes' | 'no'
    thirdPartyInvolved?: string; // 'yes' | 'no'
    thirdPartyInvolvementDescription?: string;
    priorAccidents?: string; // 'yes' | 'no'
    priorAccidentDate?: string;
    priorAccidentType?: string;
    priorAccidentLegalRep?: string; // 'yes' | 'no'
    priorAccidentInjuries?: string;

    // New Fields from Design
    callSource: string;
    callSubSource: string;
    onBehalfOf: string[];
    phoneNumber: string;
    minorsInAccident: string;

    // Client Info (Distinct from Lead info)
    clientFirstName: string;
    clientLastName: string;
    clientPhone: string;
    person2FirstName?: string;
    person2LastName?: string;
    person3FirstName?: string;
    person3LastName?: string;
    person4FirstName?: string;
    person4LastName?: string;
    person5FirstName?: string;
    person5LastName?: string;
    person6FirstName?: string;
    person6LastName?: string;

    // Step 2: Accident Specifics
    involvedInAutoAccident: string;
    accidentAtWork: string;
    injuredBySlipFall: string;
    affectedByMalpractice: string;
    otherAccidentType: string;
    howCanIHelpDescription: string;
    daysSinceAccident: string;
    accidentState: string;
    numberOfPersonsInAccident: string;
    drivingVehicle: string;
    workingAtTime: string;
    policeCalled: string;
    vehicleStayedAtScene: string;
    hasLicensePlatePicture: string;
    policeArrivedAtScene: string;
    ambulanceCalled: string;
    ambulanceArrivedAtScene: string;
    paramedicsTreated: string;
    ambulanceTookToHospital: string;
    ambulanceHospital: string;
    presentedToHospital: string;

    // Step 4: Personal Information
    preferredLanguage: string;
    nationality: string;
    sameAddressAsLead: string;
    hasEmergencyContact: string; // 'yes' | 'no'
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;

    // Step 4: Lawyer & Sign Up
    selectedLawyer: string;
    signUpMethod: string;
    signUpNotes: string;
    liveLeadDone: string; // 'yes' | 'no'
    liveLeadPerformedBy: string;
    liveLeadNotDoneReason?: string; // Step 4 conditional

    // Step 5: Medical
    lawyerStatus: string;
    legalStatusNote: string;
    isCaseLien: string;
    medicalStatus: string;
    medicalStatusNote: string;
    typeOfPolicy: string;
    typeOfPolicyNote: string;
    typeOfCommercialPolicy: string;
    micStatus: string;
    micDetails: string;

    // Step 3: Injuries (Restored for Root/Person 1)
    headPain?: boolean;
    neckPain?: boolean;
    backPain?: boolean;
    lowerBackPain?: boolean;
    lostBrokenTeeth?: boolean;
    lacerationStitches?: boolean;
    multipleContusions?: boolean;
    admittedToHospital?: boolean;
    surgery?: boolean;
    otherInjury?: boolean;
    rightShoulderPain?: boolean;
    rightArmPainRadiating?: boolean;
    rightLegPainRadiating?: boolean;
    rightKneePain?: boolean;
    leftShoulderPain?: boolean;
    leftArmPainRadiating?: boolean;
    leftLegPainRadiating?: boolean;
    leftKneePain?: boolean;
    fracturedBone?: boolean;
    hasDied?: boolean;

    // Follow-ups
    fractureBonesDetails?: string;
    teethDetails?: string;
    hospitalDays?: string;
    stitchesDetails?: string;
    surgeryDetails?: string;
    otherInjuryDetails?: string;

    // Multi-Person Data Storage
    // This allows storing specific data for each person involved (1 to N)
    // For Person 1, we still often access the root fields for backward compatibility, 
    // but we can also map them here.
    persons: { [key: number]: PersonIntakeInfo };
}

export interface PersonIntakeInfo {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
    dateOfBirth?: string;
    address?: string;

    // Injuries
    injuries?: string; // Description text

    // Injury Checkboxes (matching root)
    headPain?: boolean;
    neckPain?: boolean;
    backPain?: boolean;
    lowerBackPain?: boolean;
    lostBrokenTeeth?: boolean;
    lacerationStitches?: boolean;
    multipleContusions?: boolean;
    admittedToHospital?: boolean;
    surgery?: boolean;
    otherInjury?: boolean;
    rightShoulderPain?: boolean;
    rightArmPainRadiating?: boolean;
    rightLegPainRadiating?: boolean;
    rightKneePain?: boolean;
    leftShoulderPain?: boolean;
    leftArmPainRadiating?: boolean;
    leftLegPainRadiating?: boolean;
    leftKneePain?: boolean;
    fracturedBone?: boolean;
    hasDied?: boolean;

    // Follow-ups
    fractureBonesDetails?: string;
    teethDetails?: string;
    hospitalDays?: string;
    stitchesDetails?: string;
    surgeryDetails?: string;
    otherInjuryDetails?: string;

    // Step 2: Role & Accident Specifics
    drivingVehicle?: string;
    workingAtTime?: string;

    // Step 3: Employment & Worker's Comp
    reportedAccidentToEmployer?: string;
    reportedInjuryTo?: string;
    jobTitle?: string;
    netWage?: string;
    hasPayStubs?: string;
    hasProofOfWorkMessages?: string;
    dateReportedToEmployer?: string;
    reasonNotReportedToEmployer?: string;
    textMessagesWithBoss?: string;
    payrollFrequency?: string;
    paymentMethod?: string;
    employmentDuration?: string;
    workedSinceAccident?: string;
    postAccidentWorkDuration?: string;
    employerAddress?: string;
    hasWorkUniformOrMaterial?: string;
    thirdPartyInvolved?: string;
    thirdPartyInvolvementDescription?: string;

    // Prior Accidents
    priorAccidents?: string;
    priorAccidentDate?: string;
    priorAccidentType?: string;
    priorAccidentLegalRep?: string;
    priorAccidentInjuries?: string;

    // Medical
    turnedToHospital?: string; // 'yes' | 'no'
    hospitalName?: string;
    ambulanceUsed?: string;
    ambulanceArrivedAtScene?: string;
    paramedicsTreated?: string;
    ambulanceTookToHospital?: string;
    ambulanceHospital?: string;
    presentedToHospital?: string;
}

export interface PIIntakeValidationErrors {
    [key: string]: boolean;
}

export const initialPIIntakeFormData: PIIntakeFormData = {
    // Initialize persons map
    persons: {},

    // New Fields
    callSource: '',
    callSubSource: '',
    onBehalfOf: [],
    phoneNumber: '',
    minorsInAccident: '',


    // Client Info
    clientFirstName: '',
    clientLastName: '',
    clientPhone: '',
    person2FirstName: '',
    person2LastName: '',
    person3FirstName: '',
    person3LastName: '',
    person4FirstName: '',
    person4LastName: '',
    person5FirstName: '',
    person5LastName: '',
    person6FirstName: '',
    person6LastName: '',

    // Step 2: Accident Specifics
    involvedInAutoAccident: '',
    accidentAtWork: '',
    injuredBySlipFall: '',
    affectedByMalpractice: '',
    otherAccidentType: '',
    howCanIHelpDescription: '',
    daysSinceAccident: '',
    accidentState: '',
    numberOfPersonsInAccident: '',
    drivingVehicle: '',
    workingAtTime: '',
    policeCalled: '',
    vehicleStayedAtScene: '',
    hasLicensePlatePicture: '',
    policeArrivedAtScene: '',
    ambulanceCalled: '',
    ambulanceArrivedAtScene: '',
    paramedicsTreated: '',
    ambulanceTookToHospital: '',
    ambulanceHospital: '',
    presentedToHospital: '',

    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    phone: '',
    email: '',
    address: '',
    addressUnit: '',
    city: '',
    state: '',
    zipCode: '',
    accidentDate: '',
    accidentTime: '',
    accidentLocation: '',
    accidentType: '',
    accidentDescription: '',
    policeReportFiled: '',
    policeReportCopyObtained: '',
    policeReportFile: '',
    policeReportFiledAtPrecinct: '',
    injuries: '',
    wentToHospital: '',
    ambulanceUsed: '',
    employed: '',
    missedWork: '',
    reportedAccidentToEmployer: '',
    reportedInjuryTo: '',
    jobTitle: '',
    netWage: '',
    hasPayStubs: '',
    hasProofOfWorkMessages: '',
    dateReportedToEmployer: '',
    reasonNotReportedToEmployer: '',
    textMessagesWithBoss: '',
    payrollFrequency: '',
    paymentMethod: '',
    employmentDuration: '',
    workedSinceAccident: '',
    postAccidentWorkDuration: '',
    employerAddress: '',
    hasWorkUniformOrMaterial: '',
    thirdPartyInvolved: '',
    thirdPartyInvolvementDescription: '',
    priorAccidents: '',
    priorAccidentDate: '',
    priorAccidentType: '',
    priorAccidentLegalRep: '',
    priorAccidentInjuries: '',

    // Step 3: Injuries
    headPain: false,
    neckPain: false,
    backPain: false,
    lowerBackPain: false,
    lostBrokenTeeth: false,
    lacerationStitches: false,
    multipleContusions: false,
    admittedToHospital: false,
    surgery: false,
    otherInjury: false,
    rightShoulderPain: false,
    rightArmPainRadiating: false,
    rightLegPainRadiating: false,
    rightKneePain: false,
    leftShoulderPain: false,
    leftArmPainRadiating: false,
    leftLegPainRadiating: false,
    leftKneePain: false,
    fracturedBone: false,
    hasDied: false,

    // Follow-ups
    fractureBonesDetails: '',
    teethDetails: '',
    hospitalDays: '',
    stitchesDetails: '',
    surgeryDetails: '',
    otherInjuryDetails: '',

    // Step 4: Personal Information
    preferredLanguage: '',
    nationality: '',
    sameAddressAsLead: '',
    hasEmergencyContact: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',

    // Step 4: Lawyer & Sign Up
    selectedLawyer: '',
    signUpMethod: '',
    signUpNotes: '',
    liveLeadDone: '',
    liveLeadPerformedBy: '',
    liveLeadNotDoneReason: '',

    // Step 5: Status
    lawyerStatus: '',
    legalStatusNote: '',
    isCaseLien: '',
    medicalStatus: '',
    medicalStatusNote: '',
    typeOfPolicy: '',
    typeOfPolicyNote: '',
    typeOfCommercialPolicy: '',
    micStatus: '',
    micDetails: '',
};

export const ACCIDENT_TYPES_PI = [
    'Auto Accident',
    'Slip and Fall',
    'Workplace Accident',
    'Medical Malpractice',
    'Construction Accident',
    'Product Liability',
    'Wrongful Death',
    'Other'
];
