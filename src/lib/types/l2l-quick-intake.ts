export interface L2LQuickIntakeFormData {
    clientPhoneNumber: string;
    clientFirstName: string;
    clientLastName: string;
    wasAutomobileAccident: string;
    accidentLocation: string;
    accidentDate: string;
    note: string;
}

export interface L2LQuickIntakeValidationErrors {
    [key: string]: boolean;
}

