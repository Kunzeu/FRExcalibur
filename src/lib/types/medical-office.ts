export interface MedicalOffice {
    id: string;
    totalQuota: number; // Keeping existing logic for now, even if hidden in modal
    name: string;
    monthlyQuota: number;
    usedQuota: number;
    availableQuota: number;
    active: boolean;
    priority: boolean;
    transportation: boolean;
    scheduleTypes: {
        neck: boolean;
        back: boolean;
    };
    address: string;
    phone: string;
    // New fields from design
    doctorName?: string;
    borough?: string;
    contactName?: string;
    contactLastname?: string;
    contactEmail?: string;
    contactEmails?: string;
    emailsMedicalUpdates?: string;
    emailMedicalRecords?: string;
    specialists?: string;
    primaryPhone?: string;
    secondaryPhone?: string;
    cellPhone?: string;
    primaryEmail?: string;
    secondaryEmail?: string;
    addressPrimary?: string;
    addressSecondary?: string;
    limitPerClinicOwner?: string;
    network?: string;
    clinicServiceSchedule?: string;
    clinicType?: string;
    typeOfInjuries?: string;
    typeOfService?: string;
    status?: string;
    doctorQuota?: string;
    notes?: string;
    note?: string; // Singular note for specialist form
    extensions?: string;
    hasSpecialistAddress?: boolean;
    // Specialist specific fields
    medicalCenterAddress?: string;
    hoursOfAttention?: string;
    medicalCenterPhone?: string;
    contacts?: string; // Different from contactName
    medicalRecordsEmails?: string;
    secondStatus?: boolean; // Second status field for specialist form
}

export interface MedicalOfficeFilters {
    type: 'medical' | 'specialist';
    borough: string;
    month: string;
    year: string;
}
