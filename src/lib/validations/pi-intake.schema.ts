import { z } from 'zod';

// Helper for yes/no enum
const yesNoEnum = z.enum(['yes', 'no', '']);

// Schema definition matching PIIntakeFormData
export const piIntakeSchema = z.object({
    // Client Information
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    ssn: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    addressUnit: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),

    // Accident Information
    accidentDate: z.string().optional(),
    accidentTime: z.string().optional(),
    accidentLocation: z.string().optional(),
    accidentType: z.string().optional(),
    accidentDescription: z.string().optional(),
    policeReportFiled: yesNoEnum.optional(),
    policeReportCopyObtained: yesNoEnum.optional(),
    policeReportFile: z.string().optional(),
    policeReportFiledAtPrecinct: yesNoEnum.optional(),
    policePrecinct: z.string().optional(),
    reportNumber: z.string().optional(),

    // Vehicle/Insurance Information
    clientVehicle: z.string().optional(),
    clientInsuranceCompany: z.string().optional(),
    clientPolicyNumber: z.string().optional(),
    clientClaimNumber: z.string().optional(),
    defendantName: z.string().optional(),
    defendantVehicle: z.string().optional(),
    defendantInsuranceCompany: z.string().optional(),
    defendantPolicyNumber: z.string().optional(),
    defendantClaimNumber: z.string().optional(),

    // Injury/Medical Information
    injuries: z.string().optional(),
    wentToHospital: yesNoEnum.optional(),
    hospitalName: z.string().optional(),
    ambulanceUsed: yesNoEnum.optional(),
    currentTreatingDoctor: z.string().optional(),

    // Employment
    employed: yesNoEnum.optional(),
    employerName: z.string().optional(),
    missedWork: yesNoEnum.optional(),
    reportedAccidentToEmployer: yesNoEnum.optional(),
    reportedInjuryTo: z.string().optional(),
    jobTitle: z.string().optional(),
    netWage: z.string().optional(),
    hasPayStubs: yesNoEnum.optional(),
    hasProofOfWorkMessages: yesNoEnum.optional(),
    dateReportedToEmployer: z.string().optional(),
    reasonNotReportedToEmployer: z.string().optional(),
    textMessagesWithBoss: yesNoEnum.optional(),
    payrollFrequency: z.string().optional(),
    paymentMethod: z.string().optional(),
    employmentDuration: z.string().optional(),
    workedSinceAccident: yesNoEnum.optional(),
    postAccidentWorkDuration: z.string().optional(),
    employerAddress: z.string().optional(),
    hasWorkUniformOrMaterial: yesNoEnum.optional(),
    thirdPartyInvolved: yesNoEnum.optional(),
    thirdPartyInvolvementDescription: z.string().optional(),
    priorAccidents: yesNoEnum.optional(),
    priorAccidentDate: z.string().optional(),
    priorAccidentType: z.string().optional(),
    priorAccidentLegalRep: yesNoEnum.optional(),
    priorAccidentInjuries: z.string().optional(),

    // New Fields
    callSource: z.string().optional(),
    callSubSource: z.string().optional(),
    onBehalfOf: z.array(z.string()).optional(),
    phoneNumber: z.string().optional(),
    minorsInAccident: z.string().optional(),

    // Client Info
    clientFirstName: z.string().optional(),
    clientLastName: z.string().optional(),
    clientPhone: z.string().optional(),
    person2FirstName: z.string().optional(),
    person2LastName: z.string().optional(),
    person3FirstName: z.string().optional(),
    person3LastName: z.string().optional(),
    person4FirstName: z.string().optional(),
    person4LastName: z.string().optional(),
    person5FirstName: z.string().optional(),
    person5LastName: z.string().optional(),
    person6FirstName: z.string().optional(),
    person6LastName: z.string().optional(),

    // Step 2: Accident Specifics
    involvedInAutoAccident: yesNoEnum.optional(),
    accidentAtWork: yesNoEnum.optional(),
    injuredBySlipFall: yesNoEnum.optional(),
    affectedByMalpractice: yesNoEnum.optional(),
    otherAccidentType: yesNoEnum.optional(),
    howCanIHelpDescription: z.string().optional(),
    daysSinceAccident: z.string().optional(),
    accidentState: z.string().optional(),
    numberOfPersonsInAccident: z.string().optional(),
    drivingVehicle: yesNoEnum.optional(),
    workingAtTime: yesNoEnum.optional(),
    policeCalled: yesNoEnum.optional(),
    policeArrivedAtScene: yesNoEnum.optional(),
    ambulanceCalled: yesNoEnum.optional(),
    ambulanceArrivedAtScene: yesNoEnum.optional(),
    paramedicsTreated: yesNoEnum.optional(),
    ambulanceTookToHospital: yesNoEnum.optional(),
    ambulanceHospital: z.string().optional(),
    presentedToHospital: yesNoEnum.optional(),

    // Step 4: Personal Information
    preferredLanguage: z.string().optional(),
    nationality: z.string().optional(),
    sameAddressAsLead: z.string().optional(),
    hasEmergencyContact: yesNoEnum.optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyContactRelation: z.string().optional(),

    // Step 4: Lawyer & Sign Up
    selectedLawyer: z.string().optional(),
    signUpMethod: z.string().optional(),
    signUpNotes: z.string().optional(),
    liveLeadDone: yesNoEnum.optional(),
    liveLeadPerformedBy: z.string().optional(),
    liveLeadNotDoneReason: z.string().optional(),

    // Step 5: Medical / Lawyer Status
    lawyerStatus: z.string().optional(),
    legalStatusNote: z.string().optional(),
    isCaseLien: z.string().optional(),
    medicalStatus: z.string().optional(),
    medicalStatusNote: z.string().optional(),
    typeOfPolicy: z.string().optional(),
    typeOfPolicyNote: z.string().optional(),
    typeOfCommercialPolicy: z.string().optional(),
    micStatus: z.string().optional(),
    micDetails: z.string().optional(),

    // Step 3: Injuries (Booleans)
    headPain: z.boolean().optional(),
    neckPain: z.boolean().optional(),
    backPain: z.boolean().optional(),
    lowerBackPain: z.boolean().optional(),
    lostBrokenTeeth: z.boolean().optional(),
    lacerationStitches: z.boolean().optional(),
    multipleContusions: z.boolean().optional(),
    admittedToHospital: z.boolean().optional(),
    surgery: z.boolean().optional(),
    otherInjury: z.boolean().optional(),
    rightShoulderPain: z.boolean().optional(),
    rightArmPainRadiating: z.boolean().optional(),
    rightLegPainRadiating: z.boolean().optional(),
    rightKneePain: z.boolean().optional(),
    leftShoulderPain: z.boolean().optional(),
    leftArmPainRadiating: z.boolean().optional(),
    leftLegPainRadiating: z.boolean().optional(),
    leftKneePain: z.boolean().optional(),
    fracturedBone: z.boolean().optional(),
    hasDied: z.boolean().optional(),

    // Follow-ups
    fractureBonesDetails: z.string().optional(),
    teethDetails: z.string().optional(),
    hospitalDays: z.string().optional(),
    stitchesDetails: z.string().optional(),
    surgeryDetails: z.string().optional(),
    otherInjuryDetails: z.string().optional(),

    // Multi-Person Data Storage (recursive or simple object for now to avoid complexity)
    // Since Zod recursion can be tricky, we'll use z.record(z.any()) or a simplified schema if needed
    // But for now, let's just allow any object for persons to prevent type errors
    persons: z.record(z.any()).optional(),

});

export type PIIntakeSchemaType = z.infer<typeof piIntakeSchema>;
