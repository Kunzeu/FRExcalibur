export interface AccidentFormData {
    firstName: string;
    lastName: string;
    accidentType: string;
    dateOfBirth: string;
    hasEmergencyContact: string;
    numberOfPersons: string[];
    address: string;
    description: string;
    borough: string;
    year: string;
}

export interface ValidationErrors {
    [key: string]: boolean;
}
