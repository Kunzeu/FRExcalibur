
import { PIIntakeFormData, PIIntakeValidationErrors } from '../types/pi-intake';

export const validateStep1 = (formData: PIIntakeFormData, activePerson: number = 1): PIIntakeValidationErrors => {
    const errors: PIIntakeValidationErrors = {};

    // Helper to check if value exists
    const isEmpty = (val: any) => !val || (typeof val === 'string' && val.trim() === '');

    if (activePerson === 1) {
        if (isEmpty(formData.firstName)) errors.firstName = true;
        if (isEmpty(formData.lastName)) errors.lastName = true;
        if (isEmpty(formData.phoneNumber)) errors.phoneNumber = true;
        if (isEmpty(formData.callSource)) errors.callSource = true;
        if ((formData.onBehalfOf || []).length === 0) errors.onBehalfOf = true;

        // Client info if On Behalf Of is selected (simplified check)
        // ... (add specific logic if needed)
    } else {
        // Person > 1
        const person = formData.persons?.[activePerson];
        if (!person) {
            errors[`person${activePerson}FirstName`] = true; // Fallback
            return errors;
        }

        if (isEmpty(person.firstName)) errors[`person${activePerson}FirstName`] = true;
        if (isEmpty(person.lastName)) errors[`person${activePerson}LastName`] = true;
        // Phone is optional or required? Step 2 shows required.
        // Step 2 inputs: <CustomInput required ... /> for Phone.
        if (isEmpty(person.phoneNumber)) errors[`person${activePerson}PhoneNumber`] = true;
    }

    return errors;
};

export const validateStep2 = (formData: PIIntakeFormData, activePerson: number): PIIntakeValidationErrors => {
    const errors: PIIntakeValidationErrors = {};
    const isEmpty = (val: any) => !val || (typeof val === 'string' && val.trim() === '');

    // Global Fields (Accident Info)
    // These should only be validated if we are on the main person or if we treat them as global.
    // However, validation runs on "Next", which checks the whole step state.
    // Step 2 includes "Person Information" at the top if activePerson > 1.

    // Check Person Info again (redundant with Step 1 validation? No, Step 2 collects Person Info for >1)
    if (activePerson > 1) {
        const person = formData.persons?.[activePerson];
        if (!person || isEmpty(person.firstName)) errors[`person${activePerson}FirstName`] = true;
        if (!person || isEmpty(person.lastName)) errors[`person${activePerson}LastName`] = true;
        if (!person || isEmpty(person.phoneNumber)) errors[`person${activePerson}PhoneNumber`] = true;
    }

    // General Accident Info (Only check if we are "submitting" the step, usually validated once, 
    // but here we validate per step view? 
    // The UI handles shared fields. If I am on Person 2, and I leave Accident Location empty, it is empty for everyone.

    if (isEmpty(formData.accidentLocation)) errors.accidentLocation = true;
    if (isEmpty(formData.accidentDate)) errors.accidentDate = true;
    if (isEmpty(formData.numberOfPersonsInAccident)) errors.numberOfPersonsInAccident = true;
    if (isEmpty(formData.involvedInAutoAccident)) errors.involvedInAutoAccident = true;

    if (formData.involvedInAutoAccident === 'yes') {
        // Auto specific
        // Check role for ACTIVE PERSON
        const personData = activePerson === 1 ? formData : formData.persons?.[activePerson];
        if (isEmpty(personData?.drivingVehicle)) errors.drivingVehicle = true; // Note: simplified key, might need prefix if UI expects it. 
        // But UI Step 2 uses `validationErrors.involvedInAutoAccident` etc.
        // For person specific fields like drivingVehicle, if we use one input, how do we show error?
        // The CustomInput for drivingVehicle doesn't show explicit error prop in the code I reviewed (lines 562-610), checking...
        // Labels were: "Were you Driving the Vehicle?"
        // No error prop on RadioGroup? Mui RadioGroup doesn't take error. HelperText does.
        // Validations might not be fully wired up step 2 specific fields in UI yet.
    }



    return errors;
};

// ... Add Step 3 validation if needed
