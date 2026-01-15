import { AccidentFormData, ValidationErrors } from '../types/accident-form';

export const validateAccidentForm = (formData: AccidentFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.firstName) {
        errors.firstName = true;
    }
    if (!formData.lastName) {
        errors.lastName = true;
    }
    if (!formData.accidentType) {
        errors.accidentType = true;
    }
    if (!formData.dateOfBirth) {
        errors.dateOfBirth = true;
    }
    if (!formData.hasEmergencyContact) {
        errors.hasEmergencyContact = true;
    }
    if (!formData.address) {
        errors.address = true;
    }

    return errors;
};

export const getInitialFormData = (): AccidentFormData => ({
    firstName: '',
    lastName: '',
    accidentType: '',
    dateOfBirth: '',
    hasEmergencyContact: '',
    numberOfPersons: [],
    address: '',
    description: '',
    borough: '',
    year: '',
});
